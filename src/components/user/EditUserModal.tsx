// 'use client'

// import { useForm } from 'react-hook-form'
// import { User } from '@prisma/client'
// import { UserWithRolesAndAsramas } from '@/actions/user'

// interface EditUserModalProps {
//   isOpen: boolean
//   onClose: () => void
//   user: UserWithRolesAndAsramas
//   onSubmit: (data: Partial<UserWithRolesAndAsramas>) => void
// }

// export default function EditUserModal({
//   isOpen,
//   onClose,
//   user,
//   onSubmit,
// }: EditUserModalProps) {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { register, handleSubmit, setValue } = useForm<Partial<User>>({
//     defaultValues: user,
//   })

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="w-full max-w-md rounded-lg bg-white p-6">
//         <h2 className="mb-4 text-xl font-bold">Edit User</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-4">
//             <label className="mb-1 block text-sm font-medium">Name</label>
//             <input
//               {...register('name')}
//               defaultValue={user.name}
//               className="w-full rounded-lg border px-3 py-2"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="mb-1 block text-sm font-medium">Email</label>
//             <input
//               type="text"
//               {...register('username')}
//               defaultValue={user.username}
//               className="w-full rounded-lg border px-3 py-2"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="mb-1 block text-sm font-medium">Role</label>
//             <select
//               {...register('role')}
//               defaultValue={user.role as string}
//               className="w-full rounded-lg border px-3 py-2"
//             >
//               <option value="USER">User</option>
//               <option value="ASRAMA">Asrama</option>
//               <option value="ADMIN">Admin</option>
//             </select>
//           </div>

//           <div className="mt-6 flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'

import { useForm } from 'react-hook-form'
import { User } from '@prisma/client'
import { UserWithRolesAndAsramas } from '@/actions/user'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserWithRolesAndAsramas
  onSubmit: (data: Partial<UserWithRolesAndAsramas>) => void
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onSubmit,
}: EditUserModalProps) {
  const { register, handleSubmit, setValue } = useForm<Partial<User>>({
    defaultValues: user,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input
              {...register('name')}
              defaultValue={user.name}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Username</label>
            <Input
              {...register('username')}
              defaultValue={user.username}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Role</label>
            <Select
              onValueChange={(value) => setValue('role', value as any)}
              defaultValue={user.role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ASRAMA">Asrama</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
