import React, { useMemo } from 'react';

import { Button } from 'primereact/button';

import Knob from '../Knob/Knob';
import Selector from '../Selector/Selector';

import { useAuth } from '@/context/authContext';

import { QuestionnaireKnobType } from '@/pages/home';

interface Props {
    title: string
    knob: React.ReactNode
}

const Header: React.FC<Props> = ({ title, knob }) => {

    const { user, logout } = useAuth();

    return (
        <div className='flex justify-content-between bg-red-100'>
            <div className='flex mr-8'>
                {knob}
            </div>
            <div className='flex flex-column ml-8'>
                <Selector 
                    title={(
                        <div className='flex align-items-center'>
                            <i className="pi pi-user"></i>
                            <p className='text-xl font-medium mx-3'>
                                {user!.full_name}
                            </p>
                            <Button 
                                label="Logout" 
                                size='small'
                                onClick={logout}
                            />
                        </div>
                    )}
                    width={100}
                    className='mb-3'
                />
                <Selector 
                    title={title}
                    width={100}
                    textClassName='font-medium text-xl'
                />
            </div>
        </div>
    );
};

export default Header;