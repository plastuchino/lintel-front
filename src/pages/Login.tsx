import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/api';
import { toast } from '../hooks/useToast';
import logo from '../assets/logo.jpeg';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth, user } = useAuthStore();
  const googleContainerRef = useRef<HTMLDivElement>(null);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(360);

  useEffect(() => {
    if (user) navigate(user.role === 'worker' ? '/worker/dashboard' : '/book');
  }, [user, navigate]);

  useEffect(() => {
    const el = googleContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setGoogleBtnWidth(el.clientWidth));
    observer.observe(el);
    setGoogleBtnWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    try {
      const res = await auth.google(credentialResponse.credential);
      const { token, user: u } = res.data;
      setAuth(token, u as unknown as Parameters<typeof setAuth>[1]);
      navigate(u.role === 'worker' ? '/worker/dashboard' : '/book');
    } catch {
      toast({ title: 'Sign-in failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-16">
      <div className='w-2/6 border p-3 rounded-lg'>

        <Link to="/" className='mb-4'>
          {/* <p className='text-white mb-2'>Quotes Right at your door</p> */}
        

      
           <div className="flex items-center gap-2.5">

          <img src={logo} alt="lintel" className="h-9 w-9 rounded-full object-cover" />
          <span className="text-white text-2xl font-black">lintel</span>
        </div>
        </Link>
      </div>
     
        <div>
          <h1 className="text-white text-5xl font-black leading-tight mb-6">
            Home services,<br />on demand.
          </h1>
          <p className="text-uber-gray-400 text-lg">
            Book trusted professionals for gutter cleaning, window washing, pressure washing, and more.
          </p>
        </div>
        <p className="text-uber-gray-600 text-sm">© 2026 lintel</p>
      </div>

      {/* Right — auth */}
      <div className="flex-1 flex flex-col justify-center px-8 py-16 max-w-md mx-auto w-full lg:max-w-none lg:mx-0 lg:px-20">
        <div className="lg:hidden mb-10 flex items-center gap-2.5">
          <img src={logo} alt="lintel" className="h-9 w-9 rounded-full object-cover" />
          <span className="text-2xl font-black">lintel</span>
        </div>

        <h2 className="text-3xl font-black text-black mb-2">Sign in</h2>
        <p className="text-uber-gray-500 mb-10">Continue with your Google account to book home services.</p>

        <div ref={googleContainerRef} className="w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast({ title: 'Sign-in failed', variant: 'destructive' })}
            theme="outline"
            shape="rectangular"
            size="large"
            width={googleBtnWidth}
            text="continue_with"
          />
        </div>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-uber-gray-200" />
          <span className="text-uber-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-uber-gray-200" />
        </div>

        <p className="text-uber-gray-600 text-sm">
          Are you a professional?{' '}
          <Link to="/worker/register" className="text-black font-semibold underline underline-offset-2">
            Join as a worker
          </Link>
        </p>

        <p className="mt-10 text-xs text-uber-gray-400">
          By continuing, you agree to our{' '}
          <Link to="/terms"   className="underline underline-offset-2 hover:text-black">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-black">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
