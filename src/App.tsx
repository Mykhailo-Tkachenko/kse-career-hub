import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { RoleProvider } from './context/RoleContext'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import CompanyDashboard from './pages/CompanyDashboard'
import PostListing from './pages/PostListing'
import EditListing from './pages/EditListing'
import Login from './pages/Login'
import Register from './pages/Register'
import RequireAuth from './components/RequireAuth'

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/company" element={
              <RequireAuth>
                <CompanyDashboard />
              </RequireAuth>
            } />
            <Route path="/company/new" element={
              <RequireAuth>
                <PostListing />
              </RequireAuth>
            } />
            <Route
              path="/company/listings/:id/edit"
              element={
                <RequireAuth>
                  <EditListing />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </RoleProvider>
    </AuthProvider>
  )
}

export default App
