'use client'

import {createContext, useEffect, useState} from 'react'
import {AuthSession, Session, getExpInMs, getWaitInMs} from './index'
import refreshSession from './refreshSession'

export const defaultSession:Session={
  user: null,
  token: '',
  status: 'missing'
}

export const initSession: AuthSession = {
  session: defaultSession,
  setSession: () => defaultSession
}

export const AuthContext = createContext<AuthSession>(initSession)

// AuthProvider used in _app to share session between all components
export function AuthProvider(props: any) {
  const [session, setSession] = useState<Session>(props?.session)

  // console.group('AuthProvider')
  // console.log('session...', session)
  // console.log('props.session...', props?.session)
  // console.groupEnd()

  useEffect(() => {
    // schedule
    let schedule: any
    // only if authenticated = valid token
    if (session.status === 'authenticated'
      && session?.user?.exp) {
      const {user} = session
      const expiresInMs = getExpInMs(user.exp)
      const waitInMs = getWaitInMs(expiresInMs)
      // console.log('waitInMs...', waitInMs)
      if (schedule) clearTimeout(schedule)
      if (expiresInMs <= 0) {
        // token expired
        setSession({
          ...session,
          status: 'expired',
          token: `AuthProvider session EXPIRED for account ${session.user.account}`,
          user: null
        })
      }else{
        // console.log(`schedule refresh in ${waitInMs/1000}sec.`)
        schedule = setTimeout(() => {
          // console.log('call...refreshSession...',user.account)
          // refresh token by sending current valid cookie
          refreshSession()
            .then(newSession => {
              // console.log('newSession.token...', newSession?.token)
              // update only if "valid" session
              if (newSession?.status === 'authenticated') {
                setSession(newSession)
                // console.log('AuthProvider...session...UPDATED')
              } else {
                // replace with default, not authenticated
                setSession(defaultSession)
                // console.log('AuthProvider...session...REMOVED')
              }
            })
        },waitInMs)
      }
    }
    return () => {
      if (schedule) {
        // console.log('remove schedule...', schedule)
        clearTimeout(schedule)
      }
    }
  }, [session])

  return <AuthContext.Provider value={{session, setSession}} {...props}/>
}
