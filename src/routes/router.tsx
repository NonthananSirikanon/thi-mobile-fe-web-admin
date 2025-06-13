import { Routes, Route } from 'react-router-dom'
import App from '../App'
import Layout from '../components/layout'
import AddBanner from '../pages/add_banner'
import NewsPage from '../screens/news/page/news_page'
import AddNews from '../screens/news/page/add_news'
import MagazinePage from '../screens/magazine/magazine_page'
import AddMagazine from '../screens/magazine/add_magazine'
import NewsCategoryPage from '../screens/news/page/create_news_category'
import NewsAgencyPage from '../screens/news/page/add_news_agency'
import MultimediaPage from '../pages/multimediaPage'
import MultimediaUpload from '../pages/multimediaUpload'



function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/addbanner" element={<AddBanner />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/addnews" element={<AddNews />} />
        <Route path="/addNews/:id" element={<AddNews />} />
        <Route path="/magazine" element={<MagazinePage />} />
        <Route path="/addMagazine" element={<AddMagazine />} />
        <Route path='/newsCategory' element={<NewsCategoryPage />} />
        <Route path='/newsAgency' element={<NewsAgencyPage />} />
        <Route path='/multimedia' element={<MultimediaPage />} />
        <Route path='/multimedia/upload' element={<MultimediaUpload />} />
      </Routes>
    </Layout>
  )
}

export default AppRouter
