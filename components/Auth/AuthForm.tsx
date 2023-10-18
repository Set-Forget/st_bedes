import React from 'react';

import Image from 'next/image';

interface Props {
    children: React.ReactNode
    title?: string
}

const AuthForm: React.FC<Props> = ({ children, title }) => { 
    return (
        <div className="min-h-screen w-screen flex align-items-center justify-content-center" style={{ backgroundColor: '#000' }}>
            <div className="flex flex-column align-items-center w-full max-w-25rem" >
                <div className='mb-5'>
                    <Image
                        src='/img/logo.png'
                        alt='logo'
                        width={250}
                        height={250}
                    />
                </div>
                {title && <h2 className='text-5xl mb-5 color-white'>{title}</h2>}
                <div className='flex-1 flex flex-column w-full'>
                    {children}
                </div>
            </div>

        </div>
    );
};

export default AuthForm;