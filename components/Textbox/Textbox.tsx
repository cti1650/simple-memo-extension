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
  const ref = useRef(null);
  const [value, setValue] = useLocalStorage(saveKey, null);
  const handleChange = useCallback((e) => {
    setValue(prev => { if (prev !== e.target.value) { return e.target.value } });
  }, [saveKey]);
  // console.log(value);
  return (<>
    {saveKey === openKey &&
      <div className="w-full">
        <textarea ref={ref} onChange={handleChange} className="w-full p-2 text-lg border rounded-b-lg shadow-inner focus:outline-none" style={{ height: '450px' }} value={value}></textarea>
      </div>
    }
  </>)
};

Textbox.defaultProps = {
  key: 0,
}