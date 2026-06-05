import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.jpeg';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <Helmet>
        <title>Page Not Found | Lintel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <img src={logo} alt="lintel" className="h-10 w-10 rounded-full object-cover mb-8" />

      <p className="text-uber-gray-400 text-sm font-semibold tracking-widest uppercase mb-4">404</p>
      <h1 className="text-4xl font-black text-black mb-3">Page not found</h1>
      <p className="text-uber-gray-500 text-base max-w-xs mb-10">
        We couldn't find the page you were looking for.
      </p>

      <button onClick={() => navigate('/')} className="uber-btn-primary px-8">
        Back to home
      </button>
    </div>
  );
}
