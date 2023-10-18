import React, { useEffect, useState } from 'react';

import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';

interface Props {
    options: string[]
    value: string | undefined
    updateValueHandler: (value: string) => void
}

const SelectAnswer: React.FC<Props> = ({ options, value, updateValueHandler }) => {
    
    return (
        <SelectButton 
            value={value} 
            onChange={(e: SelectButtonChangeEvent) => updateValueHandler(e.value)} 
            options={options} 
            className='select-button'
            itemTemplate={(value) => {

                return (
                    <p className='text-xl font-medium'>
                        {value}
                    </p>
                )
            }}
        />
    );
};

export default SelectAnswer;