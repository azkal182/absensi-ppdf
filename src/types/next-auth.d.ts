import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: number | undefined
    username: string
    role: string
  }

  interface Session {
    user?: User
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    username: string
    role: string
  }
}
