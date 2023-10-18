import React from 'react';

interface Props {
    children: React.ReactNode
    className?: string
}

const Description: React.FC<Props> = ({ children, className }) => {
    return (
        <p className={`text-3xl mb-5 ${className || ''}`}>
            {children}
        </p>
    );
};

export default Description;