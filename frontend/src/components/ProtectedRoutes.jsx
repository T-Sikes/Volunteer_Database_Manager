import { Outlet, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AxiosInstance from './AxiosInstance'

// Basic protected route - checks if user is authenticated
const ProtectedRoute = () => {
  const token = localStorage.getItem('token')

  // evaluate token and if false, navigate back to the login page
  return token ? <Outlet/> : <Navigate to="/user-login" />
}

// Admin protected route - checks if user is authenticated AND is an admin
export const AdminProtectedRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await AxiosInstance.get('user/current')
        const data = response.data
        setIsAdmin(data.is_superuser)
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [token])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!token) {
    return <Navigate to="/user-login" />
  }

  if (!isAdmin) {
    return <Navigate to="/portal/profile" />
  }

  return <Outlet />
}

// User protected route - checks if user is authenticated AND is NOT an admin
export const UserProtectedRoute = () => {
  const [isRegularUser, setIsRegularUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await AxiosInstance.get('user/current')
        const data = response.data
        setIsRegularUser(!data.is_superuser)
      } catch (error) {
        console.error('Error checking user status:', error)
        setIsRegularUser(false)
      } finally {
        setLoading(false)
      }
    }

    checkUserStatus()
  }, [token])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!token) {
    return <Navigate to="/user-login" />
  }

  if (!isRegularUser) {
    return <Navigate to="/portal/admin/event-management" />
  }

  return <Outlet />
}

export default ProtectedRoute
