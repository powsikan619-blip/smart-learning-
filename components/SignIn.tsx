
import React from 'react';
import { GraduationCap, Mail } from 'lucide-react';

interface SignInProps {
  onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Decor */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-50 rounded-full" />
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl text-white mb-8 shadow-xl shadow-indigo-200">
            <GraduationCap className="w-10 h-10" />
          </div>
          
          <h1 className="text-4xl font-black text-slate-800 mb-2">Smart SL</h1>
          <p className="text-slate-400 mb-10 leading-relaxed font-medium">
            Personalized AI Learning for <br />
            Sri Lankan Students
          </p>

          <div className="space-y-4">
            <button 
              onClick={onSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            
            <button 
              onClick={onSignIn}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 py-4 rounded-2xl font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <Mail className="w-5 h-5" />
              Sign in with Email
            </button>
          </div>

          <div className="mt-10 text-sm text-slate-400 font-medium">
            Don't have an account? <button className="text-indigo-600 font-bold hover:underline">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
