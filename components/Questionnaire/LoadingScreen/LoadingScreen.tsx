import React from 'react';

import { ProgressSpinner } from 'primereact/progressspinner';

import { useAuth } from '@/context/authContext';

const LoadingScreen = () => {

    const { user } = useAuth();

    return (
        <div className='flex flex-column'>
            <h3 className='text-4xl font-medium line-height-3'>Welcome {user!.full_name}, <br /> please wait while we prepare the questions for you</h3>
            <ProgressSpinner 
                strokeWidth="4"
                className='ml-0 mt-3'
            />
        </div>
    );
};

export default LoadingScreen;