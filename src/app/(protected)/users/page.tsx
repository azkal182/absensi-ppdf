'use client'

import { useEffect, useState } from 'react'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  UserWithRolesAndAsramas,
} from '@/actions/user'
import UsersTable from '@/components/user/UsersTable'
import CreateUserModal from '@/components/user/CreateUserModal'
import EditUserModal from '@/components/user/EditUserModal'
import ChangePasswordModal from '@/components/user/ChangePasswordModal'
import DeleteConfirmationModal from '@/components/user/DeleteConfirmationModal'

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithRolesAndAsramas[]>([])
  const [selectedUser, setSelectedUser] =
    useState<UserWithRolesAndAsramas | null>(null)
  const [modalState, setModalState] = useState({
    create: false,
    edit: false,
    password: false,
    delete: false,
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const data = await getUsers()
    setUsers(data)
  }

  const handleCreate = async (data: any) => {
    await createUser(data)
    closeModal('create')
    await loadUsers()
  }

  const handleUpdate = async (data: any) => {
    if (!selectedUser) return
    // console.log(data)

    await updateUser(selectedUser.id, data)
    closeAllModals()
    await loadUsers()
  }

  const handlePasswordChange = async (newPassword: string) => {
    if (!selectedUser) return
    await changePassword(selectedUser.id, newPassword)
    closeAllModals()
    await loadUsers()
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    await deleteUser(selectedUser.id)
    closeAllModals()
    await loadUsers()
  }

  const openModal = (
    type: keyof typeof modalState,
    user?: UserWithRolesAndAsramas
  ) => {
    if (user) setSelectedUser(user)
    setModalState((prev) => ({ ...prev, [type]: true }))
  }

  const closeModal = (type: keyof typeof modalState) => {
    setModalState((prev) => ({ ...prev, [type]: false }))
    if (type !== 'create') setSelectedUser(null)
  }

  const closeAllModals = () => {
    setModalState({
      create: false,
      edit: false,
      password: false,
      delete: false,
    })
    setSelectedUser(null)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => openModal('create')}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Add New User
        </button>
      </div>

      <UsersTable
        users={users}
        onEdit={(user) => openModal('edit', user)}
        onPassword={(user) => openModal('password', user)}
        onDelete={(user) => openModal('delete', user)}
      />

      <CreateUserModal
        open={modalState.create}
        onOpenChange={() => closeModal('create')}
        onSubmit={handleCreate}
      />

      {selectedUser && (
        <>
          <EditUserModal
            isOpen={modalState.edit}
            onClose={() => closeModal('edit')}
            user={selectedUser}
            onSubmit={handleUpdate}
          />

          <ChangePasswordModal
            isOpen={modalState.password}
            onClose={() => closeModal('password')}
            onSubmit={handlePasswordChange}
          />

          <DeleteConfirmationModal
            isOpen={modalState.delete}
            onClose={() => closeModal('delete')}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  )
}
