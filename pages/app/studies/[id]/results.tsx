import { useQuery } from '@apollo/client';
import Loading from '@components/Loading';
import { Tooltip } from '@mui/material';
import matchRoles from '@utils/matchRoles';
import { GET_EVALUATION_STUDY_RESULT } from 'graphql/queries/evaluationStudyResult';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
const EvaluationStudyResults: NextPage = () => {
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

  const radialBarOptions = {
    colors: ['#20E647'],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '70%',
          background: '#293450',
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15,
          },
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: '#fff',
            fontSize: '13px',
          },
          value: {
            color: '#fff',
            fontSize: '30px',
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors: ['#87D4F9'],
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  };
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
        (data.getEvaluationResults.participantStatus.completed * 100) /
          data.getEvaluationResults.participantStatus.participantTarget
      );
      setPieData([
        data.getEvaluationResults.participantStatus.completed,
        data.getEvaluationResults.participantStatus.notStarted,
        data.getEvaluationResults.participantStatus.missing,
      ]);
    }
  }, [data]);

  if (loading) return <Loading />;

  return (
    <div className='p-10'>
      <div className='flex w-full justify-center'>
        <h1>Evaluation Study Results</h1>
      </div>
      <div className='flex items-center justify-center'>
        <Tooltip
          title={`Finished: ${data.getEvaluationResults.participantStatus.completed} | Target: ${data.getEvaluationResults.participantStatus.participantTarget}`}
        >
          <div className='w-1/4'>
            <Chart
              options={radialBarOptions}
              series={[totalProgress]}
              type='radialBar'
              height={350}
            />
          </div>
        </Tooltip>
        <div className='w-1/2'>
          <Chart series={series} options={options} type='bar' height={350} />
        </div>
        <div className='w-1/4'>
          <Chart
            options={pieOptions}
            series={pieData}
            type='pie'
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default EvaluationStudyResults;
