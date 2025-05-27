import { Routes, Route } from 'react-router-dom'
import App from '../App'
import Layout from '../components/layout'
import AddBanner from '../pages/add_banner'
import NewsPage from '../screens/news_page'
import AddNews from '../screens/pages/add_news'



function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/addbanner" element={<AddBanner />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/addnews" element={<AddNews />} />
      </Routes>
    </Layout>
  )
}

export default AppRouter
