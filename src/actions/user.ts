'use server'
import prisma from '@/lib/prisma'
import { userSchema, type UserSchema } from '@/schemas/userSchema'
import { Asrama, Role, User, UserAsrama, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

export type UserWithRolesAndAsramas = {
  id: number
  name: string
  username: string
  role: any
  roles: string[]
  asramas: string[]
}

export type UserWithRelations = User & {
  roles: (UserRole & { role: Role })[]
  UserAsrama: (UserAsrama & { asrama: Asrama })[]
}

export const getUsers = async (): Promise<UserWithRolesAndAsramas[]> => {
  const users = await prisma.user.findMany({
    include: {
      roles: { include: { role: true } },
      UserAsrama: { include: { asrama: true } },
    },
  })
  const formattedUsers: UserWithRolesAndAsramas[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    roles: user.roles.map((r) => r.role.name),
    asramas: user.UserAsrama.map((g) => g.asrama.name),
  }))

  return formattedUsers
}

export const createUser = async (data: UserSchema) => {
  const validated = userSchema.safeParse(data)

  if (!validated.success) {
    throw new Error('Invalid field')
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        password: hashedPassword,
        roles: {
          create: {
            role: { connect: { id: data.roleId } },
          },
        },
      },
    })

    // Jika ada asramaId, tambahkan ke UserAsrama
    if (data.asramaId) {
      await prisma.userAsrama.create({
        data: {
          userId: user.id,
          asramaId: data.asramaId,
        },
      })
    }

    return { message: 'success', data: user }
  } catch (error) {
    console.log(error)
    return { error: 'error saving user' }
  }
}

export const updateUser = async (id: number, data: Partial<UserSchema>) => {
  console.log({ id, data })

  try {
    const result = await prisma.user.update({
      where: { id },
      data,
    })
    return { message: 'success', data: result }
  } catch (error) {
    console.log(error)
    return { error: 'error updating user' }
  }
}

export const changePassword = async (id: number, newPassword: string) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })
    return { message: 'Password updated successfully' }
  } catch (error) {
    console.log(error)
    return { error: 'error changing password' }
  }
}

export const deleteUser = async (id: number) => {
  try {
    await prisma.user.delete({
      where: { id },
    })
    return { message: 'User deleted successfully' }
  } catch (error) {
    console.log(error)
    return { error: 'error deleting user' }
  }
}

export const testUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      roles: { include: { role: true } },
      UserAsrama: { include: { asrama: true } },
    },
  })
  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    usename: user.username,
    role: user.role,
    roles: user.roles.map((r) => r.role.name),
    asramas: user.UserAsrama.map((g) => g.asrama.name),
  }))

  return formattedUsers
}

export const getRoles = async () => {
  const roles = await prisma.role.findMany()
  return roles
}
