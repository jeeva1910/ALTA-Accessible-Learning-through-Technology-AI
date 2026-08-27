import React, { useState } from 'react';
import { Volume2, AlertCircle } from 'lucide-react';
import { voiceFeedback } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { altaApi } from '../utils/api';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBrandTrigger = () => {
    triggerHaptic('light');
    voiceFeedback.speak('ALTA Accessible Learning');
  };

  const handleHeadingTrigger = () => {
    triggerHaptic('light');
    voiceFeedback.speak(isRegisterMode ? 'Create New Account' : 'Welcome Back');
  };

  const handleEmailTrigger = () => {
    triggerHaptic('light');
    voiceFeedback.speak('Email');
  };

  const handleNameTrigger = () => {
    triggerHaptic('light');
    voiceFeedback.speak('Full Name');
  };

  const handlePasswordTrigger = () => {
    triggerHaptic('light');
    voiceFeedback.speak('Password');
  };

  const handleLoginButtonTrigger = () => {
    triggerHaptic('medium');
    voiceFeedback.speak(isRegisterMode ? 'Create Account button' : 'Login button');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      const msg = 'Please enter both email and password';
      setErrorMessage(msg);
      triggerHaptic('warning');
      voiceFeedback.speak(msg);
      return;
    }

    if (isRegisterMode && cleanPassword.length < 6) {
      const msg = 'Password must be at least 6 characters long';
      setErrorMessage(msg);
      triggerHaptic('warning');
      voiceFeedback.speak(msg);
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('medium');
    voiceFeedback.speak(isRegisterMode ? 'Creating your account' : 'Logging in');

    try {
      if (isRegisterMode) {
        const res = await altaApi.register({
          email: cleanEmail,
          password: cleanPassword,
          name: name.trim() || cleanEmail.split('@')[0] || 'ALTA Learner',
          role: 'student',
        });

        if (res.ok && res.token) {
          triggerHaptic('success');
          voiceFeedback.speak('Account created successfully. Welcome to ALTA.');
          onLogin();
          return;
        } else {
          const err = res.error || 'Registration failed. Please check your credentials.';
          setErrorMessage(err);
          triggerHaptic('error');
          voiceFeedback.speak(err);
        }
      } else {
        const res = await altaApi.login({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (res.ok && res.token) {
          triggerHaptic('success');
          voiceFeedback.speak('Login successful. Proceeding to learning mode selection.');
          onLogin();
          return;
        } else {
          const err = res.error || 'Invalid email or password.';
          setErrorMessage(err);
          triggerHaptic('error');
          voiceFeedback.speak(err);
        }
      }
    } catch {
      const err = 'Unable to connect to authentication server. Please try again.';
      setErrorMessage(err);
      triggerHaptic('error');
      voiceFeedback.speak(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="login-page"
      className="min-h-screen w-full bg-[#F0F9FF] text-[#0C4A6E] font-sans flex flex-col items-center justify-center p-6 sm:p-12 md:p-20 selection:bg-[#BAE6FD]"
    >
      <main
        id="login-container"
        className="w-full max-w-lg flex flex-col items-center"
        role="region"
        aria-label="Login screen"
      >
        {/* Editorial Brand Header */}
        <div
          id="brand-header"
          className="mb-8 sm:mb-10 text-center cursor-pointer select-none"
          onClick={handleBrandTrigger}
          onFocus={handleBrandTrigger}
          onTouchStart={handleBrandTrigger}
          onMouseEnter={handleBrandTrigger}
          tabIndex={0}
          role="banner"
          aria-label="ALTA logo"
        >
          <h1 className="text-5xl sm:text-6xl font-black tracking-widest text-[#0369A1] mb-3">
            ALTA
          </h1>
          <div className="h-2 w-24 bg-[#0EA5E9] mx-auto rounded-full"></div>
        </div>

        {/* Welcome Back / Create Account Heading */}
        <div
          id="welcome-section"
          className="text-center mb-6 cursor-pointer"
          onClick={handleHeadingTrigger}
          onFocus={handleHeadingTrigger}
          onTouchStart={handleHeadingTrigger}
          onMouseEnter={handleHeadingTrigger}
          tabIndex={0}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0C4A6E]">
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-base text-slate-600 mt-1 font-medium">
            {isRegisterMode ? 'Register your secure learning profile' : 'Sign in to access your accessible learning portal'}
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div
            id="auth-error-banner"
            role="alert"
            aria-live="assertive"
            className="w-full mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-2xl flex items-center gap-3 text-red-800 font-semibold"
          >
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm sm:text-base">{errorMessage}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="w-full space-y-5 sm:space-y-6" noValidate>
          {/* Full Name Input (Register Mode Only) */}
          {isRegisterMode && (
            <div id="name-field-group">
              <label
                htmlFor="name"
                className="block text-xl font-bold mb-2 text-[#0C4A6E] cursor-pointer"
                onClick={() => {
                  triggerHaptic('light');
                  voiceFeedback.speak('Full Name Label');
                }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  triggerHaptic('light');
                }}
                onFocus={handleNameTrigger}
                onTouchStart={handleNameTrigger}
                onMouseEnter={handleNameTrigger}
                aria-label="Full Name"
                className="w-full h-16 sm:h-20 px-6 text-xl sm:text-2xl font-medium border-4 border-[#0369A1] rounded-2xl focus:outline-none focus:ring-8 focus:ring-[#BAE6FD] bg-white text-[#0C4A6E] placeholder:text-slate-400 transition-all"
              />
            </div>
          )}

          {/* Email Input */}
          <div id="email-field-group">
            <label
              htmlFor="email"
              className="block text-xl font-bold mb-2 text-[#0C4A6E] cursor-pointer"
              onClick={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Email Label');
              }}
              onTouchStart={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Email Label');
              }}
              onMouseEnter={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Email Label');
              }}
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  triggerHaptic('light');
                }}
                onFocus={handleEmailTrigger}
                onTouchStart={handleEmailTrigger}
                onMouseEnter={handleEmailTrigger}
                aria-label="Email"
                className="w-full h-16 sm:h-20 px-6 text-xl sm:text-2xl font-medium border-4 border-[#0369A1] rounded-2xl focus:outline-none focus:ring-8 focus:ring-[#BAE6FD] bg-white text-[#0C4A6E] placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div id="password-field-group">
            <label
              htmlFor="password"
              className="block text-xl font-bold mb-2 text-[#0C4A6E] cursor-pointer"
              onClick={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Password Label');
              }}
              onTouchStart={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Password Label');
              }}
              onMouseEnter={() => {
                triggerHaptic('light');
                voiceFeedback.speak('Password Label');
              }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  triggerHaptic('light');
                }}
                onFocus={handlePasswordTrigger}
                onTouchStart={handlePasswordTrigger}
                onMouseEnter={handlePasswordTrigger}
                aria-label="Password"
                className="w-full h-16 sm:h-20 pl-6 pr-24 text-xl sm:text-2xl font-medium border-4 border-[#0369A1] rounded-2xl focus:outline-none focus:ring-8 focus:ring-[#BAE6FD] bg-white text-[#0C4A6E] placeholder:text-slate-400 transition-all"
              />
              <button
                type="button"
                id="toggle-password-visibility"
                onClick={() => {
                  triggerHaptic('medium');
                  const nextState = !showPassword;
                  setShowPassword(nextState);
                  voiceFeedback.speak(nextState ? 'Password shown' : 'Password hidden');
                }}
                onFocus={() => {
                  triggerHaptic('light');
                  voiceFeedback.speak('Toggle password visibility');
                }}
                onTouchStart={() => {
                  triggerHaptic('light');
                  voiceFeedback.speak('Toggle password visibility');
                }}
                onMouseEnter={() => {
                  triggerHaptic('light');
                  voiceFeedback.speak('Toggle password visibility');
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 text-sm font-bold text-[#0369A1] bg-[#E0F2FE] hover:bg-[#BAE6FD] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] rounded-xl cursor-pointer transition-colors"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          {/* Large Tactile Editorial Submit Button */}
          <div className="pt-2">
            <button
              id="login-submit-button"
              type="submit"
              disabled={isSubmitting}
              onClick={() => triggerHaptic('heavy')}
              onFocus={handleLoginButtonTrigger}
              onTouchStart={handleLoginButtonTrigger}
              onMouseEnter={handleLoginButtonTrigger}
              aria-label={isRegisterMode ? 'Create Account button' : 'Login button'}
              className="w-full h-20 sm:h-24 bg-[#0369A1] text-white text-2xl sm:text-3xl font-black rounded-2xl hover:bg-[#075985] active:scale-95 transition-transform border-b-8 border-[#083344] focus:outline-none focus:ring-8 focus:ring-[#BAE6FD] flex items-center justify-center gap-3 cursor-pointer shadow-lg tracking-wide disabled:opacity-60"
            >
              <span>{isSubmitting ? 'PROCESSING...' : isRegisterMode ? 'CREATE ACCOUNT' : 'LOGIN'}</span>
              <Volume2 className="w-7 h-7 text-[#BAE6FD]" aria-hidden="true" />
            </button>
          </div>

          {/* Switch Mode Toggle (Login vs Register) */}
          <div className="text-center pt-2">
            <button
              type="button"
              id="toggle-auth-mode-button"
              onClick={() => {
                triggerHaptic('medium');
                setErrorMessage(null);
                const nextMode = !isRegisterMode;
                setIsRegisterMode(nextMode);
                voiceFeedback.speak(nextMode ? 'Switched to Create Account' : 'Switched to Login');
              }}
              className="text-base sm:text-lg font-bold text-[#0369A1] hover:underline focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] px-3 py-1.5 rounded-xl cursor-pointer"
            >
              {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
            </button>
          </div>
        </form>

        {/* Accessibility Touch Voice Guidance */}
        <div
          id="voice-guidance-note"
          className="mt-8 text-center flex items-center justify-center gap-2 text-[#0369A1] text-base font-semibold"
        >
          <Volume2 className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span>Touch or focus on any element for voice & haptic feedback.</span>
        </div>
      </main>
    </div>
  );
};
