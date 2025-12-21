import React, { useEffect, useState } from 'react';
import { Metric, User, WidgetType, EmbeddedContentWidgetConfig } from '../types';
import TeachingLearningResearch from './TeachingLearningResearch';

type Props = {
  metric: Metric;
  onClose: () => void;
  currentUser?: User | null;
  onEditDashboard?: (metric: Metric) => void;
};

const DashboardModal: React.FC<Props> = ({ metric, onClose, currentUser, onEditDashboard }) => {
  const isAirTravel = metric.id === 'op-air-travel';

  const [flightData, setFlightData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAirTravel) return;
    setLoading(true);
    setError(null);
    fetch('/dashboard_data/flight_dashboard_data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setFlightData(json))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [isAirTravel]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="bg-black/60 absolute inset-0" onClick={onClose} />
      <div className="relative bg-slate-800 text-white p-4 md:p-6 rounded-lg shadow-lg max-w-8xl w-full z-50 max-h-[92vh] overflow-hidden">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold">{metric.name}</h3>
            <p className="text-sm text-slate-300">{metric.description}</p>
          </div>
          <div className="space-x-2">
            <button onClick={onClose} className="px-3 py-1 bg-slate-700 rounded">Close</button>
            {currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Editor') && (
              <button onClick={() => onEditDashboard && onEditDashboard(metric)} className="px-3 py-1 bg-sky-600 rounded">Edit</button>
            )}
          </div>
        </div>

        {isAirTravel ? (
          <div className="w-full h-[85vh] overflow-auto bg-white text-slate-800 rounded px-6 py-4">
            {loading && <div className="text-center py-8">Loading flight dashboard data…</div>}
            {error && <div className="text-red-600">Error loading data: {error}</div>}
            {!loading && !error && flightData && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded shadow p-4 text-center">
                    <div className="text-2xl font-bold">{flightData.summary?.total_flights?.toLocaleString?.() ?? flightData.summary?.total_flights}</div>
                    <div className="text-sm text-slate-500">Total Flights</div>
                  </div>
                  <div className="bg-white rounded shadow p-4 text-center">
                    <div className="text-2xl font-bold">{(flightData.summary?.total_emissions/1e6).toFixed(2)}</div>
                    <div className="text-sm text-slate-500">Total Emissions (tonnes CO₂e)</div>
                  </div>
                  <div className="bg-white rounded shadow p-4 text-center">
                    <div className="text-2xl font-bold">{Math.round(flightData.summary?.total_distance).toLocaleString?.()}</div>
                    <div className="text-sm text-slate-500">Total Distance (km)</div>
                  </div>
                  <div className="bg-white rounded shadow p-4 text-center">
                    <div className="text-2xl font-bold">{(flightData.summary?.average_emissions_per_km ?? 0).toFixed(2)}</div>
                    <div className="text-sm text-slate-500">Avg. Emissions (kg CO₂e/km)</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="bg-sky-600 text-white px-3 py-2 rounded-t">Faculty Emissions</h4>
                  <div className="bg-white p-4 rounded-b shadow">
                    <img src="/visualizations/flights_faculty_emissions.png" alt="Faculty Emissions" className="w-full" />
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="bg-sky-600 text-white px-3 py-2 rounded-t">Time-based Analysis</h4>
                  <div className="bg-white p-4 rounded-b shadow">
                    <img src="/visualizations/flights_quarterly_emissions.png" alt="Quarterly Emissions" className="w-full mb-4" />
                    <img src="/visualizations/flights_monthly_emissions.png" alt="Monthly Emissions" className="w-full" />
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="bg-sky-600 text-white px-3 py-2 rounded-t">Top Routes</h4>
                  <div className="bg-white p-4 rounded-b shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Most Frequent Routes</h5>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-600"><th>Route</th><th>Flights</th><th>Emissions (kg)</th></tr>
                          </thead>
                          <tbody>
                            {(flightData.routes?.frequent_routes || []).slice(0,10).map((r: any, i: number) => (
                              <tr key={i} className="border-t"><td className="py-1">{r.Route}</td><td className="py-1">{r.Flight_Count?.toLocaleString?.()}</td><td className="py-1">{Math.round(r.Total_Emissions).toLocaleString?.()}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Highest Emissions Routes</h5>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-600"><th>Route</th><th>Flights</th><th>Emissions (kg)</th></tr>
                          </thead>
                          <tbody>
                            {(flightData.routes?.high_emission_routes || []).slice(0,10).map((r: any, i: number) => (
                              <tr key={i} className="border-t"><td className="py-1">{r.Route}</td><td className="py-1">{r.Flight_Count?.toLocaleString?.()}</td><td className="py-1">{Math.round(r.Total_Emissions).toLocaleString?.()}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!loading && !error && !flightData && <div className="text-center py-8">No flight data available.</div>}
          </div>
        ) : (
          <div>
            {metric.id === 'tr-teaching-learning-research' ? (
              (() => {
                const embedWidget = metric.data.widgets?.find(w => w.type === WidgetType.EMBEDDED_CONTENT);
                const url = (embedWidget?.config as EmbeddedContentWidgetConfig)?.url || '';
                const height = (embedWidget?.config as EmbeddedContentWidgetConfig)?.height || '80vh';
                return <div className="overflow-auto h-[80vh] p-2"><TeachingLearningResearch experienceUrl={url} height={height} /></div>;
              })()
            ) : (
              metric.data?.widgets?.map((w, idx) => (
                <div key={w.id || idx} className="mb-4 p-3 bg-slate-700 rounded">
                  <div className="text-sm text-slate-200 font-medium">{(w as any).config?.title || w.id}</div>
                  <div className="text-sm text-slate-300 mt-1">Widget preview not available in modal.</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardModal;
