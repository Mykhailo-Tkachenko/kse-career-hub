import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { RoleProvider } from './context/RoleContext'
import Landing from './pages/Landing'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import CompanyDashboard from './pages/CompanyDashboard'
import PostListing from './pages/PostListing'

function App() {
  return (
    <RoleProvider>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company/new" element={<PostListing />} />
        </Routes>
      </div>
    </RoleProvider>
  )
}

export default App
