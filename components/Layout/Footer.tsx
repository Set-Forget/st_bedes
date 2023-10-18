import React from 'react';

import { Button } from 'primereact/button';
        
interface Props {
    title: string | null
    action: () => void
}

const Footer: React.FC<Props> = ({ title, action }) => {
    return (
        <div className='flex align-items-center pb-2'>
            {title && (
                <Button 
                    label={title}
                    rounded
                    icon="pi pi-arrow-left"
                    size='large'
                    onClick={action}
                />
            )}
        </div>
    );
};

export default Footer;