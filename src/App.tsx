import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initSharedLogic, useNotificationSocket } from '@umamusumeenjoyer/shared-logic';
import type { NotificationItem } from '@umamusumeenjoyer/shared-logic';
import './App.css';
import './i18n/config'; // Import i18n configuration
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
//import HomePageLogin from './pages/HomePageLogin/HomePagelogin';
import NewsDetailPage from './pages/NewsDetailPage/NewsDetailPage';
import CharacterPage from './pages/CharacterPage/CharacterPage';
import AnimeDetailPage from './pages/AnimeDetailPage/AnimeDetailPage';
import AuthPage from './pages/AuthPage/AuthPage';
import StaffPage from './pages/StaffPage/StaffPage';
import AnimeSearchPage from './pages/AnimeSearch/AnimeSearchPage';
import AnimeListSearchPage from './pages/AnimeListSearch/AnimeListSearchPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AnimeListPage from './pages/AnimeListPage/AnimeListPage';
import AnimeWatchPage from './pages/AnimeWatchPage/WatchPage';
import AnimeSchedule from './pages/ScheduleDashboard/Schedule';
import WatchAlongPage from './pages/WatchAlong/WatchAlong';
import MangaReader from './pages/MangaReader/MangaReader';
import { LightNovelReader } from './pages/NovelReader/NovelReader';
import ChatMessenger from './pages/ChatApp/ChatApp';
import FloatingChat from './components/FloatingChat/FloatingChat';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import NotificationToast from './components/Notification/NotificationToast';

// Xác định API base URL dựa trên environment
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? '/api' // Development: sử dụng Vite proxy
  : import.meta.env.VITE_API_BASE_URL ; // Production: gọi trực tiếp

const VITE_BACKEND_DOMAIN =  import.meta.env.VITE_BACKEND_DOMAIN ; // Production: gọi trực tiếp

// Log để debug


// Khởi tạo shared-logic với localStorage và API base URL
initSharedLogic({
  storage: {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
  },
  apiBaseUrl: API_BASE_URL,
  VITE_BACKEND_DOMAIN: VITE_BACKEND_DOMAIN
});

// Component để render trang home dựa trên trạng thái đăng nhập
const HomeRoute = () => {
  const { user, isInitializing } = useAuth();
  const hasToken = localStorage.getItem('accessToken');
  if (isInitializing) {
    return (
      <div >
        {/* Bạn có thể thay bằng component <LoadingSpinner /> của bạn */}
       
      </div>
    );
  } 
  if (!user && hasToken) {
     return (
      <div >
        {/* Bạn nên dùng component LoadingSpinner đẹp mắt của dự án ở đây */}
      </div>
    );
  }
  //return user ? <HomePageLogin /> : <HomePage />;
  return user ? <AnimeSchedule /> : <HomePage />;
};

// Component to initialize notification socket listener
const NotificationSetup = () => {
  const { user } = useAuth();

  useNotificationSocket({
    isAuthenticated: !!user,
    onNewNotification: (notification: NotificationItem) => {
      // Trigger toast via global function exposed by NotificationToast
      const showToast = (window as any).__showNotificationToast;
      if (showToast) {
        showToast(notification);
      }
    },
  });

  return null;
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

    updateFavicon('/app_logo.ico');
  }, []);

  return (
      <Router>
        <AuthProvider>
          <NotificationSetup />
          <Header />
          <FloatingChat />
          <NotificationToast />
          <main>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/character/:id" element={<CharacterPage />} />
              <Route path="/anime/:id" element={<AnimeDetailPage />} />
              <Route path="/anime/:id/watch" element={<AnimeWatchPage />}/>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/staff/:id" element={<StaffPage />} />
              <Route path="/browse" element={<AnimeSearchPage />} />
              <Route path="/animelist" element={<AnimeListSearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/user/:username" element={<ProfilePage />} />
              <Route path="/list/:id" element={<AnimeListPage />} />
              <Route path="/watch-along" element={<WatchAlongPage />} />
              <Route path="/watch-along/:roomId" element={<WatchAlongPage />} />
              <Route path="/manga/:id/read/:chapterId?" element={<MangaReader />} />
              <Route path="/novel/:id/read/:chapterId?" element={<LightNovelReader />} />
              <Route path="/chat" element={<ChatMessenger />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </AuthProvider>
      </Router>
  );
}

export default App;