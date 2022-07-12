import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import _ from 'lodash';

interface CSVDownloadProps {
  data: { [key: string]: any }[];
  name: string;
  extraClassName?: string;
  text?: string;
  icon?: string;
}

const CSVDownload = ({
  data,
  name,
  extraClassName,
  text = 'Download',
  icon = 'fas fa-file-alt',
}: CSVDownloadProps) => {
  const generateCSV = async () => {
    const wb = new ExcelJS.Workbook();
    const sheet = wb.addWorksheet('Sheet 1');
    sheet.columns = _.map(Object.keys(data[0]), (key) => ({
      header: key,
      key,
      width: 10,
      outlineLevel: 1,
    }));

    _.forEach(data, (row) => {
      sheet.addRow({ ...row });
    });

    const buf = await wb.csv.writeBuffer();
    if (buf) {
      const blob = new Blob([buf]);
      const file = new File([blob], `${name}.csv`, {
        type: 'application/octet-stream',
      });
      saveAs(file);
    }
  };
  return (
    <div>
      <button
        id='csv_download'
        className={`btn btn-secondary rounded-lg text-center ${extraClassName}`}
        type='button'
        onClick={() => generateCSV()}
      >
        <span className='font-bold'>{text}</span>
        <i className={`ml-2 ${icon}`} />
      </button>
    </div>
  );
};

export default CSVDownload;
