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
    <div className="fixed inset-0 z-40 flex items-center justify-center pt-24 animate-fade-in-up">
      <div className="bg-black/40 absolute inset-0 backdrop-blur-md transition-all duration-300" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-white via-blue-50/20 to-white text-gray-800 rounded-2xl shadow-2xl max-w-8xl w-[90%] z-50 max-h-[92vh] overflow-hidden flex flex-col animate-scale-in border border-blue-100/40">
        {/* Header with enhanced gradient and glow */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-8 py-8 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="animate-slide-in-left">
              <h3 className="text-3xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">{metric.name}</h3>
              <p className="text-sm text-blue-100/90 mt-2 font-light">{metric.description}</p>
            </div>
            <div className="space-x-2 flex animate-slide-in-right">
              <button onClick={onClose} className="px-4 py-2.5 bg-blue-700/80 hover:bg-blue-800 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-blue-600/40">Close</button>
              {currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Editor') && (
                <button onClick={() => onEditDashboard && onEditDashboard(metric)} className="px-4 py-2.5 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-300 hover:to-blue-400 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg">Edit</button>
              )}
            </div>
          </div>
        </div>

        {isAirTravel ? (
          <div className="w-full h-[85vh] overflow-auto bg-gradient-to-b from-white via-blue-50/30 to-white text-gray-800 rounded-b-2xl px-8 py-8">
            {loading && <div className="text-center py-12 text-gray-600 font-medium text-lg animate-pulse">Loading flight dashboard data…</div>}
            {error && <div className="text-red-600 font-semibold bg-red-50 p-4 rounded-lg border border-red-200">Error loading data: {error}</div>}
            {!loading && !error && flightData && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Flights', value: flightData.summary?.total_flights?.toLocaleString?.() ?? flightData.summary?.total_flights, icon: '✈️' },
                    { label: 'Total Emissions (tonnes CO₂e)', value: (flightData.summary?.total_emissions/1e6).toFixed(2), icon: '💨' },
                    { label: 'Total Distance (km)', value: Math.round(flightData.summary?.total_distance).toLocaleString?.(), icon: '🌍' },
                    { label: 'Avg. Emissions (kg CO₂e/km)', value: (flightData.summary?.average_emissions_per_km ?? 0).toFixed(2), icon: '📊' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-white rounded-xl shadow-md p-6 text-center border-2 border-blue-200/60 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-fade-in-up glass" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-sm text-gray-700 font-semibold mt-3">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <h4 className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-4 rounded-t-2xl font-bold text-xl shadow-md">Faculty Emissions</h4>
                  <div className="bg-white/80 glass p-6 rounded-b-2xl shadow-md border border-t-0 border-blue-100/40">
                    <img src="/visualizations/flights_faculty_emissions.png" alt="Faculty Emissions" className="w-full rounded-xl shadow-sm hover:shadow-md transition-shadow" />
                  </div>
                </div>

                <div className="mb-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <h4 className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-4 rounded-t-2xl font-bold text-xl shadow-md">Time-based Analysis</h4>
                  <div className="bg-white/80 glass p-6 rounded-b-2xl shadow-md border border-t-0 border-blue-100/40 space-y-4">
                    <img src="/visualizations/flights_quarterly_emissions.png" alt="Quarterly Emissions" className="w-full rounded-xl shadow-sm hover:shadow-md transition-shadow" />
                    <img src="/visualizations/flights_monthly_emissions.png" alt="Monthly Emissions" className="w-full rounded-xl shadow-sm hover:shadow-md transition-shadow" />
                  </div>
                </div>

                <div className="mb-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <h4 className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-4 rounded-t-2xl font-bold text-xl shadow-md">Top Routes</h4>
                  <div className="bg-white/80 glass p-6 rounded-b-2xl shadow-md border border-t-0 border-blue-100/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="transform hover:-translate-y-1 transition-transform duration-300">
                        <h5 className="font-bold mb-3 text-gray-800 text-lg">Most Frequent Routes</h5>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-700 border-b-2 border-blue-300"><th className="pb-2 font-bold">Route</th><th className="pb-2 font-bold">Flights</th><th className="pb-2 font-bold">Emissions (kg)</th></tr>
                          </thead>
                          <tbody>
                            {(flightData.routes?.frequent_routes || []).slice(0,10).map((r: any, i: number) => (
                              <tr key={i} className="border-t border-gray-200 hover:bg-blue-50/50 transition-colors"><td className="py-2">{r.Route}</td><td className="py-2">{r.Flight_Count?.toLocaleString?.()}</td><td className="py-2 font-semibold text-blue-600">{Math.round(r.Total_Emissions).toLocaleString?.()}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="transform hover:-translate-y-1 transition-transform duration-300">
                        <h5 className="font-bold mb-3 text-gray-800 text-lg">Highest Emissions Routes</h5>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-700 border-b-2 border-blue-300"><th className="pb-2 font-bold">Route</th><th className="pb-2 font-bold">Flights</th><th className="pb-2 font-bold">Emissions (kg)</th></tr>
                          </thead>
                          <tbody>
                            {(flightData.routes?.high_emission_routes || []).slice(0,10).map((r: any, i: number) => (
                              <tr key={i} className="border-t border-gray-200 hover:bg-blue-50/50 transition-colors"><td className="py-2">{r.Route}</td><td className="py-2">{r.Flight_Count?.toLocaleString?.()}</td><td className="py-2 font-semibold text-blue-600">{Math.round(r.Total_Emissions).toLocaleString?.()}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!loading && !error && !flightData && <div className="text-center py-8 text-gray-600">No flight data available.</div>}
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            {metric.id === 'tr-teaching-learning-research' ? (
              (() => {
                const embedWidget = metric.data.widgets?.find(w => w.type === WidgetType.EMBEDDED_CONTENT);
                const url = (embedWidget?.config as EmbeddedContentWidgetConfig)?.url || '';
                const height = (embedWidget?.config as EmbeddedContentWidgetConfig)?.height || '80vh';
                return <div className="overflow-auto h-[80vh] p-2 animate-fade-in-up"><TeachingLearningResearch experienceUrl={url} height={height} /></div>;
              })()
            ) : (
              metric.data?.widgets?.map((w, idx) => (
                <div key={w.id || idx} className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200 hover:shadow-md transition-all animate-fade-in-up glass" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="text-sm font-bold text-gray-900">{(w as any).config?.title || w.id}</div>
                  <div className="text-sm text-gray-600 mt-2">Widget preview not available in modal.</div>
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
