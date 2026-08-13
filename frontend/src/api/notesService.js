import client from './client'

export async function getNotes() {
  try {
    const res = await client.get('/notes')
    return res.data
  } catch (err) {
    throw err
  }
}

export async function createNote(noteData) {
  try {
    const res = await client.post('/notes', noteData)
    return res.data
  } catch (err) {
    throw err
  }
}

export async function updateNote(id, noteData) {
  try {
    const res = await client.put(`/notes/${id}`, noteData)
    return res.data
  } catch (err) {
    throw err
  }
}

export async function deleteNote(id) {
  try {
    const res = await client.delete(`/notes/${id}`)
    return res.data
  } catch (err) {
    throw err
  }
}