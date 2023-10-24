import React, { useEffect, useState } from 'react';

import Selector from '@/components/Selector/Selector';

import { Questionnaire } from '@/shared/types';

interface Props {
    questionnaire: Questionnaire
    emptyMessage: string
    selectHandler: (value: string) => void
}

const SubjectChildrenList: React.FC<Props> = ({ questionnaire, emptyMessage, selectHandler }) => {

    const isEmpty = Object.keys(questionnaire).length === 0;
    
    console.log("Received questionnaire data:", questionnaire);

    return (
        <div className="w-full flex flex-wrap py-8">
            {isEmpty && <p className='text-3xl font-medium'>{emptyMessage}</p> }
            {Object.keys(questionnaire)
            .filter(key => key && key !== "undefined" && questionnaire[key] && questionnaire[key].length > 0)
            .map(item => {

                return (
                    <Selector 
                        key={item}
                        title={item}
                        width={50}
                        hover
                        className='mb-4'
                        onClick={() => selectHandler(item)}
                    />
                );
            })}
        </div>
    );
};


export default SubjectChildrenList;