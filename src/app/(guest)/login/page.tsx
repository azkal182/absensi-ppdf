import React from 'react'
import LoginForm from './LoginForm'

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-secondary py-6 sm:py-12">
      <div className="relative py-3 sm:mx-auto sm:max-w-xl">
        <div className="absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
        <div className="relative bg-white px-4 py-10 shadow-lg dark:bg-background sm:rounded-3xl sm:p-20">
          <div className="mx-auto max-w-md">
            <div>
              <h1 className="text-2xl font-semibold">Login</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
