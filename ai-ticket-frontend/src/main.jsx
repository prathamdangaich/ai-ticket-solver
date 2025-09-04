import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CheckAuth from './components/CheckAuth.jsx'
import Tickets from './pages/Tickets.jsx'
import TicketDetailsPage from './pages/Ticket.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Admin from './pages/Admin.jsx'
import Logout from './pages/Logout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route 
          path='/'
          element = {
            <CheckAuth protectedRoute={true}>
              <Tickets/>
            </CheckAuth>
          }
        />

        <Route 
          path='/tickets/:id'
          element = {
            <CheckAuth protectedRoute={true}>
              <TicketDetailsPage/>
            </CheckAuth>
          }
        />

        <Route 
          path='/login'
          element = {
            <CheckAuth protectedRoute={false}>
              <Login/>
            </CheckAuth>
          }
        />

        <Route 
          path='/signup'
          element = {
            <CheckAuth protectedRoute={false}>
              <Signup/>
            </CheckAuth>
          }
        />

        <Route 
          path='/admin'
          element = {
            <CheckAuth protectedRoute={true}>
              <Admin/>
            </CheckAuth>
          }
        />

        <Route 
          path='/logout'
          element={
            <Logout />
          }
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
