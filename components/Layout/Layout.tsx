import React from 'react';

import Header from './Header';
import Footer from './Footer';
import { QuestionnaireKnobType } from '@/pages/home';

interface Props {
    children: React.ReactNode
    knob: React.ReactNode
    headerTitle: string
    footerTitle: string | null
    footerAction: () => void
}

const Layout: React.FC<Props> = ({ 
        children, 
        knob,
        headerTitle, 
        footerTitle, 
        footerAction 
}) => {

    return (
        <div className="container py-3 h-screen">
            <div className='flex flex-column h-full'>
                <Header 
                    title={headerTitle}
                    knob={knob}
                />
                <div className='flex-1'>
                    {children}
                </div>
                <Footer 
                    title={footerTitle}
                    action={footerAction}
                />
            </div>
        </div>
    );
};



export default Layout;