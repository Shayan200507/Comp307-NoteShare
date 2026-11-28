

import { BrowserRouter, Routes, Route } from "react-router";

import SignupPage from './Pages/SignupPage/SignupPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import { HomePage } from './Pages/HomePage/HomePage';
import BrowsePage from './Pages/BrowsePage/BrowsePage';
import UploadPage from './Pages/UploadPage/UploadPage';
import DiscussionsPage from './Pages/DiscussionsPage/DiscussionsPage';
import CreatePostPage from './Pages/CreatePostPage/CreatePostPage';
import QuestionDetailsPage from './Pages/QuestionDetailsPage/QuestionDetailsPage';
import MyCoursesPage from './Pages/MyCoursesPage/MyCoursesPage';
import ReadNotePage from './Pages/ReadNotePage/ReadNotePage';
import NotificationsPage from './Pages/NotificationsPage/NotificationsPage';

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
      <Route path="/discussions" element={<DiscussionsPage />} />
      <Route path="/create-post/:courseCode" element={<CreatePostPage />} />
      <Route path="/question/:questionId" element={<QuestionDetailsPage />} />
      <Route path="/my-courses" element={<MyCoursesPage />} />
      <Route path="/readNote/:noteId" element={<ReadNotePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

    </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App


