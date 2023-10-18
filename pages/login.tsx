import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import AuthForm from '@/components/Auth/AuthForm';
import { useAuth } from '@/context/authContext';

const LoginPage = () => { 

    const { login, userType, setUserType } = useAuth();

    

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ usernameError, setUsernameError ] = useState('');
    const [ passwordError, setPasswordError ] = useState('');
    const [ fetching, setFetching ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');

    useEffect(() => {
        if(!userType) return;

        setUsername(userType === 'student' ? 'dummy1@student.sbcm.co.uk' : 'yk_afo2007@yahoo.co.uk');
        setPassword(userType === 'student' ? 'DdkU4p4rmOmebZ' : '814ha6mARnqN3L');
    }, [ userType ]);
 
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(fetching) return;

        setErrorMessage('');

        const trimUsername = username.trim();
        const trimPassword = password.trim();

        if (trimUsername === '') {
            setUsernameError('Username cannot be empty');
        } else {
            setUsernameError('');
        }
    
        if (trimPassword === '') {
            setPasswordError('Password cannot be empty');
        } else {
            setPasswordError('');
        }
        
        if (trimUsername !== '' && trimPassword !== '') {

            setFetching(true);

            const json = await login(username, password);

            if(json.status !== 200) {
                setErrorMessage(json.message || 'Something went wrong.');
            }

            setFetching(false);
        }
    };

    if(!userType) return (
        <div className="min-h-screen w-screen flex align-items-center justify-content-center" style={{ backgroundColor: '#000' }}>
            <div className="flex flex-column align-items-center w-full max-w-20rem" >
                <div className='mb-5'>
                    <Image
                        src='/img/logo.png'
                        alt='logo'
                        width={250}
                        height={250}
                    />
                </div>
                <div className="flex flex-column w-full">
                    <div 
                        className="p-6 px-8 bg-white cursor-pointer border-round-2xl mb-5"
                        onClick={() => setUserType('student')}
                    >
                        <p className='text-center text-2xl font-medium'>Student</p>
                    </div>
                    <div 
                        className="p-6 px-8 bg-white cursor-pointer border-round-2xl"
                        onClick={() => setUserType('parent')}
                    >
                        <p className='text-center text-2xl font-medium'>Parent</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AuthForm title='Welcome Back'>
            <form className='w-100' onSubmit={handleSubmit}>
                <div className='mb-4 flex flex-column align-items-end'>
                    <div className="w-full p-input-icon-left flex-1 flex">
                        <i className="pi pi-user"></i>
                        <InputText 
                            placeholder="Username" 
                            className={`flex-1 p-inputtext-lg border-3 ${usernameError ? 'p-invalid' : ''}`}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        /> 
                    </div>
                    {usernameError && (
                        <small className='color-white'>
                            Username is required.
                        </small>
                    )}
                </div>
                <div className='mb-1 flex flex-column align-items-end'>
                    <div className="w-full p-input-icon-left flex-1 flex">
                        <i className="pi pi-lock"></i>
                        <InputText 
                            placeholder="Password" 
                            className={`flex-1 p-inputtext-lg border-3 ${passwordError ? 'p-invalid' : ''}`}
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        /> 
                    </div>
                    {passwordError && (
                        <small className='color-white'>
                            Password is required.
                        </small>
                    )}
                </div>
                <p className='text-xl mb-2 text-red-500'>
                    {errorMessage}
                </p>
                <Button 
                    label='Login'
                    className='mb-3 p-3 w-full'
                    loading={fetching}
                />
                {/* <div className="flex mb-5">
                    <Button 
                        label='Fogot Password'
                        link
                        className='p-0'
                    />
                </div> */}
                {/* <div className="flex justify-content-center">
                    <Button 
                        label="Don't Have an Account? Request."
                        link
                        className='p-0'
                    />
                </div> */}
            </form>
            <div className='flex justify-content-end'>
                <Button 
                    label={userType === 'parent' ? 'Student' : 'Parent'}
                    severity='warning'
                    onClick={() => setUserType(type => type === 'parent' ? 'student' : 'parent')}
                />
            </div>
        </AuthForm>
    );
};

LoginPage.guestGuard = true;

export default LoginPage;