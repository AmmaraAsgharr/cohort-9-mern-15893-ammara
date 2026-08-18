import { getNotes, createNote, updateNote, deleteNote } from '../src/api/notesService'
import client from '../src/api/client'

jest.mock('../src/api/client')

describe('notesService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('getNotes returns response data', async () => {
    client.get.mockResolvedValue({ data: [{ _id: '1', title: 'Test' }] })
    const result = await getNotes()
    expect(client.get).toHaveBeenCalledWith('/notes')
    expect(result).toEqual([{ _id: '1', title: 'Test' }])
  })

  it('createNote posts note data', async () => {
    const noteData = { title: 'New Note' }
    client.post.mockResolvedValue({ data: { _id: '2', ...noteData } })
    const result = await createNote(noteData)
    expect(client.post).toHaveBeenCalledWith('/notes', noteData)
    expect(result.title).toBe('New Note')
  })

  it('updateNote puts to the correct id', async () => {
    client.put.mockResolvedValue({ data: { _id: '1', title: 'Updated' } })
    const result = await updateNote('1', { title: 'Updated' })
    expect(client.put).toHaveBeenCalledWith('/notes/1', { title: 'Updated' })
    expect(result.title).toBe('Updated')
  })

  it('deleteNote deletes the correct id', async () => {
    client.delete.mockResolvedValue({ data: { success: true } })
    const result = await deleteNote('1')
    expect(client.delete).toHaveBeenCalledWith('/notes/1')
    expect(result.success).toBe(true)
  })

  it('rethrows an error when the request fails', async () => {
    client.get.mockRejectedValue(new Error('Network error'))
    await expect(getNotes()).rejects.toThrow('Network error')
  })
})