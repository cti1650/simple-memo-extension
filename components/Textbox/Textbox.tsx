import Link from 'next/link';
import cc from 'classcat';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type PageTabsProp = {
  saveKey?: number | string,
}

export const Textbox = (props: PageTabsProp) => {
  const { saveKey } = props;
  const ref = useRef(null);
  const [value, setValue] = useLocalStorage(saveKey, null);
  useEffect(() => {
    ref.current.value = value;
  }, [saveKey]);
  const handleChange = useCallback((e) => {
    if (value === null) {
      setValue(e.target.value);
    } else {
      if (value !== e.target.value) {
        setValue(e.target.value);
      }
    }
  }, [saveKey]);
  return (<>
    <div className="w-full">
      <textarea ref={ref} onChange={handleChange} className="w-full p-2 text-lg rounded-lg shadow-inner focus:outline-none" style={{ height: '450px' }}></textarea>
    </div>
  </>)
};

Textbox.defaultProps = {
  key: 0,
}