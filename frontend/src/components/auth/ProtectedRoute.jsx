import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Loader from '../layout/Loader'

const ProtectedRoute = ({children}) => {
    const {isAuthenticated,loading}= useSelector(state=> state.auth)
    //pour rester sur la page quand on reload la page
if(loading) return <Loader />
//test s'il est pas connecté il sera redirigé vers la page de login
    if (!isAuthenticated) {
    return <Navigate  to="/login" replace />
}

  return children
}

export default ProtectedRoute
