import React, { useState } from 'react';
import axios from 'axios';

const TrainPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [metrics, setMetrics] = useState<{accuracy: number, loss: number} | null>(null);

  const handleTrain = async () => {
    if (!hospitalId) {
      setMessage('Please enter hospital ID');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/train_model', { hospital_id: parseInt(hospitalId) });
      setMessage(response.data.message);
      setMetrics({accuracy: response.data.accuracy, loss: response.data.loss});
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Training failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Train Model</h1>
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
            onClick={handleTrain}
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
          >
            {loading ? 'Training...' : 'Train Model'}
          </button>
          {message && (
            <div className={`mt-4 p-4 rounded-lg text-center ${
              message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}
          {metrics && (
            <div className="mt-4 bg-slate-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Training Metrics</h3>
              <p>Accuracy: {metrics.accuracy.toFixed(4)}</p>
              <p>Loss: {metrics.loss.toFixed(4)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainPage;