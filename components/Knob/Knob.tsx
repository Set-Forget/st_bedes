import React from 'react';

import { Knob as PrimeKnob } from 'primereact/knob';

interface Props {
    value: number
    title: string
    className?: string
}

const Knob: React.FC<Props> = ({ value, title, className }) => {
    
    return (
        <div className={`flex flex-column align-items-center ${className || ''}`}>
            <PrimeKnob 
                value={value} 
                onChange={(e) => false} 
                valueTemplate={'{value}%'} 
                valueColor="var(--teal-400)" 
                // rangeColor="#48d1cc"
            />
            <p className='text-xl mt-2 font-medium' style={{ color: `var(--gray-900)`}}>
                {title}
            </p>
        </div>
    )
}

export default Knob;