
import React, { useState, useCallback, useEffect } from 'react';
import { Metric, User, UserRole, AccessRequest, MainCategoryDisplay, Widget, MetricData, WidgetType, RichTextWidgetConfig } from './types';
import { INITIAL_MAIN_CATEGORIES_DATA, ADMIN_EMAIL } from './constants';
import MetricCard from './components/MetricCard';
import DashboardModal from './components/DashboardModal';
import AuthModal from './components/AuthModal';
import AdminPanelModal from './components/AdminPanelModal';
import UserMenu from './components/UserMenu';
import DashboardEditorModal from './components/DashboardEditorModal'; // New Import
import { BookOpenIcon, PencilIcon } from './components/Icons';

const App: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [approvedEditors, setApprovedEditors] = useState<string[]>([]);

  const [appDashboardData, setAppDashboardData] = useState<MainCategoryDisplay[]>(INITIAL_MAIN_CATEGORIES_DATA);
  const [showDashboardEditor, setShowDashboardEditor] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);


  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    
    const storedEditors = localStorage.getItem('approvedEditors');
    if (storedEditors) setApprovedEditors(JSON.parse(storedEditors));
    
    const storedRequests = localStorage.getItem('accessRequests');
    if (storedRequests) {
      setAccessRequests(JSON.parse(storedRequests));
    } else {
      setAccessRequests([
        { id: 'req1', email: 'editor.applicant1@example.com', status: 'pending' },
        { id: 'req2', email: 'another.editor@example.com', status: 'pending' },
      ]);
    }

    const storedDashboardData = localStorage.getItem('appDashboardData');
    if (storedDashboardData) {
      setAppDashboardData(JSON.parse(storedDashboardData));
    } else {
      setAppDashboardData(INITIAL_MAIN_CATEGORIES_DATA);
    }
  }, []);

  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('currentUser');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('approvedEditors', JSON.stringify(approvedEditors));
  }, [approvedEditors]);

  useEffect(() => {
    localStorage.setItem('accessRequests', JSON.stringify(accessRequests));
  }, [accessRequests]);

  useEffect(() => {
    localStorage.setItem('appDashboardData', JSON.stringify(appDashboardData));
  }, [appDashboardData]);


  const handleMetricClick = useCallback((metric: Metric) => {
    // Ensure we are showing the latest version of the metric data if it was edited
    const currentCategory = appDashboardData.find(cat => cat.metrics.some(m => m.id === metric.id));
    const latestMetric = currentCategory?.metrics.find(m => m.id === metric.id);
    setSelectedMetric(latestMetric || metric);
  }, [appDashboardData]);

  const handleCloseModal = useCallback(() => {
    setSelectedMetric(null);
  }, []);

  const handleLoginRequest = useCallback((email: string): 'admin_login' | 'editor_login' | 'request_submitted' | 'already_pending' | 'already_approved' => {
    if (email === ADMIN_EMAIL) {
      setCurrentUser({ email, role: UserRole.ADMIN });
      setShowAuthModal(false);
      return 'admin_login';
    }
    if (approvedEditors.includes(email)) {
      setCurrentUser({ email, role: UserRole.EDITOR });
      setShowAuthModal(false);
      return 'editor_login';
    }
    
    if (accessRequests.some(req => req.email === email && req.status === 'pending')) {
      return 'already_pending';
    }
    if (accessRequests.some(req => req.email === email && req.status === 'approved')) {
        // This case should ideally be caught by approvedEditors.includes(email) first
        // but as a fallback if accessRequests is somehow out of sync.
        return 'already_approved'; 
    }
    
    setAccessRequests(prev => {
        const otherRequests = prev.filter(req => req.email !== email || req.status === 'denied'); // Allow re-request if denied
        return [...otherRequests, { id: `req-${Date.now()}`, email, status: 'pending' }];
    });
    return 'request_submitted';

  }, [approvedEditors, accessRequests, setAccessRequests, setCurrentUser, setShowAuthModal]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const handleApproveRequest = useCallback((email: string) => {
    setApprovedEditors(prev => [...new Set([...prev, email])]);
    setAccessRequests(prev => prev.map(req => req.email === email && req.status === 'pending' ? {...req, status: 'approved' as 'approved'} : req).filter(req => req.status !== 'approved'));
  }, []);
  
  const handleDenyRequest = useCallback((email: string) => {
    setAccessRequests(prev => prev.map(req => req.email === email && req.status === 'pending' ? {...req, status: 'denied' as 'denied'} : req));
  }, []);

  const handleRevokeAccess = useCallback((email: string) => {
    setApprovedEditors(prev => prev.filter(editorEmail => editorEmail !== email));
    if (currentUser && currentUser.email === email) {
        handleLogout();
    }
  }, [currentUser, handleLogout]);

  // --- Dashboard Editor Handlers ---
  const handleOpenDashboardEditor = (metric: Metric) => {
    setEditingMetric(metric);
    setShowDashboardEditor(true);
    if (selectedMetric) handleCloseModal(); // Close the view modal if editor is opened from there
  };

  const handleCloseDashboardEditor = () => {
    setEditingMetric(null);
    setShowDashboardEditor(false);
  };

  const handleSaveDashboardChanges = (metricId: string, newWidgets: Widget[]) => {
    setAppDashboardData(prevData => 
      prevData.map(category => ({
        ...category,
        metrics: category.metrics.map(metric => 
          metric.id === metricId 
          ? { ...metric, data: { ...metric.data, widgets: newWidgets } } 
          : metric
        )
      }))
    );
    handleCloseDashboardEditor();
    // Optionally, re-open the view modal with updated data
    const updatedCategory = appDashboardData.find(cat => cat.metrics.some(m => m.id === metricId));
    const updatedMetric = updatedCategory?.metrics.find(m => m.id === metricId);
    if (updatedMetric) {
        // The state update for appDashboardData is async, so we use the just updated version
        // for immediate reopening.
        const finalUpdatedMetric = {
            ...updatedMetric,
            data: { ...updatedMetric.data, widgets: newWidgets }
        };
        setSelectedMetric(finalUpdatedMetric);
    }
  };

  const userRoleText = currentUser ? ` (${currentUser.role} Mode)` : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-800 flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-7xl mb-6 md:mb-10">
        <div className="flex justify-between items-center py-2">
            <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-md p-2 rounded-full">
                <BookOpenIcon className="w-8 h-8 text-sky-300" />
            </div>
            <div className="flex items-center space-x-4">
                {currentUser ? (
                    <UserMenu 
                        user={currentUser} 
                        onLogout={handleLogout} 
                        onAdminPanelClick={currentUser.role === UserRole.ADMIN ? () => setShowAdminPanel(true) : undefined}
                    />
                ) : (
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors"
                    >
                        Login / Register
                    </button>
                )}
            </div>
        </div>
        <div className="text-center mt-4">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-300 to-emerald-400 mb-3">
            Sustainability Dashboard <span className="text-2xl text-sky-200">{userRoleText}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Showcasing University of Melbourne commitment to sustainability across teaching, operations, and community engagement. Track progress towards Sustainability Plan 2030 targets.
            </p>
        </div>
      </header>

      <main className="w-full max-w-7xl">
        {appDashboardData.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <section key={category.id} className="mb-10 md:mb-16">
              <div className="mb-6 md:mb-8 p-4 bg-slate-800 bg-opacity-50 rounded-xl shadow-lg border-l-4 border-teal-500">
                <div className="flex items-center mb-2">
                  {CategoryIcon && <CategoryIcon className="w-7 h-7 text-teal-400 mr-3" />}
                  <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">
                    {category.title}
                  </h2>
                </div>
                {category.description && <p className="text-slate-400 text-sm md:text-base">{category.description}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {category.metrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    metric={metric}
                    onClick={() => handleMetricClick(metric)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="w-full max-w-7xl mt-12 text-center">
        <p className="text-sm text-slate-400">
          Sustainability Dashboard &copy; {new Date().getFullYear()} | University of Melbourne
        </p>
      </footer>
      
      {selectedMetric && (
        <DashboardModal 
            metric={selectedMetric} 
            onClose={handleCloseModal} 
            currentUser={currentUser}
            onEditDashboard={handleOpenDashboardEditor}
        />
      )}
      {showAuthModal && (
        <AuthModal 
            onClose={() => {
                setShowAuthModal(false);
            }} 
            onSubmit={handleLoginRequest} 
        />
      )}
      {currentUser?.role === UserRole.ADMIN && showAdminPanel && (
        <AdminPanelModal
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          accessRequests={accessRequests.filter(r => r.status === 'pending')}
          approvedEditors={approvedEditors}
          onApprove={handleApproveRequest}
          onDeny={handleDenyRequest}
          onRevoke={handleRevokeAccess}
        />
      )}
      {showDashboardEditor && editingMetric && (
        <DashboardEditorModal
          metric={editingMetric}
          isOpen={showDashboardEditor}
          onClose={handleCloseDashboardEditor}
          onSave={handleSaveDashboardChanges}
        />
      )}
    </div>
  );
};

export default App;