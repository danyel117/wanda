import ReactLoading from 'react-loading';

const Loading = () => <div>Loading...</div>;

const MiniLoading = ({ color = '#fff' }: { color?: string }) => (
  <ReactLoading type='spin' color={color} height={20} width={20} />
);

export { MiniLoading };

export default Loading;
