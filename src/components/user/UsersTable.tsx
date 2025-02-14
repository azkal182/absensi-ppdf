'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { UserWithRolesAndAsramas } from '@/actions/user'

interface UsersTableProps {
  users: UserWithRolesAndAsramas[]
  onEdit: (user: UserWithRolesAndAsramas) => void
  onPassword: (user: UserWithRolesAndAsramas) => void
  onDelete: (user: UserWithRolesAndAsramas) => void
}

export default function UsersTable({
  users,
  onEdit,
  onPassword,
  onDelete,
}: UsersTableProps) {
  //   const test = users[0]
  //   const admin = test.roles.some((role) => role.includes('ADMIN'))

  //   console.log(test)
  //   console.log(admin)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            {/* <TableHead>Role</TableHead> */}
            <TableHead>Roles</TableHead>
            <TableHead>Asrama</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isAdmin = user.roles.some((role) => role.includes('ADMIN'))

            console.log(isAdmin)

            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                {/* <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {user.role}
                    </span>
                  </TableCell> */}
                <TableCell>
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className={`rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800`}
                    >
                      {role}
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  {/* {user.asramas.map((asrama) => (
                    <span
                      key={asrama}
                      className={`rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800`}
                    >
                      {isAdmin ? 'ALL' : asrama}

                    </span>
                  ))} */}
                  {isAdmin ? (
                    <span
                      className={`rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800`}
                    >
                      ALL
                    </span>
                  ) : (
                    user.asramas.map((asrama) => (
                      <span
                        key={asrama}
                        className={`rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800`}
                      >
                        {isAdmin ? 'SEMUA' : asrama}
                      </span>
                    ))
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPassword(user)}>
                        Change Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(user)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
