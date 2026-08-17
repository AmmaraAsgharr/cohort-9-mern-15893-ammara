import { render, screen, fireEvent } from '@testing-library/react'
import FilterChip from '../src/components/FilterChip'
describe('FilterChip', () => {
  it('renders the label text', () => {
    render(<FilterChip active={false} onClick={() => {}}>work</FilterChip>)
    expect(screen.getByText('work')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<FilterChip active={false} onClick={handleClick}>ideas</FilterChip>)
    fireEvent.click(screen.getByText('ideas'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})