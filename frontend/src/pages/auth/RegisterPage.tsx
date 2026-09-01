import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';
import { PasswordStrength } from '../../components/common/PasswordStrength';
import { AuthBackground, AuthBrand } from './LoginPage';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isNameValid = name.length >= 20 && name.length <= 60;
  const isAddressValid = address.length > 0 && address.length <= 400;
  const isPasswordValid =
    password.length >= 8 &&
    password.length <= 16 &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isNameValid) {
      setError('Full Name must be between 20 and 60 characters.');
      return;
    }

    if (!isAddressValid) {
      setError('Address is required and must not exceed 400 characters.');
      return;
    }

    if (!isPasswordValid) {
      setError(
        'Password must be 8-16 characters and include at least one uppercase letter and one special character.'
      );
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, address, password });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-12 relative overflow-hidden font-sans">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10">
        <AuthBrand />

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-black mb-2 text-center">
            Create an account
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            Start rating stores and sharing genuine feedback today.
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <span
                  className={`text-xs ${
                    isNameValid ? 'text-green-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {name.length}/60 (Min 20)
                </span>
              </div>
              <input
                type="text"
                placeholder="e.g. Jonathan Alexander Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-black focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400 text-sm"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-black focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400 text-sm"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <span className="text-xs text-gray-400">
                  {address.length}/400
                </span>
              </div>
              <textarea
                rows={2}
                placeholder="e.g. 742 Evergreen Terrace, Downtown District"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-black focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400 text-sm resize-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-black focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400 text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 h-12 flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 mb-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-black hover:text-purple-600 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
