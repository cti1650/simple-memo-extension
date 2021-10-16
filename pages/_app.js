import '../styles/globals.css';
import { Header } from '../components/Layout/Header';

function MyApp({ Component, pageProps }) {
  // console.log('rendaring');
  return (
    <div
      className='py-1 px-2 md:w-full md:h-full border'
      style={{ minHeight: '558px', minWidth: '384px' }}
    >
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
