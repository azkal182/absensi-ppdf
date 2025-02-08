'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

const ProressBarProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#00ddff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  )
}

export default ProressBarProviders
