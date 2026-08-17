import { render, screen, fireEvent } from '@testing-library/react'
import NoteCard from '../src/components/NoteCard'

const baseNote = {
  _id: '1',
  title: 'My Note',
  content: '<p>Hello world</p>',
  color: '#FF6B00',
  tags: ['work'],
  pinned: false,
  wordCount: 2,
}

describe('NoteCard', () => {
  it('renders the note title and word count', () => {
    render(
      <NoteCard
        note={baseNote}
        view="grid"
        onEdit={() => {}}
        onDelete={() => {}}
        isConfirmingDelete={false}
        onCancelDelete={() => {}}
        onConfirmDelete={() => {}}
      />
    )
    expect(screen.getByText('My Note')).toBeInTheDocument()
    expect(screen.getByText('2 words')).toBeInTheDocument()
  })

  it('calls onEdit when the card is clicked', () => {
    const handleEdit = jest.fn()
    render(
      <NoteCard
        note={baseNote}
        view="grid"
        onEdit={handleEdit}
        onDelete={() => {}}
        isConfirmingDelete={false}
        onCancelDelete={() => {}}
        onConfirmDelete={() => {}}
      />
    )
    fireEvent.click(screen.getByText('My Note'))
    expect(handleEdit).toHaveBeenCalledTimes(1)
  })

  it('calls onEdit when Enter is pressed (keyboard access)', () => {
    const handleEdit = jest.fn()
    render(
      <NoteCard
        note={baseNote}
        view="grid"
        onEdit={handleEdit}
        onDelete={() => {}}
        isConfirmingDelete={false}
        onCancelDelete={() => {}}
        onConfirmDelete={() => {}}
      />
    )
    const editButtons = screen.getAllByRole('button', { name: /edit note/i })
    fireEvent.keyDown(editButtons[0], { key: 'Enter' })
    expect(handleEdit).toHaveBeenCalledTimes(1)
  })

  it('shows confirm/cancel buttons when isConfirmingDelete is true', () => {
    render(
      <NoteCard
        note={baseNote}
        view="grid"
        onEdit={() => {}}
        onDelete={() => {}}
        isConfirmingDelete={true}
        onCancelDelete={() => {}}
        onConfirmDelete={() => {}}
      />
    )
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })
})