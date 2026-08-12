import client from './client'

export async function getNotes() {
  const res = await client.get('/notes')
  return res.data
}

export async function createNote(noteData) {
  const res = await client.post('/notes', noteData)
  return res.data
}

export async function updateNote(id, noteData) {
  const res = await client.put(`/notes/${id}`, noteData)
  return res.data
}

export async function deleteNote(id) {
  const res = await client.delete(`/notes/${id}`)
  return res.data
}