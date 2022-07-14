import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RadialBarChartProps {
  value: number;
  unit?: string;
  label?: string;
}

const RadialBarChart = ({
  value,
  unit = '%',
  label = 'Progress',
}: RadialBarChartProps) => {
  const getColor = (vl: number) => {
    if (vl < 50) {
      return '#ff0000';
    }
    if (vl < 75) {
      return '#ffa500';
    }
    return '#00ff00';
  };
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -180,
        endAngle: 180,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px',
          },
          value: {
            formatter: (val: number) => `${val}${unit}`,
            color: '#111',
            fontSize: '36px',
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'fill',
      colors: [getColor(value)],
    },
    stroke: {
      lineCap: 'round',
    },
    labels: [label],
  };
  return (
    <Chart options={options} series={[value]} type='radialBar' height={350} />
  );
};

export { RadialBarChart };
