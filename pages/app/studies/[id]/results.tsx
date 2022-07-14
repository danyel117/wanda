import { useLazyQuery, useQuery } from '@apollo/client';
import Loading from '@components/Loading';
import PageHeader from '@components/PageHeader';
import { Tooltip } from '@mui/material';
import matchRoles from '@utils/matchRoles';
import {
  GET_EVALUATION_STUDY_RESULT,
  GET_EXPORT_DATA,
} from 'graphql/queries/evaluationStudyResult';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import _ from 'lodash';
import {
  ExtendedQuestionResponse,
  ExtendedStudySession,
  ExtendedStudySessionTask,
} from 'types';
import { toast } from 'react-toastify';
import { RadialBarChart } from '@components/charts/RadialBarChart';

const Chart: any = dynamic(() => import('react-apexcharts'), { ssr: false });

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { rejected, isPublic, page } = await matchRoles(ctx);
  return {
    props: {
      rejected,
      isPublic,
      page,
    },
  };
};

interface DownloadTask {
  participant: string;
  task: string;
  status: string;
  startTime?: Date;
  endTime?: Date;
}

interface DownloadQuestion {
  participant: string;
  question: string;
  sus: boolean;
  responseText?: string;
  responseNumber?: number;
}

interface DownloaDataInterface {
  tasks: DownloadTask[];
  questions: DownloadQuestion[];
}

const EvaluationStudyResults: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const id: string = router.query.id as string;
  const [fetch, { data, loading: queryLoading }] = useLazyQuery(
    GET_EXPORT_DATA,
    {
      variables: {
        evaluationStudyId: id,
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const generateCSV = async (
    name: string,
    downloadData: DownloaDataInterface
  ) => {
    const wb = new ExcelJS.Workbook();
    const sheet = wb.addWorksheet('Tasks');
    sheet.columns = _.map(Object.keys(downloadData.tasks[0]), (key) => ({
      header: key,
      key,
      width: 10,
      outlineLevel: 1,
    }));

    _.forEach(downloadData.tasks, (row) => {
      sheet.addRow({ ...row });
    });

    const sheet2 = wb.addWorksheet('Questions');
    sheet2.columns = _.map(Object.keys(downloadData.questions[0]), (key) => ({
      header: key,
      key,
      width: 10,
      outlineLevel: 1,
    }));

    _.forEach(downloadData.questions, (row) => {
      sheet2.addRow({ ...row });
    });

    const buf = await wb.xlsx.writeBuffer();

    if (buf) {
      const blob = new Blob([buf]);
      const file = new File([blob], `${name}.xlsx`, {
        type: 'application/octet-stream',
      });
      saveAs(file);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setLoading(true);
      const downloadData: DownloaDataInterface = {
        tasks: [],
        questions: [],
      };
      if (data.evaluationStudy.sessions.length > 0) {
        data.evaluationStudy.sessions.forEach((es: ExtendedStudySession) => {
          es.taskList.forEach((tl: ExtendedStudySessionTask) => {
            downloadData.tasks.push({
              participant: es.participant.email ?? '',
              task: tl.task.description,
              status: tl.status,
              startTime: tl.startTime ?? undefined,
              endTime: tl.endTime ?? undefined,
            });
          });
          es.questionResponses.forEach((q: ExtendedQuestionResponse) => {
            downloadData.questions.push({
              participant: es.participant.email ?? '',
              question: q.question.question ?? '',
              sus: q.question.sus,
              responseText: q.responseText ?? undefined,
              responseNumber: q.responseNumber ?? undefined,
            });
          });
        });

        generateCSV('data-export', downloadData);
      } else {
        toast.error('No data to export');
        setLoading(false);
      }
    }
  }, [data]);
  return (
    <div className='flex h-full flex-col p-10'>
      <PageHeader title='Evaluation study results'>
        <button
          onClick={() => fetch()}
          type='button'
          className='primary flex h-[40px] w-[125px] items-center justify-center'
        >
          {loading || queryLoading ? (
            <ReactLoading type='spin' height={20} width={20} />
          ) : (
            <span>Export data</span>
          )}
        </button>
      </PageHeader>
      <EvaluationResultsChart />
    </div>
  );
};

const EvaluationResultsChart = () => {
  const router = useRouter();
  const id: string = router.query.id as string;
  const { data, loading } = useQuery(GET_EVALUATION_STUDY_RESULT, {
    variables: {
      getEvaluationResultsId: id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [options, setOptions] = useState<any>({
    chart: {
      height: 350,
      type: 'column',
      stacked: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [1, 1, 4],
    },
    xaxis: {
      categories: [],
      labels: {
        show: false,
        // rotate: 0,
        // rotateAlways: false,
        // trim: true,
      },
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB',
        },
        labels: {
          style: {
            colors: '#008FFB',
          },
          formatter(value: number) {
            return value?.toFixed(0) ?? '';
          },
        },
        title: {
          text: 'Task Duration (seconds)',
          style: {
            color: '#008FFB',
          },
        },
      },
      {
        min: 0,
        max: 100,
        seriesName: 'Success rate',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396',
        },
        labels: {
          style: {
            colors: '#00E396',
          },
          formatter(value: number) {
            return `${value.toFixed(0)}%`;
          },
        },
        title: {
          text: 'Success rate (%)',
          style: {
            color: '#00E396',
          },
        },
      },
    ],
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
  });

  const [series, setSeries] = useState<any>([]);

  const [totalProgress, setTotalProgress] = useState<number>(0);

  const pieOptions = {
    labels: [
      'Finished sessions',
      'Not started sessions',
      'Missing participants',
    ],
    legend: {
      position: 'bottom',
    },
  };
  const [pieData, setPieData] = useState<number[]>([]);

  useEffect(() => {
    if (data) {
      setSeries([
        {
          name: 'Task average duration (seconds)',
          data: data.getEvaluationResults.taskResults.map(
            (tr: any) => tr.duration
          ),
          type: 'column',
        },
        {
          name: 'Task success rate (%)',
          data: data.getEvaluationResults.taskResults.map(
            (tr: any) => tr.successRate * 100
          ),
          type: 'column',
        },
      ]);
      setOptions({
        ...options,
        xaxis: {
          ...options.xaxis,
          categories: data.getEvaluationResults.taskResults.map((dt: any) => [
            `Task ${dt.order}:`,
            `${dt.description}`,
          ]),
        },
      });
      setTotalProgress(
        ((data.getEvaluationResults.participantStatus?.completed ?? 0) * 100) /
          data.getEvaluationResults.participantStatus.participantTarget
      );
      setPieData([
        data.getEvaluationResults.participantStatus?.completed ?? 0,
        data.getEvaluationResults.participantStatus?.notStarted ?? 0,
        data.getEvaluationResults.participantStatus?.missing ?? 0,
      ]);
    }
  }, [data]);

  if (loading) return <Loading />;

  return (
    <div className='flex h-full items-center justify-center'>
      <div className='w-1/4'>
        <Tooltip
          title={`Finished: ${data.getEvaluationResults.participantStatus.completed} | Target: ${data.getEvaluationResults.participantStatus.participantTarget}`}
        >
          <div>
            <RadialBarChart value={totalProgress} />
          </div>
        </Tooltip>
        <RadialBarChart
          value={data.getEvaluationResults.sus.toFixed(1) ?? 0}
          label='Average SUS Score'
          unit=''
        />
      </div>
      <div className='w-1/2'>
        <Chart series={series} options={options} type='bar' height={350} />
      </div>
      <div className='w-1/4'>
        <Chart options={pieOptions} series={pieData} type='pie' height={350} />
      </div>
    </div>
  );
};

export default EvaluationStudyResults;
