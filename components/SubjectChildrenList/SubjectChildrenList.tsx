import React from 'react';

import Selector from '@/components/Selector/Selector';

import { Questionnaire } from '@/shared/types';

interface Props {
    questionnaire: Questionnaire
    selectHandler: (value: string) => void
}

const SubjectChildrenList: React.FC<Props> = ({ questionnaire, selectHandler }) => {

    const isEmpty = Object.keys(questionnaire).length === 0;

    return (
        <div className="w-full flex flex-wrap py-8">
            {isEmpty && <p className='text-3xl font-medium'>You dont have pending surveys.</p> }
            {Object.keys(questionnaire).map(subject => {

                return (
                    <Selector 
                        key={subject}
                        title={subject}
                        width={50}
                        hover
                        className='mb-5'
                        onClick={() => selectHandler(subject)}
                    />
                );
            })}
        </div>
    );
};

export default SubjectChildrenList;