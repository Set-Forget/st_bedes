import React, { useEffect, useState } from 'react';

import { InputTextarea } from "primereact/inputtextarea";

import SelectAnswer from './SelectAnswer';

import { Question as QuestionInterface } from '@/shared/types';

interface Props extends QuestionInterface {
    updateValue: (value: string | undefined, id: number) => void
}

const Question: React.FC<Props> = ({ title, content, type, options, value, error, question_id, updateValue }) => {
    
    const [ selectOptions, setSelectOptions ] = useState<string[]>([]);

    useEffect(() => {
        // API response looks like this: ['Agree','Not sure','Disagree']

        if(!options) return; // on text question

        const validJSONString = options.replace(/'/g, '"')

        const json = JSON.parse(`${validJSONString}`);

        setSelectOptions(json);
    }, [ options ]);


    const updateValueHandler = (value: string | undefined) => {
        updateValue(value, question_id);
    }

    return (
        <div className={`question mb-6 p-5 border-round-3xl line-height-3 border-2 ${error ? 'border-red-400' : 'border-transparent'}`}>
            <p className='text-2xl font-semibold mb-3'>{title}</p>
            <div className="flex align-items-center justify-content-between">
                <p className='text-xl font-medium mr-5'>{content}</p>
                {type === 'text' && (
                    <InputTextarea 
                        autoResize 
                        value={value || ''} 
                        onChange={(e) => updateValueHandler(e.target.value)} 
                        rows={5} 
                        cols={30} 
                        style={{ minWidth: '400px' }}
                    />
                )}
                {type === 'select' && (
                    <SelectAnswer 
                        options={selectOptions}
                        value={value}
                        updateValueHandler={updateValueHandler}
                    />
                )}
            </div>
        </div>
    );
};

export default Question;