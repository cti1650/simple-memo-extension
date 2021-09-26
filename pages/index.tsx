import React, { useEffect, useState } from 'react';
import { PageTabs } from '../components/tabs/Tabs';
import { Textbox } from '../components/Textbox/Textbox';
import { useChromeExtension } from '../hooks/useChromeExtension';

const Pages = () => {
    const sampleUrl = '';
    const { tabPageUrl, tabPageTitle } = useChromeExtension();
    const [tabPage, setTabPage] = useState(0);
    const handleChange = (index) => {
        setTabPage(index);
        console.log(index);
    }
    console.log('rendaring');
    return (
        <>
            <PageTabs onChange={handleChange} onInit={handleChange} pageCount={0} />
            <div className='w-full h-full'>
                <div className='w-full h-full'>
                    <Textbox saveKey={tabPage} />
                </div>
            </div>
        </>
    );
};

export default Pages;
