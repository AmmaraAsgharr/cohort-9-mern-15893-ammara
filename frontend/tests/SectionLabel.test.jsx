import { render, screen } from '@testing-library/react'
import SectionLabel from '../src/components/SectionLabel'

describe('SectionLabel', () => {
  it('renders the children text', () => {
    render(<SectionLabel>Pinned</SectionLabel>)
    expect(screen.getByText('Pinned')).toBeInTheDocument()
  })
})