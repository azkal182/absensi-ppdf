'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UserSchema, userSchema } from '@/schemas/userSchema'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Asrama, Role } from '@prisma/client'
import { getRoles } from '@/actions/user'
import { getAsrama } from '@/actions/absenAction'

export default function CreateUserModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UserSchema) => void
}) {
  const [userRoles, setUserRoles] = useState<Role[]>()
  const [asramas, setAsramas] = useState<Asrama[]>()
  const [selectRole, setSelectRole] = useState('')

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    mode: 'onBlur', // Validasi langsung saat field kehilangan fokus
    defaultValues: {
      name: '',
      username: '',
      password: '',
      role: 'USER',
      asramaId: null,
    },
  })

  const fetchUserRoles = async () => {
    const result = await getRoles()
    setUserRoles(result)
  }

  const fetchAsrama = async () => {
    const result = await getAsrama()
    setAsramas(result)
  }

  useEffect(() => {
    fetchUserRoles()
    fetchAsrama()
  }, [])

  // Handle submit dan log error
  const handleSubmit = async (data: UserSchema) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              console.error('Validation Errors:', errors)
            })}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role User</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      const role = userRoles?.find(
                        (a) => a.id === parseInt(val)
                      )
                      form.setValue('asramaId', null)
                      setSelectRole(role?.name as string)
                      field.onChange(Number(val))
                    }}
                    defaultValue={field.value ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userRoles?.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectRole && !['ADMIN', 'USER'].includes(selectRole) && (
              <FormField
                control={form.control}
                name="asramaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asrama</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val ? Number(val) : null)
                      }
                      defaultValue={field.value ? field.value.toString() : ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Asrama" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {asramas?.map((asrama) => (
                          <SelectItem
                            key={asrama.id}
                            value={asrama.id.toString()}
                          >
                            {asrama.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
