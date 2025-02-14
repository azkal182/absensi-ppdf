import { testUsers } from '@/actions/user'
import React from 'react'

const TestPage = async () => {
  const data = await testUsers()
  console.log(JSON.stringify(data, null, 2))

  return <div>TestPage</div>
}

export default TestPage
