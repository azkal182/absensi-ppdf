'use client'

import { useForm } from 'react-hook-form'
import { User } from '@prisma/client'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onSubmit: (data: Partial<User>) => void
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onSubmit,
}: EditUserModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register, handleSubmit, setValue } = useForm<Partial<User>>({
    defaultValues: user,
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Edit User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              {...register('name')}
              defaultValue={user.name}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="text"
              {...register('username')}
              defaultValue={user.username}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Role</label>
            <select
              {...register('role')}
              defaultValue={user.role as string}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="ASRAMA">Asrama</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
