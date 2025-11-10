import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apiClient from '../api/apiClient';
import axios from 'axios';

const CentralLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Both username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.loginCentral({ username, password });
      alert(response.data.message); // Simple alert for success
      navigate('/central-dashboard');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Login failed. Please check your credentials.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-slate-900">Central Server Login</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your credentials to access the central orchestration console.
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CentralLogin;
