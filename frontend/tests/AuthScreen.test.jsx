import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthScreen from '../src/pages/AuthScreen'
import { login, signup } from '../src/api/authService'
import { useAuth } from '../src/Context/AuthContext'

jest.mock('../src/api/authService')
jest.mock('../src/Context/AuthContext')

describe('AuthScreen', () => {
  const mockLogin = jest.fn()

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin })
    jest.clearAllMocks()
  })

  it('renders login mode by default', () => {
    render(<AuthScreen />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })

  it('switches to signup mode when Sign Up tab is clicked', () => {
    render(<AuthScreen />)
    fireEvent.click(screen.getByText('Sign Up'))
    expect(screen.getByText('Create account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ammara Asghar')).toBeInTheDocument()
  })

  it('shows a validation error when fields are empty on submit', async () => {
    render(<AuthScreen />)
    fireEvent.click(screen.getByText('Log In', { selector: 'button[type="submit"]' }))
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument()
    })
  })

  it('calls login API and context login on successful submit', async () => {
    login.mockResolvedValue({ user: { name: 'Amna' }, token: 'abc123' })

    render(<AuthScreen />)
    fireEvent.change(screen.getByPlaceholderText('ammara@gmail.com'), { target: { value: 'amna@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByText('Log In', { selector: 'button[type="submit"]' }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('amna@test.com', 'password123')
      expect(mockLogin).toHaveBeenCalledWith({ name: 'Amna' }, 'abc123')
    })
  })

  it('shows an error message when login fails', async () => {
    login.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } })

    render(<AuthScreen />)
    fireEvent.change(screen.getByPlaceholderText('ammara@gmail.com'), { target: { value: 'amna@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByText('Log In', { selector: 'button[type="submit"]' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})