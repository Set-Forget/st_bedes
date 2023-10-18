import React, { useMemo } from 'react';

import { Button } from 'primereact/button';

import Knob from '../Knob/Knob';
import Selector from '../Selector/Selector';

import { useAuth } from '@/context/authContext';

import { QuestionnaireKnobType } from '@/pages/home';

interface Props {
    title: string
    knobType: QuestionnaireKnobType
    schoolProgressPercentage: number
    teacherProgressPercentage: number
    questionnaireProgressPercentage: number
}

const Header: React.FC<Props> = ({ title, knobType, schoolProgressPercentage, questionnaireProgressPercentage, teacherProgressPercentage }) => {

    const { user, logout } = useAuth();

    const getKnob = useMemo(() => {
        if(knobType === 'questionnaire') return (
            <Knob 
                title='Survey progress'
                value={questionnaireProgressPercentage} 
            />
        )

        if(knobType === 'overall') return (
            <>
                <Knob 
                    title='School progress'
                    value={schoolProgressPercentage}
                    className='mr-5'
                />
                <Knob 
                    title='Teacher progress'
                    value={teacherProgressPercentage}
                />
            </>
        )

    }, [ knobType, questionnaireProgressPercentage, schoolProgressPercentage, teacherProgressPercentage ]);

    return (
        <div className='flex justify-content-between'>
            <div className='flex mr-8'>
                {getKnob}
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