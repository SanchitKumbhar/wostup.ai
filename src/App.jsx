import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

import Landing from './components/Landing';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import ProjectOverview from './components/ProjectOverview';
import Tasks from './components/Tasks';
import EpicsAndSprints from './components/EpicsAndSprints';
import Milestones from './components/Milestones';
import TeamLoad from './components/TeamLoad';
import TaskHealth from './components/TaskHealth';
import Settings from './components/Settings';
import WorkspaceSelector from './components/WorkspaceSelector';
import AIAssistant from './components/AIAssistant';
import GithubIntegration from './components/Github/GithubIntegration';
import ProtectedRoute from './components/ProtectedRoute';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ProfileSetup from './components/ProfileSetup';
import OnboardingWorkspace from './components/OnboardingWorkspace';
import { useWorkspaces, useCreateWorkspace } from './hooks/useWorkspaces';
import { useProjects } from './hooks/useProjects';
import { useWorkspaceSocket } from './hooks/useWorkspaceSocket';
import { useCurrentUser } from './hooks/useUser';

export default function App() {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  // Normalize user object for existing components
  const user = clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || 'User',
    avatar: clerkUser.imageUrl,
    email: clerkUser.primaryEmailAddress?.emailAddress
  } : null;

  // Workspace States
  const { data: workspaces = [], isLoading: isWorkspacesLoading } = useWorkspaces();
  const { mutateAsync: createWorkspace } = useCreateWorkspace();
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
    return localStorage.getItem('wostup_activeWorkspaceId') || null;
  });
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Compulsory workspace check
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const isWorkspaceRequired = user && !isWorkspacesLoading && workspaces.length === 0 && !isOnboarding;
  const showWorkspaceModal = isWorkspaceModalOpen || isWorkspaceRequired;

  // Navigation States
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Removed isNewUser and showLanding since Clerk handles auth flow
  // You can still add onboarding logic based on user metadata if needed.

  // Projects State
  const { data: apiProjects = [], isLoading: isProjectsLoading } = useProjects(activeWorkspaceId);
  const projects = apiProjects;

  // Fetch internal MongoDB user
  const { data: currentUser } = useCurrentUser();
  const mongoUserId = currentUser?._id || currentUser?.id;

  // Real-time Socket Connection
  const { 
    notifications, 
    markAsRead, 
    onlineCount,
    detectorAlerts
  } = useWorkspaceSocket(activeWorkspaceId, mongoUserId);


  // AI Insights State
  const [aiRecommendations, setAiRecommendations] = useState([
    { id: 'rec-1', severity: 'high', category: 'DEADLINE RISK', text: 'Milestone Alpha (Scalability Stress Test) may miss its deadline due to Sarah Chen overloading.' },
    { id: 'rec-2', severity: 'high', category: 'RESOURCE CONFLICT', text: 'Sarah Chen is overloaded by 35% in active sprints.' },
    { id: 'rec-3', severity: 'medium', category: 'INACTIVITY ALERT', text: 'Task "API Integration: Workspace Sync" has been inactive for 4 days.' }
  ]);

  const [recentUpdates, setRecentUpdates] = useState([
    { id: 1, user: 'Sarah Chen', action: 'completed milestone', target: 'UI Refactor v2', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', time: '12m ago' },
    { id: 2, user: 'Marcus Rodriguez', action: 'opened issue', target: 'API Authentication Latency', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', time: '45m ago' },
    { id: 3, user: 'Alex Kim', action: 'updated timeline', target: 'Mobile App Launch', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', time: '2h ago' },
    { id: 4, user: 'Emily Watson', action: 'resolved task', target: 'Payment Gateway Bug', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', time: '4h ago' }
  ]);

  const teamMembers = [
    { id: 1, name: 'Sarah Chen', load: 85, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { id: 2, name: 'Marcus Rodriguez', load: 45, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    { id: 3, name: 'David Smith', load: 92, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
  ];

  // Callbacks
  const handleWorkspaceSelect = (wsId) => {
    setActiveWorkspaceId(wsId);
    localStorage.setItem('wostup_activeWorkspaceId', wsId);
  };

  const handleGenerateWorkspace = async (newWorkspace) => {
    try {
      const created = await createWorkspace({
        name: newWorkspace.name,
        description: '', // default
        settings: { themeColor: newWorkspace.color }
      });
      setActiveWorkspaceId(created.id);
      localStorage.setItem('wostup_activeWorkspaceId', created.id);
    } catch (err) {
      console.error("Failed to create workspace:", err);
    }
  };

  const handleAddProject = (newProj) => {
    // Rely on API refetch, or we could handle it via react-query cache in useProjects
  };





  const handleAddComment = (projectId, comment) => {
    setRecentUpdates(prev => [
      { id: Date.now(), user: comment.author, action: 'posted comment on task in', target: 'Project Board', avatar: comment.avatar, time: 'Just now' },
      ...prev
    ]);
  };



  const handleSelectProject = (project) => {
    setSelectedProject(project);
    navigate('/project-overview');
  };

  const handleOptimizeLoad = () => {
    setAiRecommendations(prev => prev.filter(rec => rec.id !== 'rec-1' && rec.id !== 'rec-2'));
  };

  const handleNavigate = (screen) => {
    navigate(`/${screen}`);
  };

  // Derive current screen for sidebar active states based on path
  const currentScreen = location.pathname.substring(1) || 'dashboard';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing onLogin={(path) => navigate(path)} />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      {/* Protected Layout & Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dedicated Onboarding Layout (no sidebar/topbar) */}
        <Route path="/onboarding/profile" element={<ProfileSetup />} />
        <Route path="/onboarding/workspace" element={<OnboardingWorkspace onGenerate={handleGenerateWorkspace} />} />

        <Route element={
          <div className="app-container">
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              currentScreen={currentScreen}
              onNavigate={(screen) => {
                navigate(`/${screen}`);
                setSelectedProject(null);
                setIsSidebarOpen(false);
              }}
              onLogout={() => signOut(() => navigate('/'))}
            />

            <div className="main-content app-main-content">
              <TopBar
                user={user}
                workspaces={workspaces}
                activeWorkspaceId={activeWorkspaceId}
                onWorkspaceSelect={handleWorkspaceSelect}
                onOpenNewWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
                notificationCount={notifications.filter(n => !n.read).length}
                notifications={notifications}
                onMarkNotificationAsRead={markAsRead}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onNavigateToSettings={() => navigate('/settings')}
                onlineCount={onlineCount}
              />
              
              <Outlet />
            </div>

            <WorkspaceSelector
              isOpen={showWorkspaceModal}
              onClose={() => setIsWorkspaceModalOpen(false)}
              onGenerate={handleGenerateWorkspace}
              isCompulsory={isWorkspaceRequired}
            />
          </div>
        }>
          <Route path="/dashboard" element={
            <Dashboard
              user={user}
              projects={projects}
              tasks={[]}
              onNavigate={handleNavigate}
              onOpenNewProjectModal={() => navigate('/projects')}
              aiRecommendations={aiRecommendations}
              recentUpdates={recentUpdates}
              teamMembers={teamMembers}
            />
          } />
          
          <Route path="/project-overview" element={
            selectedProject ? (
              <ProjectOverview
                project={selectedProject}
                onBack={() => {
                  setSelectedProject(null);
                  navigate('/projects');
                }}
                onAddComment={handleAddComment}
                onNavigate={handleNavigate}
              />
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6C7A87' }}>No project selected.</div>
            )
          } />

          <Route path="/projects" element={
            <Projects
              activeWorkspaceId={activeWorkspaceId}
              onSelectProject={handleSelectProject}
              onAddProject={handleAddProject}
            />
          } />

          <Route path="/tasks" element={
            <Tasks
              projects={projects}
              isMyTasksView={false}
              onUpdateProject={(projectId, updates) => {
                // Rely on API refetch
              }}
            />
          } />

          <Route path="/epics-sprints" element={
            <EpicsAndSprints
              projects={projects}
            />
          } />

          <Route path="/my-tasks" element={
            <Tasks
              projects={projects}
              isMyTasksView={true}
              onUpdateProject={(projectId, updates) => {
                // Rely on API refetch
              }}
            />
          } />

          <Route path="/milestones" element={
            <Milestones
              projects={projects}
            />
          } />

          <Route path="/team-load" element={
            <TeamLoad
              teamMembers={teamMembers}
              onAdjustCapacity={handleOptimizeLoad}
              workspaceId={activeWorkspaceId}
            />
          } />

          <Route path="/task-health" element={
            <TaskHealth
              tasks={[]}
              projects={projects}
              onOptimizeLoad={handleOptimizeLoad}
            />
          } />

          <Route path="/settings" element={
            <Settings
              user={user}
              activeWorkspaceId={activeWorkspaceId}
              onUpdateUser={() => {}} // Remove manual user updates as Clerk handles this
            />
          } />

          <Route path="/github" element={<GithubIntegration />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Route>
      </Route>
    </Routes>
  );
}
