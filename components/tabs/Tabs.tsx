import Link from 'next/link';
import cc from 'classcat';
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { PageTab } from './Tab';

type PageTabsProp = {
  pageCount?: number,
  onChange?: (index: number) => void,
  onInit?: (index: number) => void,
}

export const PageTabs = (props: PageTabsProp) => {
  const { pageCount, onChange, onInit } = props;
  const [tabIndex, setTabIndex] = useLocalStorage('tabPage', 0);
  const handleTabChange = useCallback((index) => {
    if (typeof onChange === 'function') {
      onChange(index)
    }
    setTabIndex(prev => { if (prev !== index) { return index } });
  }, [onChange]);
  useEffect(() => {
    if (typeof onInit === 'function') {
      onInit(tabIndex);
    }
  }, [onInit])
  return (<>
    <div className="w-full">
      <div className="w-full flex flex-row">
        {pageCount > 0 && [...new Array(pageCount)].map((item, index) => {
          return (<PageTab key={index} index={index} focus={tabIndex === index} onTabClick={handleTabChange}></PageTab>)
          // return (<button className={cc([
          //   "w-full py-0.5 text-xl text-center border rounded-t-lg focus:outline-none",
          //   {
          //     "bg-white shadow-inner": tabIndex !== index,
          //     "bg-blue-400 shadow": tabIndex === index
          //   },
          // ])
          // }
          //   onClick={() => { handleTabChange(index) }}
          // >
          //   {index}
          // </button>)
        })}
      </div>
    </div>
  </>)
};

PageTabs.defaultProps = {
  pageCount: 10,
}