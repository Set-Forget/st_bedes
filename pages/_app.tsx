import type { AppProps } from 'next/app'

import type { NextPage } from 'next';

import "primereact/resources/themes/lara-light-blue/theme.css";    

import "primereact/resources/primereact.min.css";   

import 'primeicons/primeicons.css';

import '../node_modules/primeflex/primeflex.css';

import AuthGuard from '@/components/Guard/AuthGuard';
import GuestGuard from '@/components/Guard/GuestGuard';

import '@/public/css/style.css'
import { ContextContainer } from '@/context/ContextContainer';

type ExtendedAppProps = AppProps & {
    Component: NextPage & {
        authGuard?: boolean
        guestGuard?: boolean
    }
  }

type GuardProps = {
    authGuard: boolean
    guestGuard: boolean
    children: React.ReactNode
  }
  
  const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
      if (guestGuard) {
          return <GuestGuard fallback={null}>{children}</GuestGuard>
      } else if (!guestGuard && !authGuard) {
          return <>{children}</>
      } else {
          return <AuthGuard fallback={null}>{children}</AuthGuard>
      }
  }

  export default function App({ Component, pageProps }: ExtendedAppProps) {

    const authGuard = Component.authGuard ?? true

    const guestGuard = Component.guestGuard ?? false

    return (
        <ContextContainer>
            <Guard authGuard={authGuard} guestGuard={guestGuard}>
                <Component {...pageProps} />
            </Guard>
        </ContextContainer>
    )
}