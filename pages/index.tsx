import React, { useEffect, useState } from 'react';
import { PageTabs } from '../components/tabs/Tabs';
import { Textbox } from '../components/Textbox/Textbox';

const Pages = () => {
    const [tabPage, setTabPage] = useState(0);
    const handleChange = (index) => {
        setTabPage(index);
        console.log(index);
    }
    // console.log('rendaring');
    return (
        <>
            <PageTabs onChange={handleChange} onInit={handleChange} pageCount={10} />
            <div className='w-full h-full'>
                <div className='w-full h-full'>
                    <Textbox saveKey={0} openKey={tabPage} />
                    <Textbox saveKey={1} openKey={tabPage} />
                    <Textbox saveKey={2} openKey={tabPage} />
                    <Textbox saveKey={3} openKey={tabPage} />
                    <Textbox saveKey={4} openKey={tabPage} />
                    <Textbox saveKey={5} openKey={tabPage} />
                    <Textbox saveKey={6} openKey={tabPage} />
                    <Textbox saveKey={7} openKey={tabPage} />
                    <Textbox saveKey={8} openKey={tabPage} />
                    <Textbox saveKey={9} openKey={tabPage} />
                </div>
            </div>
        </>
    );
};

export default Pages;
