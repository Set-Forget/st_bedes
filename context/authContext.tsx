import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';

import fetchApi, { ApiResponse } from '@/shared/fetchApi';

import { User } from '@/shared/types';

interface Auth {
    authLoading: boolean
    userType: null | "student" | "parent"
    setUserType: React.Dispatch<React.SetStateAction<"student" | "parent" | null>>
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    login: (email: string, password: string) => Promise<ApiResponse<User>>
    logout: () => void
}

const AuthContext = createContext<Auth>(null!);

interface Props {
    children: ReactNode
}

const AuthProvider = ({ children }: Props) => {

    const [ loading, setLoading ] = useState(true);
    
    const [ userType, setUserType ] = useState<null | 'student' | 'parent'>('student');

    const [ user, setUser ] = useState<null | User>(null);

    useEffect(() => {
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {

        const url = userType === 'student' ? `?action=authenticateStudent&studentEmail=${email}&studentPassword=${password}` : 
        `?action=authenticateParent&parentEmail=${email}&parentPassword=${password}`;

        const json = await fetchApi<User>(url, {
            method: 'GET'
        });

        if(json.status === 200) {
            setUser(json.response);
        }

        return json;
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{
            authLoading: loading,
            userType,
            setUserType,
            user,
            setUser,
            login,
            logout
        }}>
            {!loading ? children : null}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext)

export { AuthContext, AuthProvider, useAuth }