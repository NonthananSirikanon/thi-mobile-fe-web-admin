import { Routes, Route } from 'react-router-dom'
import App from '../App'
import Layout from '../components/layout'
import AddBanner from '../pages/add_banner'


function AppRouter() {
  return (
   <Layout>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/addbanner" element={<AddBanner />} />
      </Routes>
    </Layout>
  )
}

export default AppRouter
