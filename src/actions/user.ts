'use server'
import prisma from '@/lib/prisma'
import { userSchema, type UserSchema } from '@/schemas/userSchema'
import bcrypt from 'bcryptjs'

export const getUsers = async () => {
  const results = await prisma.user.findMany()
  return results
}

export const createUser = async (data: UserSchema) => {
  const validated = userSchema.safeParse(data)

  if (!validated.success) {
    throw new Error('Invalid field')
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const result = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    })
    return { message: 'success', data: result }
  } catch (error) {
    console.log(error)
    return { error: 'error saving user' }
  }
}

export const updateUser = async (id: number, data: Partial<UserSchema>) => {
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
