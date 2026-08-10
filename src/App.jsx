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
import Milestones from './components/Milestones';
import TeamLoad from './components/TeamLoad';
import TaskHealth from './components/TaskHealth';
import Settings from './components/Settings';
import WorkspaceSelector from './components/WorkspaceSelector';
import AIAssistant from './components/AiAssistant';
import ProtectedRoute from './components/ProtectedRoute';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';

export default function App() {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  // Normalize user object for existing components
  const user = clerkUser ? {
    name: clerkUser.fullName || clerkUser.firstName || 'User',
    avatar: clerkUser.imageUrl,
    email: clerkUser.primaryEmailAddress?.emailAddress
  } : null;

  // Workspace States
  const [workspaces, setWorkspaces] = useState([
    { id: 'ws-1', name: 'Engineering Workspace', color: '#5B5FFB', membersCount: 12 },
    { id: 'ws-2', name: 'Strategic Engineering', color: '#B24DFF', membersCount: 45 },
    { id: 'ws-3', name: 'Future Labs HQ', color: '#00C292', membersCount: 5 },
  ]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws-1');
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Navigation States
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Removed isNewUser and showLanding since Clerk handles auth flow
  // You can still add onboarding logic based on user metadata if needed.

  // Projects State (methodology: 'scrum' | 'kanban')
  const [projects, setProjects] = useState([
    {
      id: 'PRJ-101',
      name: 'Skyline Cloud Migration',
      client: 'Stellar Dynamics Inc.',
      status: 'Active',
      progress: 74,
      priority: 'High',
      dueDate: 'Nov 24, 2026',
      risk: 'High',
      methodology: 'scrum',
      template: 'Scrum',
      description: 'Comprehensive migration of legacy on-premise infrastructure to AWS cloud architecture. Includes database refactoring and microservices deployment.',
      members: [
        { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
        { name: 'Marcus Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
      ]
    },
    {
      id: 'PRJ-102',
      name: 'E-Commerce Redesign',
      client: 'Vogue Retail Group',
      status: 'Active',
      progress: 32,
      priority: 'Medium',
      dueDate: 'Dec 12, 2026',
      risk: 'Low',
      methodology: 'kanban',
      template: 'Kanban',
      description: "Revamp Vogue Retail's web store frontend and cart checkout integrations with clean glassmorphic guidelines.",
      members: [
        { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
        { name: 'Elena Sokolov', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' }
      ]
    },
    {
      id: 'PRJ-103',
      name: 'AI Analytics Engine',
      client: 'Neural Systems Ltd',
      status: 'Completed',
      progress: 100,
      priority: 'High',
      dueDate: 'Oct 30, 2026',
      risk: 'Low',
      methodology: 'scrum',
      template: 'Scrum',
      description: 'Integration of custom ML classifiers into the neural systems analytics engine reports.',
      members: [
        { name: 'Marcus Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
      ]
    },
    {
      id: 'PRJ-104',
      name: 'Fintech Mobile App',
      client: 'Global Bank Corp',
      status: 'On Hold',
      progress: 15,
      priority: 'Low',
      dueDate: 'Jan 15, 2027',
      risk: 'Low',
      methodology: 'kanban',
      template: 'Kanban',
      description: 'React Native wrapper for retail bank card limits and security settings.',
      members: [
        { name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
      ]
    },
    {
      id: 'PRJ-105',
      name: 'Supply Chain Tracker',
      client: 'Logistics Pro',
      status: 'Active',
      progress: 58,
      priority: 'Medium',
      dueDate: 'Dec 05, 2026',
      risk: 'Low',
      methodology: 'scrum',
      template: 'Scrum',
      description: 'Hyperledger blockchain tracker dashboard to audit load items.',
      members: [
        { name: 'Elena Sokolov', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' }
      ]
    },
    {
      id: 'PRJ-106',
      name: 'Internal HR Portal',
      client: 'Wostup Internal',
      status: 'Active',
      progress: 92,
      priority: 'Low',
      dueDate: 'Nov 18, 2026',
      risk: 'Low',
      methodology: 'kanban',
      template: 'Kanban',
      description: 'Employee survey dashboards and automated review cycles.',
      members: [
        { name: 'Aisha Gupta', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
      ]
    }
  ]);

  // Epics State
  const [epics, setEpics] = useState([
    { id: 'EP-1', name: 'Mobile Redesign',     color: '#7C3AED', projectId: 'PRJ-101' },
    { id: 'EP-2', name: 'API Modernization',   color: '#0891B2', projectId: 'PRJ-101' },
    { id: 'EP-3', name: 'Auth Overhaul',       color: '#059669', projectId: 'PRJ-101' },
    { id: 'EP-4', name: 'Checkout UX',         color: '#D97706', projectId: 'PRJ-102' },
    { id: 'EP-5', name: 'Search & Discovery',  color: '#DB2777', projectId: 'PRJ-102' },
  ]);

  // Tasks State (extended with storyPoints, epic, isBacklog)
  const [tasks, setTasks] = useState([
    { id: 'TSK-001', projectId: 'PRJ-101', title: 'Finalize database schema migration scripts', assignee: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', status: 'In Progress', dueDate: 'Jun 20', priority: 'High', progress: 65, commentsCount: 4, storyPoints: 8, epic: 'EP-2', isBacklog: false },
    { id: 'TSK-002', projectId: 'PRJ-101', title: 'Security audit for API endpoints', assignee: 'Marcus Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', status: 'Review', dueDate: 'Jun 22', priority: 'Medium', progress: 90, commentsCount: 12, storyPoints: 5, epic: 'EP-3', isBacklog: false },
    { id: 'TSK-003', projectId: 'PRJ-101', title: 'Frontend integration for Dashboard v2', assignee: 'Elena Sokolov', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', status: 'Todo', dueDate: 'Jun 25', priority: 'High', progress: 0, commentsCount: 2, storyPoints: 13, epic: 'EP-1', isBacklog: false },
    { id: 'TSK-004', projectId: 'PRJ-101', title: 'Refactor legacy notification service', assignee: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', status: 'Completed', dueDate: 'Jun 15', priority: 'Low', progress: 100, commentsCount: 1, storyPoints: 3, epic: null, isBacklog: false },
    { id: 'TSK-005', projectId: 'PRJ-101', title: 'Prepare Stakeholder Progress Report', assignee: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', status: 'Todo', dueDate: 'Jun 28', priority: 'Medium', progress: 10, commentsCount: 0, storyPoints: 2, epic: 'EP-2', isBacklog: false },
    { id: 'TSK-006', projectId: 'PRJ-101', title: 'Design new onboarding flow screens', assignee: 'Elena Sokolov', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', status: 'Todo', dueDate: 'Jul 05', priority: 'Medium', progress: 0, commentsCount: 0, storyPoints: 5, epic: 'EP-1', isBacklog: true },
    { id: 'TSK-007', projectId: 'PRJ-101', title: 'Write API documentation for v3 endpoints', assignee: 'Marcus Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', status: 'Todo', dueDate: 'Jul 10', priority: 'Low', progress: 0, commentsCount: 0, storyPoints: 3, epic: 'EP-2', isBacklog: true },
    { id: 'TSK-008', projectId: 'PRJ-101', title: 'Implement rate limiting on public APIs', assignee: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', status: 'Todo', dueDate: 'Jul 12', priority: 'High', progress: 0, commentsCount: 0, storyPoints: 8, epic: 'EP-3', isBacklog: true },
    { id: 'TSK-105', projectId: 'PRJ-102', title: 'Implement socket.io for Notifications', assignee: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', status: 'In Progress', dueDate: 'Nov 22', priority: 'Medium', progress: 40, commentsCount: 0, storyPoints: 5, epic: 'EP-4', isBacklog: false },
    { id: 'TSK-106', projectId: 'PRJ-102', title: 'Redesign product listing cards', assignee: 'Elena Sokolov', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', status: 'In Progress', dueDate: 'Nov 25', priority: 'High', progress: 30, commentsCount: 3, storyPoints: 8, epic: 'EP-4', isBacklog: false },
    { id: 'TSK-107', projectId: 'PRJ-102', title: 'Integrate Algolia for search suggestions', assignee: 'Marcus Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', status: 'Review', dueDate: 'Nov 28', priority: 'Medium', progress: 85, commentsCount: 7, storyPoints: 13, epic: 'EP-5', isBacklog: false },
    { id: 'TSK-108', projectId: 'PRJ-102', title: 'A/B test checkout button placement', assignee: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', status: 'Review', dueDate: 'Nov 30', priority: 'Low', progress: 70, commentsCount: 2, storyPoints: 3, epic: 'EP-4', isBacklog: false },
    { id: 'TSK-109', projectId: 'PRJ-102', title: 'Set up Storybook for component library', assignee: 'Elena Sokolov', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', status: 'In Progress', dueDate: 'Dec 01', priority: 'Medium', progress: 20, commentsCount: 1, storyPoints: 5, epic: 'EP-5', isBacklog: false },
  ]);

  // Milestones State
  const [milestones, setMilestones] = useState([
    { id: 'MS-1', projectId: 'PRJ-101', title: 'Foundation Architecture', phase: 'Phase 1: Discovery', dueDate: 'Oct 15, 2026', owner: 'Alex Rivera', description: 'Establish the core system architecture. Link tasks to database schema mapping.', progress: 100, status: 'Completed' },
    { id: 'MS-2', projectId: 'PRJ-101', title: 'Scalability Stress Test', phase: 'Phase 2: Development', dueDate: 'Nov 20, 2026', owner: 'David Kim', description: 'Perform concurrent user stress tests on socket events.', progress: 12, status: 'At Risk' },
    { id: 'MS-3', projectId: 'PRJ-101', title: 'Global Product Launch', phase: 'Phase 3: Deployment', dueDate: 'Dec 15, 2026', owner: 'Sarah Chen', description: 'Final release of the platform across API regions.', progress: 0, status: 'Upcoming' },
    { id: 'MS-4', projectId: 'PRJ-101', title: 'Post-Launch Audit', phase: 'Phase 4: Optimization', dueDate: 'Jan 10, 2027', owner: 'James Wilson', description: 'Review performance thresholds.', progress: 0, status: 'Upcoming' }
  ]);

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
  };

  const handleGenerateWorkspace = (newWorkspace) => {
    const wsId = `ws-${Date.now()}`;
    setWorkspaces(prev => [...prev, { id: wsId, ...newWorkspace }]);
    setActiveWorkspaceId(wsId);
  };

  const handleAddProject = (newProj) => {
    const methodology = (newProj.template || 'Scrum').toLowerCase();
    setProjects(prev => [{ ...newProj, methodology }, ...prev]);
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => [...prev, newTask]);
    setProjects(prevProjects => prevProjects.map(proj => {
      if (proj.id === newTask.projectId) {
        const projTasks = [...tasks.filter(t => t.projectId === proj.id), newTask];
        const completed = projTasks.filter(t => t.status === 'Completed' || t.status === 'Done').length;
        const progress = Math.round((completed / projTasks.length) * 100);
        return { ...proj, progress };
      }
      return proj;
    }));
  };

  const handleUpdateTask = (taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const handleMoveToBoard = (taskId) => {
    handleUpdateTask(taskId, { isBacklog: false, status: 'Todo' });
  };

  const handleCompleteSprint = (projectId) => {
    setTasks(prev => prev.map(t => {
      if (t.projectId !== projectId || t.isBacklog) return t;
      if (t.status === 'Completed') return t;
      return { ...t, isBacklog: true, status: 'Todo' };
    }));
  };

  const handleAddMilestone = (newMilestone) => {
    setMilestones(prev => [...prev, newMilestone]);
  };

  const handleAddComment = (projectId, comment) => {
    setRecentUpdates(prev => [
      { id: Date.now(), user: comment.author, action: 'posted comment on task in', target: 'Project Board', avatar: comment.avatar, time: 'Just now' },
      ...prev
    ]);
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, progress: newStatus === 'Completed' ? 100 : t.progress } : t));
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
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      {/* Protected Layout & Routes */}
      <Route element={<ProtectedRoute />}>
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
                notificationCount={aiRecommendations.length}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              />
              
              <Outlet />
            </div>

            <WorkspaceSelector
              isOpen={isWorkspaceModalOpen}
              onClose={() => setIsWorkspaceModalOpen(false)}
              onGenerate={handleGenerateWorkspace}
            />
          </div>
        }>
          <Route path="/dashboard" element={
            <Dashboard
              user={user}
              projects={projects}
              tasks={tasks}
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
                tasks={tasks}
                milestones={milestones}
                epics={epics}
                onBack={() => {
                  setSelectedProject(null);
                  navigate('/projects');
                }}
                onAddTask={handleAddTask}
                onAddMilestone={handleAddMilestone}
                onAddComment={handleAddComment}
                onNavigate={handleNavigate}
              />
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6C7A87' }}>No project selected.</div>
            )
          } />

          <Route path="/projects" element={
            <Projects
              projects={projects}
              tasks={tasks}
              onSelectProject={handleSelectProject}
              onNavigate={handleNavigate}
              onAddProject={handleAddProject}
            />
          } />

          <Route path="/tasks" element={
            <Tasks
              tasks={tasks}
              projects={projects}
              epics={epics}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateTask={handleUpdateTask}
              onMoveToBoard={handleMoveToBoard}
              onCompleteSprint={handleCompleteSprint}
              isMyTasksView={false}
              onUpdateProject={(projectId, updates) => {
                setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
              }}
            />
          } />

          <Route path="/my-tasks" element={
            <Tasks
              tasks={tasks}
              projects={projects}
              epics={epics}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateTask={handleUpdateTask}
              onMoveToBoard={handleMoveToBoard}
              onCompleteSprint={handleCompleteSprint}
              isMyTasksView={true}
              onUpdateProject={(projectId, updates) => {
                setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
              }}
            />
          } />

          <Route path="/milestones" element={
            <Milestones
              milestones={milestones}
              projects={projects}
              onAddMilestone={handleAddMilestone}
            />
          } />

          <Route path="/team-load" element={
            <TeamLoad
              teamMembers={teamMembers}
              onAdjustCapacity={handleOptimizeLoad}
            />
          } />

          <Route path="/task-health" element={
            <TaskHealth
              tasks={tasks}
              projects={projects}
              onOptimizeLoad={handleOptimizeLoad}
            />
          } />

          <Route path="/settings" element={
            <Settings
              user={user}
              onUpdateUser={() => {}} // Remove manual user updates as Clerk handles this
            />
          } />

          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Route>
      </Route>
    </Routes>
  );
}
