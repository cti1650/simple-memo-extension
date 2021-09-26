import Link from 'next/link';
import cc from 'classcat';
import { useEffect, useState } from 'react';

type PageTabsProp = {
  pageCount?: number,
  onChange?: (index: number) => void,
  onInit?: (index: number) => void,
}

export const PageTabs = (props: PageTabsProp) => {
  const { pageCount, onChange, onInit } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (index) => {
    if (typeof onChange === 'function') {
      onChange(index)
    }
    setTabIndex(index);
  }
  useEffect(() => {
    if (typeof onInit === 'function') {
      onInit(tabIndex);
    }
  }, [])
  return (<>
    <div className="w-full">
      <div className="w-full flex flex-row">
        {pageCount > 0 && [...new Array(pageCount)].map((item, index) => {
          return (<button className={cc([
            "w-full py-0.5 text-xl text-center border rounded-t-lg focus:outline-none",
            {
              "bg-white shadow-inner": tabIndex !== index,
              "bg-blue-400 shadow": tabIndex === index
            },
          ])
          }
            onClick={() => { handleTabChange(index) }}
          >
            {index}
          </button>)
        })}
      </div>
    </div>
  </>)
};

PageTabs.defaultProps = {
  pageCount: 10,
}