import Link from 'next/link';
import { useRouter } from 'next/router';
import cc from 'classcat';

export const Header = () => {
  const router = useRouter();
  console.log(router);
  console.log(router.query.id);
  return (<>
    <div className="w-full pb-4">
      <h1 className='text-2xl text-center font-extrabold'>
        Simple Memo Extension
      </h1>
    </div>
  </>)
};