import React, { useState } from 'react';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import ProjectOverview from './components/ProjectOverview';
import Tasks from './components/Tasks';
import Milestones from './components/Milestones';
import TeamLoad from './components/TeamLoad';
import TaskHealth from './components/TaskHealth';
import AIAssistant from './components/AIAssistant';
import AutonomousMonitoring from './components/AutonomousMonitoring';
import Settings from './components/Settings';
import WorkspaceSelector from './components/WorkspaceSelector';

export default function App() {
  // Authentication State
  const [user, setUser] = useState(null);

  // Workspace States
  const [workspaces, setWorkspaces] = useState([
    { id: 'ws-1', name: 'Engineering Workspace', color: '#5B5FFB', membersCount: 12 },
    { id: 'ws-2', name: 'Strategic Engineering', color: '#B24DFF', membersCount: 45 },
    { id: 'ws-3', name: 'Future Labs HQ', color: '#00C292', membersCount: 5 },
  ]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws-1');
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Navigation States
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Projects State
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
      description: 'Employee survey dashboards and automated review cycles.',
      members: [
        { name: 'Aisha Gupta', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
      ]
    }
  ]);

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 'TSK-001', projectId: 'PRJ-101', title: 'Finalize database schema migration scripts', assignee: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', status: 'In Progress', dueDate: 'Jun 20', priority: 'High', progress: 65, commentsCount: 4 },
    { id: 'TSK-002', projectId: 'PRJ-101', title: 'Security audit for API endpoints', assignee: 'Marcus Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', status: 'Review', dueDate: 'Jun 22', priority: 'Medium', progress: 90, commentsCount: 12 },
    { id: 'TSK-003', projectId: 'PRJ-101', title: 'Frontend integration for Dashboard v2', assignee: 'Elena Sokolov', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', status: 'Todo', dueDate: 'Jun 25', priority: 'High', progress: 0, commentsCount: 2 },
    { id: 'TSK-004', projectId: 'PRJ-101', title: 'Refactor legacy notification service', assignee: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', status: 'Completed', dueDate: 'Jun 15', priority: 'Low', progress: 100, commentsCount: 1 },
    { id: 'TSK-005', projectId: 'PRJ-101', title: 'Prepare Stakeholder Progress Report', assignee: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', status: 'Todo', dueDate: 'Jun 28', priority: 'Medium', progress: 10, commentsCount: 0 },
    { id: 'TSK-105', projectId: 'PRJ-102', title: 'Implement socket.io for Notifications', assignee: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', status: 'In Progress', dueDate: 'Nov 22', priority: 'Medium', progress: 40, commentsCount: 0 }
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
  const handleLoginSuccess = (sessionUser) => {
    setUser(sessionUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateUser = (updatedInfo) => {
    setUser(prev => ({ ...prev, ...updatedInfo }));
  };

  const handleWorkspaceSelect = (wsId) => {
    setActiveWorkspaceId(wsId);
  };

  const handleGenerateWorkspace = (newWorkspace) => {
    const wsId = `ws-${Date.now()}`;
    setWorkspaces(prev => [...prev, { id: wsId, ...newWorkspace }]);
    setActiveWorkspaceId(wsId);
  };

  const handleAddProject = (newProj) => {
    setProjects(prev => [newProj, ...prev]);
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => [...prev, newTask]);
    
    // Update project progress dynamically
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
    setCurrentScreen('project-overview');
  };

  const handleOptimizeLoad = () => {
    // Clear AI high overload warnings and rebalance
    setAiRecommendations(prev => prev.filter(rec => rec.id !== 'rec-1' && rec.id !== 'rec-2'));
  };

  // If not logged in, render login flow
  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar mobile overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          setSelectedProject(null);
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
      />

      {/* Main Workspace Frame */}
      <div className="main-content app-main-content">
        {/* Top Navbar */}
        <TopBar
          user={user}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onWorkspaceSelect={handleWorkspaceSelect}
          onOpenNewWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
          notificationCount={aiRecommendations.length}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Route Screen rendering */}
        {selectedProject && currentScreen === 'project-overview' ? (
          <ProjectOverview
            project={selectedProject}
            tasks={tasks}
            milestones={milestones}
            onBack={() => {
              setSelectedProject(null);
              setCurrentScreen('projects');
            }}
            onAddTask={handleAddTask}
            onAddMilestone={handleAddMilestone}
            onAddComment={handleAddComment}
            onNavigate={setCurrentScreen}
          />
        ) : (
          <>
            {currentScreen === 'dashboard' && (
              <Dashboard
                user={user}
                projects={projects}
                tasks={tasks}
                onNavigate={setCurrentScreen}
                onOpenNewProjectModal={() => setCurrentScreen('projects')}
                aiRecommendations={aiRecommendations}
                recentUpdates={recentUpdates}
                teamMembers={teamMembers}
              />
            )}
            {currentScreen === 'projects' && (
              <Projects
                projects={projects}
                tasks={tasks}
                onSelectProject={handleSelectProject}
                onNavigate={setCurrentScreen}
                onAddProject={handleAddProject}
              />
            )}
            {currentScreen === 'my-tasks' && (
              <Tasks
                tasks={tasks}
                projects={projects}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
              />
            )}
            {currentScreen === 'milestones' && (
              <Milestones
                milestones={milestones}
                projects={projects}
                onAddMilestone={handleAddMilestone}
              />
            )}
            {currentScreen === 'team-load' && (
              <TeamLoad
                teamMembers={teamMembers}
                onAdjustCapacity={handleOptimizeLoad}
              />
            )}
            {currentScreen === 'task-health' && (
              <TaskHealth
                tasks={tasks}
                projects={projects}
                onOptimizeLoad={handleOptimizeLoad}
              />
            )}
            {currentScreen === 'ai-assistant' && (
              <AIAssistant />
            )}
            {currentScreen === 'autonomous-monitoring' && (
              <AutonomousMonitoring />
            )}
            {currentScreen === 'settings' && (
              <Settings
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </>
        )}
      </div>

      {/* Onboarding workspace launch modal */}
      <WorkspaceSelector
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onGenerate={handleGenerateWorkspace}
      />
    </div>
  );
}
