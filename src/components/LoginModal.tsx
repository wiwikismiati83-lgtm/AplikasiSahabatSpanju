import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  GraduationCap,
  Users,
  Briefcase,
  CheckCircle2,
  X,
  BookOpen,
  PhoneCall,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AuthUser, UserRole, ActiveAppId } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  currentUser: AuthUser | null;
  canDismiss?: boolean;
  onShowInfografis?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
  canDismiss = false,
  onShowInfografis,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHotline, setShowHotline] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Admin / Operator Account
    if (cleanUsername === 'admin' && cleanPassword === 'admin123') {
      const user: AuthUser = {
        username: 'admin',
        role: 'admin',
        displayName: 'Administrator / Operator Sekolah',
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      onLoginSuccess(user);
      return;
    }

    // 2. Siswa, Orang Tua, Guru Account
    if (cleanUsername === 'passtemenan' && cleanPassword === 'smpn7') {
      let displayName = 'Siswa Sahabat SPANJU';
      if (selectedRole === 'orang_tua') displayName = 'Orang Tua / Wali Siswa';
      if (selectedRole === 'guru') displayName = 'Bapak / Ibu Guru SPANJU';

      const user: AuthUser = {
        username: 'passtemenan',
        role: selectedRole === 'admin' ? 'siswa' : selectedRole,
        displayName,
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      onLoginSuccess(user);
      return;
    }

    // Invalid credentials
    setErrorMessage('Username atau password tidak sesuai. Silakan periksa kembali petunjuk login di bawah.');
  };

  const handleQuickLogin = (userType: 'siswa' | 'orang_tua' | 'guru' | 'admin', targetApp?: ActiveAppId) => {
    if (userType === 'admin') {
      setUsername('admin');
      setPassword('admin123');
      setSelectedRole('admin');
      setErrorMessage(null);
      const user: AuthUser = {
        username: 'admin',
        role: 'admin',
        displayName: 'Administrator / Operator Sekolah',
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        targetApp,
      };
      onLoginSuccess(user);
    } else {
      setUsername('passtemenan');
      setPassword('smpn7');
      setSelectedRole(userType);
      setErrorMessage(null);
      let displayName = 'Siswa Sahabat SPANJU';
      if (userType === 'orang_tua') displayName = 'Orang Tua / Wali Siswa';
      if (userType === 'guru') displayName = 'Bapak / Ibu Guru SPANJU';

      const user: AuthUser = {
        username: 'passtemenan',
        role: userType,
        displayName,
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        targetApp,
      };
      onLoginSuccess(user);
    }
  };

  return (
    <div
      id="modal-login-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="modal-login-card"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in duration-200 max-h-[95vh] flex flex-col"
      >
        {/* Close Button if dismissible */}
        {canDismiss && onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-10"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Header Branding - Clean Elegant Light Theme */}
          <div className="bg-white px-6 pt-6 pb-4 text-slate-900 text-center relative border-b border-slate-100 flex flex-col items-center shrink-0">
            <div className="inline-flex p-1 bg-white rounded-full shadow-md border border-emerald-100 mb-3 ring-2 ring-emerald-50">
              <img
                src="https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg"
                alt="Logo Pass Temenan"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover bg-white"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&q=80';
                }}
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black tracking-wide uppercase mb-2 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>APLIKASI SAHABAT SPANJU</span>
            </div>

            <p className="text-[10px] text-slate-500 font-bold leading-tight max-w-[280px] mx-auto mb-3 italic">
              (Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan SMP Negeri 7 Pasuruan)
            </p>

            <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
              AKSES MASUK APLIKASI
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 tracking-[0.2em] uppercase">
              UPT SMP Negeri 7 Pasuruan
            </p>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-4">
          {/* Infografis Quick Banner */}
          {onShowInfografis && (
            <button
              type="button"
              onClick={onShowInfografis}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 hover:border-emerald-300 hover:shadow-sm transition flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-emerald-950 uppercase tracking-tight">
                    Infografis Sahabat SPANJU
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    Klik untuk melihat bagan infografis resmi sekolah
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-2xs group-hover:bg-emerald-700 transition">
                Buka
              </span>
            </button>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-in shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Gagal Masuk: </span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NAMA PENGGUNA (USERNAME)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="input-login-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="admin atau passtemenan"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                KATA SANDI (PASSWORD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-4"
            >
              <LogIn className="w-4 h-4" />
              Masuk ke Aplikasi Sahabat SPANJU
            </button>
          </form>

          {/* Access Portals & Help Icons Grid */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3 text-center">
              Pilih Portal Akses Cepat (1 Klik Masuk):
            </span>
            
            <div className="space-y-2">
              {/* Row 1: Portals */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('siswa')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition group text-center"
                >
                  <GraduationCap className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-black text-emerald-900 uppercase tracking-tight">Portal Siswa</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('orang_tua')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-teal-50 border border-teal-100 hover:bg-teal-100 transition group text-center"
                >
                  <Users className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-black text-teal-900 uppercase tracking-tight">Orang Tua</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('guru')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 border border-sky-100 hover:bg-sky-100 transition group text-center"
                >
                  <Briefcase className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-black text-sky-900 uppercase tracking-tight">Portal Guru</span>
                </button>
              </div>

              {/* Row 2: Help & Hotline */}
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="https://heyzine.com/flip-book/45802adfc1.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition group text-center"
                >
                  <BookOpen className="w-5 h-5 text-rose-600 mb-1 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-black text-rose-900 uppercase tracking-tight">Manual Book</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('siswa', 'hotline_bantuan')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition group text-center"
                >
                  <PhoneCall className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-black text-amber-900 uppercase tracking-tight">Portal Hotline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
