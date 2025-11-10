import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage('Please select a file first');
      return;
    }
    if (!hospitalId) {
      setMessage('Please enter hospital ID');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('hospital_id', hospitalId);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload_dataset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Upload Dataset</h1>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Hospital ID</label>
            <input
              type="number"
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
          >
            {loading ? 'Uploading...' : 'Upload Dataset'}
          </button>
          {message && (
            <div className={`mt-4 p-4 rounded-lg text-center ${
              message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;