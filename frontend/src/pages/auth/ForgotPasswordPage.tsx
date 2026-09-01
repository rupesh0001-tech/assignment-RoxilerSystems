import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../apis/auth/authApi';
import { AuthBackground } from './LoginPage';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await authApi.forgotPassword(email);
      setSuccess(true);
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to request password reset. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-black mb-2 text-center">
            Reset password
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            Enter your email to generate a secure reset link.
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Password Reset Issued
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-gray-800">{email}</span>, a password reset token has been generated.
              </p>

              {resetToken && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-left mt-4">
                  <p className="text-xs font-bold text-purple-900 mb-1">
                    Development Reset Link:
                  </p>
                  <Link
                    to={`/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`}
                    className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline break-all block"
                  >
                    Click here to set your new password
                  </Link>
                </div>
              )}

              <Link
                to="/login"
                className="inline-block mt-4 text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 h-12 flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Remembered your password?{' '}
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
