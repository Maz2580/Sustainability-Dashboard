
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
import Logo from './components/Logo';

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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white text-gray-800 flex flex-col items-center overflow-x-hidden">
      {/* Professional Fixed Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 backdrop-blur-lg shadow-2xl border-b border-blue-400/20">
        <div className="max-w-full px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Only */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer">
                <Logo />
              </div>
            </div>

            {/* Navigation Links - Center */}
            <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
              <button
                onClick={() => {
                  const el = document.getElementById('teaching');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                Teaching & Research
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('operations');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                Operations
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 group-hover:w-full transition-all duration-300"></span>
              </button>
            </nav>

            {/* Right Side - Auth and User Menu */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {currentUser ? (
                  <UserMenu 
                      user={currentUser}
                      onLogout={handleLogout}
                      onAdminPanelClick={currentUser.role === UserRole.ADMIN ? () => setShowAdminPanel(true) : undefined}
                  />
              ) : (
                  <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                      Login
                  </button>
              )}
            </div>
          </div>
        </div>

        {/* Animated gradient bottom border */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
      </header>

      {/* Hero Section with padding for fixed nav */}
      <section className="w-full mt-20 mb-12 md:mb-16 pt-8 md:pt-12 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 leading-tight animate-fade-in-up">
              Sustainability <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent animate-gradient">Dashboard</span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up stagger-2">
              Showcasing University of Melbourne's commitment to sustainability across teaching, operations, and community engagement. Track progress towards <span className="font-semibold text-blue-700">Sustainability Plan 2030</span> targets.
              </p>
          </div>
        </div>
      </section>

      <main className="w-full">
        {appDashboardData.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          const sectionId = category.id === 'teaching-research' ? 'teaching' : category.id === 'operations' ? 'operations' : 'sustainability';
          return (
            <section 
              id={sectionId}
              key={category.id} 
              className="mb-0 py-14 md:py-20 w-full bg-gradient-to-r from-blue-50/60 to-white/80 relative overflow-hidden animate-fade-in-up" 
              style={{ animationDelay: `${categoryIndex * 0.15}s` }}
            >
              {/* Animated gradient background decoration */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow" />
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl animate-floating" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="mb-8 md:mb-10 p-6 md:p-8 bg-white/70 glass rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600 transform hover:-translate-y-1 animate-slide-in-left" style={{ animationDelay: `${categoryIndex * 0.15 + 0.1}s` }}>
                  <div className="flex items-center mb-3">
                    {CategoryIcon && <CategoryIcon className="w-8 h-8 text-blue-600 mr-4 animate-floating" style={{ animationDelay: `${categoryIndex * 0.15 + 0.2}s` }} />}
                    <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text">
                      {category.title}
                    </h2>
                  </div>
                  {category.description && <p className="text-gray-700 text-base md:text-lg leading-relaxed ml-12 font-light">{category.description}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                  {category.metrics.map((metric, metricIndex) => (
                    <div key={metric.id} className="animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 0.15 + metricIndex * 0.08}s` }}>
                      <MetricCard
                        metric={metric}
                        onClick={() => handleMetricClick(metric)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <footer className="w-full mt-20 md:mt-24 py-12 md:py-16 border-t-2 border-blue-200/40 bg-gradient-to-b from-blue-50/40 to-white animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-sm text-gray-700 font-medium">
            Sustainability Dashboard &copy; 2025 - 2026 | <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">University of Melbourne</span>
          </p>
          <p className="text-xs text-gray-500 mt-3 font-light">Building a sustainable future through data-driven insights</p>
        </div>
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