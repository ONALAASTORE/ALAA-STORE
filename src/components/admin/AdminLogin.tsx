import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { LogoAvatar, Brand3DText } from '../brand';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStore,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      if (email.trim() === 'alaastoreon@gmail.com' && password === 'A123321A') {
        localStorage.setItem('on_alaa_admin_auth', 'true');
        localStorage.setItem('on_alaa_admin_auth_time', Date.now().toString());
        onLoginSuccess();
      } else {
        setErrorMsg('Invalid administrator credentials. Access restricted.');
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#FF0000] selection:text-white">
      {/* Background 3D Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#FF0000_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF0000]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 z-10">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 px-3.5 py-2 rounded-xl backdrop-blur-md transition shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Store</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-bold text-slate-300 backdrop-blur-md">
          <LogoAvatar size="sm" withGlow={false} />
          <Brand3DText size="sm" isDarkTheme={true} />
        </div>
      </div>

      {/* 3D Glassmorphism Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80"
      >
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center">
            <LogoAvatar size="xl" withGlow={true} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white font-display tracking-tight mt-2">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Private administrative panel for product catalog, video showcase, and store configuration
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-[#FF0000] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Administrator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                required
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-[#FF0000] to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition transform active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Log In to Dashboard</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
