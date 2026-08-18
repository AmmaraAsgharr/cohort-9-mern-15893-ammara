import { render, screen, fireEvent } from '@testing-library/react'
import EmptyState from '../src/components/EmptyState'

describe('EmptyState', () => {
  it('shows "No notes yet" when there is no search term', () => {
    render(<EmptyState search="" onNewNote={() => {}} />)
    expect(screen.getByText('No notes yet')).toBeInTheDocument()
  })

  it('shows "No notes found" when there is a search term', () => {
    render(<EmptyState search="groceries" onNewNote={() => {}} />)
    expect(screen.getByText('No notes found')).toBeInTheDocument()
  })

  it('calls onNewNote when the create button is clicked', () => {
    const handleNew = jest.fn()
    render(<EmptyState search="" onNewNote={handleNew} />)
    fireEvent.click(screen.getByText('+ Create Note'))
    expect(handleNew).toHaveBeenCalledTimes(1)
  })

  it('hides the create button when searching', () => {
    render(<EmptyState search="groceries" onNewNote={() => {}} />)
    expect(screen.queryByText('+ Create Note')).not.toBeInTheDocument()
  })
})