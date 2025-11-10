import React, { useState } from 'react';
import axios from 'axios';

const WeightsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [weights, setWeights] = useState<{coefficients: number[][], intercept: number[]} | null>(null);

  const handleGetWeights = async () => {
    if (!hospitalId) {
      setMessage('Please enter hospital ID');
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

  const handleDownload = () => {
    if (!weights) return;
    const dataStr = JSON.stringify(weights, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `weights_${hospitalId}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Get Weights</h1>
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
          <button
            onClick={handleGetWeights}
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200 mb-4"
          >
            {loading ? 'Loading...' : 'Get Weights'}
          </button>
          {weights && (
            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              Download Weights
            </button>
          )}
          {message && (
            <div className={`mt-4 p-4 rounded-lg text-center ${
              message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}
          {weights && (
            <div className="mt-6 bg-slate-50 p-6 rounded-lg border">
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

export default WeightsPage;