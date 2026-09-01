import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../apis/auth/authApi';
import { PasswordStrength } from '../../components/common/PasswordStrength';
import { AuthBackground, AuthBrand } from './LoginPage';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isPasswordValid =
    newPassword.length >= 8 &&
    newPassword.length <= 16 &&
    /[A-Z]/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Password reset token is missing.');
      return;
    }

    if (!isPasswordValid) {
      setError(
        'Password must be 8-16 characters and include at least one uppercase letter and one special character.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({ token, newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10">
        <AuthBrand />

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-black mb-2 text-center">
            Set new password
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            {emailParam ? `Account: ${emailParam}` : 'Enter your new credentials below.'}
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Password Reset Successfully!
              </h3>
              <p className="text-xs text-gray-600">
                Redirecting you to the sign-in page...
              </p>
              <Link
                to="/login"
                className="inline-block mt-3 text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                Click to Sign In Now
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!tokenParam && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    placeholder="Enter reset token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-black focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400 text-sm"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                <PasswordStrength password={newPassword} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-black focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 h-12 flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Back to{' '}
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
