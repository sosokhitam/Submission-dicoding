import Loading from '../components/Loading.jsx';

const meta = {
  title: 'Forum/Loading',
  component: Loading,
};

export default meta;

export function Default() {
  return <Loading />;
}

export function Kustom() {
  return <Loading text="Memuat threads…" />;
}
