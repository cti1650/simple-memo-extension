import Link from 'next/link';
import cc from 'classcat';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type PageTabsProp = {
  saveKey?: number,
  openKey?: number,
}

export const Textbox = (props: PageTabsProp) => {
  const { saveKey, openKey } = props;
  const refTitle = useRef(null);
  const [title, setTitle] = useLocalStorage('title_' + saveKey, '');
  const handleChangeTitle = useCallback((e) => {
    setTitle(prev => { if (prev !== e.target.value) { return e.target.value } });
  }, [saveKey]);
  const ref = useRef(null);
  const [value, setValue] = useLocalStorage(saveKey, '');
  const handleChange = useCallback((e) => {
    setValue(prev => { if (prev !== e.target.value) { return e.target.value } });
  }, [saveKey]);
  // console.log(value);
  return (<>
    {saveKey === openKey &&
      <div className="w-full flex flex-col">
        <label className="text-sm select-none">
          Title
          <input type='text' ref={refTitle} onChange={handleChangeTitle} className="w-full px-2 text-lg break-all border rounded-lg shadow-inner focus:outline-none" value={title} />
        </label>
        <label className="text-sm select-none">
          Memo
          <textarea ref={ref} onChange={handleChange} className="w-full p-2 text-lg break-all border rounded-lg shadow-inner focus:outline-none" style={{ height: '430px' }} value={value}></textarea>
        </label>
      </div>
    }
  </>)
};

Textbox.defaultProps = {
  key: 0,
}