import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import apiClient from "../api/apiClient";

type Hospital = {
  id: number;
  name: string;
  email: string;
  created_at?: string | null;
};

type WeightRecord = {
  hospital_id: number;
  sent_at: string;
};

type HospitalWithStatus = Hospital & {
  weightsSent: boolean;
};

const CentralDashboard: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // adjust base paths in apiClient if needed
      const [hospitalsResponse, weightsResponse] = await Promise.all([
        apiClient.get("/central/hospitals"),
        apiClient.get("/central/weights_received"),
      ]);

      // backend returns { success: true, hospitals: [...] } in our spec
      const hs: Hospital[] =
        hospitalsResponse.data?.hospitals ?? hospitalsResponse.data ?? [];
      const ws: WeightRecord[] =
        weightsResponse.data?.weights_received ??
        weightsResponse.data ??
        [];

      setHospitals(hs);
      setWeightRecords(ws);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ??
            err.response?.data?.message ??
            "Failed to load central dashboard data. Please try again."
        );
      } else {
        setError("Failed to load central dashboard data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hospitalsWithStatus: HospitalWithStatus[] = useMemo(() => {
    const sentSet = new Set<number>(weightRecords.map((r) => r.hospital_id));
    return hospitals.map((hospital) => ({
      ...hospital,
      weightsSent: sentSet.has(hospital.id),
    }));
  }, [hospitals, weightRecords]);

  const totalHospitals = hospitalsWithStatus.length;
  const sentCount = hospitalsWithStatus.filter((h) => h.weightsSent).length;
  const pendingCount = totalHospitals - sentCount;

  const formatDate = (d?: string | null) => {
    if (!d) return "—";
    const parsed = Date.parse(d);
    if (Number.isNaN(parsed)) {
      // try fallback for timestamps (MySQL may return nested formats)
      try {
        return new Date(d).toLocaleDateString();
      } catch {
        return d;
      }
    }
    return new Date(parsed).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-teal-900">Central Dashboard</h1>
          <p className="mt-2 text-teal-700">
            Monitor registered hospitals and weight transfer status
          </p>
        </header>

        <section className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-teal-900">
                Network Overview
              </h2>
              {lastUpdated && (
                <p className="text-sm text-teal-600">
                  Updated {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-center">
                  <p className="text-sm text-teal-600">Hospitals</p>
                  <p className="text-2xl font-bold text-teal-900">{totalHospitals}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">
                  <p className="text-sm text-emerald-600">Weights Sent</p>
                  <p className="text-2xl font-bold text-emerald-800">{sentCount}</p>
                </div>
                <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-center">
                  <p className="text-sm text-cyan-600">Pending</p>
                  <p className="text-2xl font-bold text-cyan-800">{pendingCount}</p>
                </div>
              </div>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-400"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Refreshing
                </>
              ) : (
                <span>Refresh</span>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && hospitalsWithStatus.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-teal-600">
              <span className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
              Loading hospitals...
            </div>
          ) : (
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-teal-50 text-left text-sm font-semibold text-teal-900">
                    <th className="border-b border-teal-100 px-6 py-4">Hospital Name</th>
                    <th className="border-b border-teal-100 px-6 py-4">Email</th>
                    <th className="border-b border-teal-100 px-6 py-4">Registered On</th>
                    <th className="border-b border-teal-100 px-6 py-4">Weights Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitalsWithStatus.map((hospital) => (
                    <tr
                      key={hospital.id}
                      className="text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="border-b border-slate-100 px-6 py-4">{hospital.name}</td>
                      <td className="border-b border-slate-100 px-6 py-4">{hospital.email}</td>
                      <td className="border-b border-slate-100 px-6 py-4">
                        {formatDate(hospital.created_at)}
                      </td>
                      <td className="border-b border-slate-100 px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            hospital.weightsSent
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {hospital.weightsSent ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {hospitalsWithStatus.length === 0 && !loading && !error && (
            <div className="py-12 text-center text-sm text-slate-500">
              No hospitals registered yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CentralDashboard;
