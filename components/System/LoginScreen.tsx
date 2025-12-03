import React, { useState } from 'react';
import { ArrowRight, Lock, User, AlertCircle } from 'lucide-react';
import { Kernel } from '../../services/Kernel';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setError(false);

    // Simulate network delay
    setTimeout(() => {
      if (Kernel.authenticate(password)) {
        onLogin();
      } else {
        setError(true);
        setLoading(false);
        setPassword('');
      }
    }, 800);
  };

  return (
    <div className="h-screen w-screen bg-[#050510] flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#050510] to-black" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-md p-8">
            {/* User Avatar */}
            <div className="mb-8 relative group">
                <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-cyan-500 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                         <User size={64} className="text-white/80" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                </div>
                <div className="absolute bottom-0 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-black" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Administrator</h1>
            <p className="text-white/40 text-sm mb-8">NexusOS Protected Environment</p>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="w-full relative">
                <div className={`
                    relative group transition-all duration-300
                    ${error ? 'animate-shake' : ''}
                `}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={16} className="text-white/40" />
                    </div>
                    
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password (admin)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all backdrop-blur-sm"
                        autoFocus
                    />

                    <button 
                        type="submit"
                        disabled={loading || !password}
                        className="absolute inset-y-1 right-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-3 flex items-center justify-center transition-colors disabled:opacity-0 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <ArrowRight size={16} />
                        )}
                    </button>
                </div>
                
                {error && (
                    <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-red-400 text-xs animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={12} />
                        <span>Authentication Failed. Try 'admin'</span>
                    </div>
                )}
            </form>
            
            {/* Footer */}
            <div className="absolute bottom-[-150px] text-white/20 text-xs">
                Nexus Security Core v4.1.2
            </div>
        </div>
        
        <style>{`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            .animate-shake {
                animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
            }
        `}</style>
    </div>
  );
};

export default LoginScreen;
