import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apiClient from '../api/apiClient';
import axios from 'axios';

const HospitalRegister: React.FC = () => {
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!hospitalName || !email || !password || !address || !contactNumber) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.registerHospital({
        username: hospitalName, // Backend expects 'username' for hospital name
        email,
        password,
        address,
        contact_number: contactNumber,
      });
      alert(response.data.message); // Simple alert for success
      navigate('/under-construction');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Registration failed. Please try again.');
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
        <h2 className="text-3xl font-bold text-center text-slate-900">New Hospital Registration</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Complete the form to onboard your hospital into the federated network.
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="hospital-name" className="sr-only">Hospital Name</label>
            <input
              id="hospital-name"
              name="hospital-name"
              type="text"
              autoComplete="organization"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="address" className="sr-only">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="contact-number" className="sr-only">Contact Number</label>
            <input
              id="contact-number"
              name="contact-number"
              type="tel"
              autoComplete="tel"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Registering...
              </span>
            ) : (
              'Register Hospital'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HospitalRegister;
