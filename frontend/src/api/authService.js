import client from './client'

export async function login(email, password) {
  const res = await client.post('/auth/login', { email, password })
  return res.data
}

export async function signup(name, email, password) {
  const res = await client.post('/auth/signup', { name, email, password })
  return res.data
}
