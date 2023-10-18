import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import AuthForm from '@/components/Auth/AuthForm';
import { useAuth } from '@/context/authContext';

const LoginPage = () => { 

    const { login, userType } = useAuth();

    const u = userType === 'student' ? 'dummy1@student.sbcm.co.uk' : 'yk_afo2007@yahoo.co.uk';
    const p = userType === 'student' ? 'DdkU4p4rmOmebZ' : '814ha6mARnqN3L';

    const [ username, setUsername ] = useState(u);
    const [ password, setPassword ] = useState(p);
    const [ usernameError, setUsernameError ] = useState('');
    const [ passwordError, setPasswordError ] = useState('');
    const [ fetching, setFetching ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
 
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
        </AuthForm>
    );
};

LoginPage.guestGuard = true;

export default LoginPage;