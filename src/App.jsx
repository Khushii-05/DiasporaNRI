import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentUpdateProvider } from './context/ContentUpdateContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import Header from './components/Header';
import AnnouncementBar from './components/AnnouncementBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Associates from './pages/Associates';
import Investment from './pages/Investment';
import Achievements from './pages/Achievements';
import Media from './pages/Media';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Partnership from './pages/Partnership';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ContentUpdateProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="h-24 shrink-0 sm:h-28 lg:h-[120px]" aria-hidden="true" />
            <AnnouncementBar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/associates" element={<Associates />} />
                <Route path="/investment" element={<Investment />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/media" element={<Media />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/partnership" element={<ProtectedRoute><Partnership /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ContentUpdateProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
