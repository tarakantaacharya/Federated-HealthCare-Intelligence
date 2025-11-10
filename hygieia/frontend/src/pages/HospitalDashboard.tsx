import React, { useState, useRef } from 'react';
import axios from 'axios';

const HospitalDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [weights, setWeights] = useState<{coefficients: number[][], intercept: number[]} | null>(null);
  const [metrics, setMetrics] = useState<{accuracy: number, loss: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hospitalId = localStorage.getItem('hospital_id');

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage('Please select a file first');
      return;
    }
    if (!hospitalId) {
      setMessage('Hospital ID not found. Please login again.');
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

  const handleTrain = async () => {
    if (!hospitalId) {
      setMessage('Hospital ID not found. Please login again.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/train_model', { hospital_id: parseInt(hospitalId) });
      setMessage(response.data.message);
      setMetrics({ accuracy: response.data.accuracy, loss: response.data.loss });
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Training failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGetWeights = async () => {
    if (!hospitalId) {
      setMessage('Hospital ID not found. Please login again.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.get(`http://localhost:8000/get_weights/${hospitalId}`);
      setWeights(response.data);
      setMessage('Weights retrieved successfully');
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to get weights');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWeights = async () => {
    if (!hospitalId) {
      setMessage('Hospital ID not found. Please login again.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/send_weights', { hospital_id: parseInt(hospitalId) });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to send weights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Hospital ML Dashboard</h1>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Upload File */}
            <div className="text-center">
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                className="mb-4 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
              />
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
              >
                {loading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>

            {/* Train Model */}
            <div className="text-center">
              <button
                onClick={handleTrain}
                disabled={loading}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
              >
                {loading ? 'Training...' : 'Train Model'}
              </button>
            </div>

            {/* Get Weights */}
            <div className="text-center">
              <button
                onClick={handleGetWeights}
                disabled={loading}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
              >
                {loading ? 'Loading...' : 'Get Weights'}
              </button>
            </div>

            {/* Send Weights */}
            <div className="text-center">
              <button
                onClick={handleSendWeights}
                disabled={loading}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
              >
                {loading ? 'Sending...' : 'Send Weights'}
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              message.includes('success') || message.includes('retrieved')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Metrics Display */}
          {metrics && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Training Metrics</h3>
              <p className="text-blue-800">Accuracy: {(metrics.accuracy * 100).toFixed(2)}%</p>
              <p className="text-blue-800">Loss: {metrics.loss.toFixed(4)}</p>
            </div>
          )}

          {/* Weights Display */}
          {weights && (
            <div className="bg-slate-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Model Weights</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-700">Coefficients:</h4>
                  <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
                    {JSON.stringify(weights.coefficients, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700">Intercept:</h4>
                  <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
                    {JSON.stringify(weights.intercept, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;