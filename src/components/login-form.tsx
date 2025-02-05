'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signInSchema } from '@/schemas/loginSchema'
import { login } from '@/actions/login'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | undefined>('')
  const { pending } = useFormStatus()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    await login(values).then((data) => {
      setError('')
      if (data?.error) {
        setError(data.error)
      }
    })
  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="dark:bg-danger-dark-light mb-4 flex items-center rounded bg-red-200 p-3.5 text-red-600">
              <span className="text-center ltr:pr-2 rtl:pl-2">
                <strong className="ltr:mr-1 rtl:ml-1">{error}!</strong>
              </span>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  {...register('username')}
                  autoComplete="off"
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                />
                {errors.username && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.username.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  {...register('password')}
                  autoComplete="off"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                {errors.password && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <Button disabled={pending} type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
