'use server'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { signInSchema } from '@/schemas/loginSchema'
import { AuthError } from 'next-auth'
import { z } from 'zod'

type FormData = z.infer<typeof signInSchema>

export const login = async (values: FormData) => {
  const validatedFields = signInSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { username, password } = validatedFields.data

  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
    return { success: 'success' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid Credentials' }
        default:
          return { error: 'Something went wrong!' }
      }
    }
    throw error
  }
}
