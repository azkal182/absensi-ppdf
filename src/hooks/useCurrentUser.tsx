'use client'

import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export const useCurrentSession = () => {
  const [session, setSession] = useState<Session | null>(null)
  // Changed the default status to loading
  const [status, setStatus] = useState<string>('loading')
  const pathName = usePathname()

  const retrieveSession = useCallback(async () => {
    try {
      const sessionData = await getSession()
      if (sessionData) {
        setSession(sessionData)
        setStatus('authenticated')
        return
      }

      setStatus('unauthenticated')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setStatus('unauthenticated')
      setSession(null)
    }
  }, [])

  useEffect(() => {
    // We only want to retrieve the session when there is no session
    if (!session) {
      retrieveSession()
    }

    // use the pathname to force a re-render when the user navigates to a new page
  }, [retrieveSession, session, pathName])

  return { session, status }
}
