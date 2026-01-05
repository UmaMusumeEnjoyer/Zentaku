import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initSharedLogic } from '@umamusumeenjoyer/shared-logic';
import './App.css';
import './i18n/config'; // Import i18n configuration
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import HomePageLogin from './pages/HomePageLogin/HomePagelogin';
import NewsDetailPage from './pages/NewsDetailPage/NewsDetailPage';
import CharacterPage from './pages/CharacterPage/CharacterPage';
import AnimeDetailPage from './pages/AnimeDetailPage/AnimeDetailPage';
import AuthPage from './pages/AuthPage/AuthPage';
import StaffPage from './pages/StaffPage/StaffPage';
import AnimeSearchPage from './pages/AnimeSearch/AnimeSearchPage';
import AnimeListSearchPage from './pages/AnimeListSearch/AnimeListSearchPage';

// Xác định API base URL dựa trên environment
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? '/api' // Development: sử dụng Vite proxy
  : import.meta.env.VITE_API_BASE_URL ; // Production: gọi trực tiếp

// Log để debug
console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('API Base URL:', API_BASE_URL);

// Khởi tạo shared-logic với localStorage và API base URL
initSharedLogic({
  storage: {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
  },
  apiBaseUrl: API_BASE_URL
});

// Component để render trang home dựa trên trạng thái đăng nhập
const HomeRoute = () => {
  const { user } = useAuth();
  return user ? <HomePageLogin /> : <HomePage />;
};

function App() {
  useEffect(() => {
    // --- Thay đổi Tiêu đề (Title) ---
    document.title = "Zentaku";

    // --- Thay đổi Logo (Favicon) ---
    const updateFavicon = (url: string) => {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = url;
    };

    updateFavicon('/Gemini_Generated_Image_eg5d1qeg5d1qeg5d (1).ico');
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/character/:id" element={<CharacterPage />} />
              <Route path="/anime/:id" element={<AnimeDetailPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/staff/:id" element={<StaffPage />} />
              <Route path="/browse" element={<AnimeSearchPage />} />
              <Route path="/animelist" element={<AnimeListSearchPage />} />
            </Routes>
          </main>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;