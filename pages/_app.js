import '../styles/globals.css';
import { Header } from '../components/Layout/Header';

function MyApp({ Component, pageProps }) {
  console.log('rendaring');
  return (
    <div className='py-1 px-6 w-96 h-1/2 border'>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
