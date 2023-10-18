import React from 'react';

interface Props {
    title: string | React.ReactNode
    width: 50 | 100
    onClick?: () => void
    hover?: boolean
    className?: string
    textClassName?: string
}

const Selector: React.FC<Props> = ({ title, width, onClick, hover, className, textClassName }) => {
    return (
        <div className={`selector-container ${width === 50 ? "selector-container-50" : "selector-container-100"}`}>
            <div 
                className={`selector shadow-2 p-5 border-round-3xl cursor-pointer ${hover ? "selector-hover" : ""} ${className || ''}`} 
                onClick={onClick}
            >
                {typeof title === 'string' ? (
                    <p className={`${textClassName || 'text-3xl font-medium'}`}>
                        {title}
                    </p>
                ) : title}
            </div>
        </div>
    );
};

export default Selector;