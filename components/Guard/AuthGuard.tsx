import { ReactNode, ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

// import { useVoicedAuth } from '@/APIS/context/authContext';

import { useAuth } from '@/context/authContext';

interface AuthGuardProps {
    children: ReactNode
    fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {

    const { children, fallback } = props;

    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady || auth.authLoading) return;

        if (auth.user === null) {
            router.replace({
                pathname: '/login',
                // query: { returnUrl: router.asPath }
            })
        }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
     [ router.route, router.isReady, auth.user, auth.authLoading ])

    if (auth.authLoading || auth.user === null) {
        return fallback
    }

    return <>{children}</>
}

export default AuthGuard;