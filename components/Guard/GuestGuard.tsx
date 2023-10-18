import { ReactNode, ReactElement, useEffect } from 'react'

import { useRouter } from 'next/router'

import { useAuth } from '@/context/authContext'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const { returnUrl } = router.query;

    if (auth.user) {

        router.replace(returnUrl as string || '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route, router.isReady, auth.user]) 

  if (auth.authLoading || (!auth.authLoading && auth.user !== null)) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
