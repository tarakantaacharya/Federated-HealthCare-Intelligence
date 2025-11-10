import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Federated HealthCare Intelligence
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
          Secure coordination hub for hospitals participating in privacy-preserving federated
          learning across the healthcare network.
        </p>
        <div className="mt-12 grid w-full gap-6 md:grid-cols-3">
          <button
            type="button"
            onClick={() => navigate('/central-login')}
            className="group rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent p-1 text-left transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="h-full w-full rounded-2xl bg-slate-900/80 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                ☁️
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">Central Server Login</h2>
              <p className="mt-3 text-sm text-slate-300">
                Access the orchestration console for global model oversight and governance.
              </p>
              <span className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-300">
                Authenticate
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/hospital-login')}
            className="group rounded-2xl bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent p-1 text-left transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="h-full w-full rounded-2xl bg-slate-900/80 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
                🏥
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">Hospital Login</h2>
              <p className="mt-3 text-sm text-slate-300">
                Launch your hospital node dashboard to manage local model training pipelines.
              </p>
              <span className="mt-6 inline-flex items-center text-sm font-semibold text-cyan-300">
                Sign in
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/hospital-register')}
            className="group rounded-2xl bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent p-1 text-left transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="h-full w-full rounded-2xl bg-slate-900/80 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/20 text-teal-300">
                ✨
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">Register New Hospital</h2>
              <p className="mt-3 text-sm text-slate-300">
                Join the federated ecosystem to contribute anonymized insights and benefit from shared models.
              </p>
              <span className="mt-6 inline-flex items-center text-sm font-semibold text-teal-300">
                Enroll now
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
