import React from 'react';

import { AuthProvider } from './authContext';

interface Props {
    children: React.ReactNode
}

export const ContextContainer: React.FC<Props> = ({ children}) => {

    return (
        <AuthProvider 

        >
            {children}
        </AuthProvider>
    );
};