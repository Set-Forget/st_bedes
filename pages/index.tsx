import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAuth } from '@/context/authContext';

const Homepage = () => { 

    const { user } = useAuth();

    const router = useRouter();

    useEffect(() => {
        router.replace(!user ? '/login' : '/home');
    }, [ router, user ]);

    return null;
};

export default Homepage;