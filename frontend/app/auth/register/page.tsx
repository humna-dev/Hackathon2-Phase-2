'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import apiClient from '@/lib/api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await apiClient.post('/api/auth/register', {
        username,
        email,
        password,
      })

      if (response.status === 200) {
        setSuccess('Registration successful! You can now log in.')
        setError('')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        setError('Registration failed')
      }
    } catch (error: any) {
      let errorMessage = 'Registration failed';

      try {
        if (error.response?.data) {
          const data = error.response.data;
          
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data.detail) {
            errorMessage = String(data.detail);
          } else if (Array.isArray(data) && data[0]?.msg) {
            errorMessage = String(data[0].msg);
          } else if (data.msg) {
            errorMessage = String(data.msg);
          }
        } else if (error.message) {
          errorMessage = String(error.message);
        }
      } catch {
        errorMessage = 'Registration failed';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              SYSTEM REGISTRATION
            </h1>
            <p className="text-slate-400 font-mono text-sm">Create new access credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-green-400 text-sm font-mono">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                placeholder="Confirm password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/25 font-mono uppercase tracking-wider"
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'REGISTER ACCESS'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-mono text-sm">
              Already registered?{' '}
              <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                ACCESS LOGIN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}