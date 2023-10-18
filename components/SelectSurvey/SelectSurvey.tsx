import React from 'react';

import Selector from '@/components/Selector/Selector';

interface Props {
    pending: () => void
}

const SelectSurvey: React.FC<Props> = ({ pending }) => {
    return (
        <div className="w-full flex flex-wrap">
            <Selector 
                title='Pending Surveys'
                width={50}
                hover
                className='mb-5'
                onClick={pending}
            />
            <Selector 
                title='Finished Surveys'
                width={50}
                hover
                className='mb-5'
            />
        </div>
    );
};

export default SelectSurvey;