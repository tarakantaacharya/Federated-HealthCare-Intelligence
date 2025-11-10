import React from 'react';

const UnderConstruction: React.FC = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Website Under Progress — Federated HealthCare Intelligence
        </h1>
        <p className="mt-4 text-sm text-slate-600 sm:text-base">
          We are completing the deployment of the federated learning dashboards. Please check back soon for the full experience.
        </p>
      </section>
    </main>
  );
};

export default UnderConstruction;
