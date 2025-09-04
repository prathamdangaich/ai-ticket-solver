import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    // Clear token or any other user data
    localStorage.removeItem("token")
    // Redirect to login
    navigate("/login")
  }, [navigate])

  return <div>Logging out...</div>
}
