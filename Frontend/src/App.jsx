

import { BrowserRouter, Routes, Route } from "react-router";

import SignupPage from './Pages/SignupPage/SignupPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import { HomePage } from './Pages/HomePage/HomePage';
import BrowsePage from './Pages/BrowsePage/BrowsePage';
import UploadPage from './Pages/UploadPage/UploadPage';
import RequestPage from './Pages/RequestPage/RequestPage';
import MyCoursesPage from './Pages/MyCoursesPage/MyCoursesPage';

function App() {
  

  return (
    <>

    <BrowserRouter>
    <Routes>
      <Route path = "/" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/request" element={<RequestPage />} />
      <Route path="/my-courses" element={<MyCoursesPage />} />

    </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App


