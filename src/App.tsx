import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Toaster } from './components/Toaster';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import JobTracking from './pages/JobTracking';
import JobsList from './pages/JobsList';
import WorkerDashboard from './pages/WorkerDashboard';
import WorkerPendingDashboard from './pages/WorkerPendingDashboard';
import WorkerSettings from './pages/WorkerSettings';
import WorkerRegister from './pages/WorkerRegister';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import QuotePreview from './pages/QuotePreview';
import ServiceGutterCleaning from './pages/ServiceGutterCleaning';
import ServicePressureWashing from './pages/ServicePressureWashing';
import ServiceWindowCleaning from './pages/ServiceWindowCleaning';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function workerHome(user: { role: string; isApproved?: boolean }) {
  if (user.role !== 'worker') return '/book';
  return user.isApproved === false ? '/worker/pending' : '/worker/dashboard';
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (!user?.isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (user) return <Navigate to={workerHome(user)} replace />;
  return <>{children}</>;
}

function ProtectedRoute({
  children,
  workerOnly = false,
  requireApproved = false,
}: {
  children: React.ReactNode;
  workerOnly?: boolean;
  requireApproved?: boolean;
}) {
  const { user } = useAuthStore();

  if (!user) return <NotFound />;
  if (workerOnly && user.role !== 'worker') return <NotFound />;
  if (requireApproved && user.isApproved === false) return <Navigate to="/worker/pending" replace />;
  if (!workerOnly && user.role === 'worker') return <Navigate to={workerHome(user)} replace />;
  return <>{children}</>;
}

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

declare function gtag(...args: unknown[]): void;

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const location = useLocation();
  const isWorkerRoute = location.pathname.startsWith('/worker/');

  useEffect(() => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', { page_path: location.pathname + location.search });
    }
  }, [location]);
  return (
    <>
      {isLocalhost && (
        <div style={{ background: '#f59e0b', color: '#000', textAlign: 'center', padding: '4px 0', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>
          YOU ARE IN DEV MODE
        </div>
      )}
      {user && !isWorkerRoute && <Header />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/worker/register" element={<WorkerRegister />} />
              <Route path="/terms"   element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/blog"    element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/services/gutter-cleaning"  element={<ServiceGutterCleaning />} />
              <Route path="/services/pressure-washing" element={<ServicePressureWashing />} />
              <Route path="/services/window-cleaning"  element={<ServiceWindowCleaning />} />
              <Route path="/quote-preview" element={<PublicRoute><QuotePreview /></PublicRoute>} />

              <Route path="/book" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><JobsList /></ProtectedRoute>} />
              <Route path="/jobs/:id" element={<ProtectedRoute><JobTracking /></ProtectedRoute>} />
              <Route path="/worker/dashboard" element={<ProtectedRoute workerOnly requireApproved><WorkerDashboard /></ProtectedRoute>} />
              <Route path="/worker/settings" element={<ProtectedRoute workerOnly requireApproved><WorkerSettings /></ProtectedRoute>} />
              <Route path="/worker/pending" element={<ProtectedRoute workerOnly><WorkerPendingDashboard /></ProtectedRoute>} />

              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
    </HelmetProvider>
  );
}
