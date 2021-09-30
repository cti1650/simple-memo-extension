import Link from 'next/link';
import cc from 'classcat';
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorageData } from '../../hooks/useLocalStorage';

type PageTabProp = {
  focus?: boolean,
  index?: number,
  onTabClick?: (index: number) => void,
}

export const PageTab = (props: PageTabProp) => {
  const { focus, index, onTabClick } = props;
  const [getTabTitle] = useLocalStorageData('title_' + index);
  const [getTabValue] = useLocalStorageData(index);
  const [title, setTitle] = useState('');
  const [havingData, setHavingData] = useState(false);
  const handleTabClick = useCallback(() => {
    if (typeof onTabClick === 'function') {
      if (!focus) {
        onTabClick(index)
      }
    }
  }, [onTabClick, focus]);
  useEffect(() => {
    setHavingData(getTabValue() || getTabTitle());
    setTitle(getTabTitle());
  }, [focus]);
  return (<>
    <button title={title} className={cc([
      "w-full py-0.5 text-xl text-center border rounded-t-lg select-none focus:outline-none",
      {
        "bg-gray-400": !havingData && !focus,
        "bg-white shadow-inner": havingData && !focus,
        "bg-blue-400 shadow": focus
      },
    ])
    }
      onClick={handleTabClick}
    >
      {index}
    </button>
  </>)
};

PageTab.defaultProps = {
  focus: false,
  index: 0,
}