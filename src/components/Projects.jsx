import React, { useState, useMemo } from 'react';
import { useProjects, useCreateProject, useUpdateProject, useProjectStats, useDeleteProject } from '../hooks/useProjects';
import { useCurrentUser } from '../hooks/useUser';

export default function Projects({
  activeWorkspaceId,
  onSelectProject,
  onAddProject, // kept as optional callback if parent needs notification
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create Project Form State
  const [projectName, setProjectName] = useState('');
  const [projectClient, setProjectClient] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [template, setTemplate] = useState('Scrum');
  const [privacy, setPrivacy] = useState('Public Workspace');
  const [initialStatus, setInitialStatus] = useState('Active');
  const [priority, setPriority] = useState('Medium');
  const [startDateInput, setStartDateInput] = useState('');
  const [targetCompletion, setTargetCompletion] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // ── API Hooks ──────────────────────────────
  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useProjects(activeWorkspaceId, {
    status: filterStatus !== 'All' ? filterStatus : undefined,
    search: searchQuery || undefined,
  });

  const { mutateAsync: createProject } = useCreateProject();
  const { mutateAsync: updateProject } = useUpdateProject();
  const { mutateAsync: deleteProject } = useDeleteProject();
  const { data: currentUser } = useCurrentUser();

  const {
    data: stats,
    isLoading: isStatsLoading,
  } = useProjectStats(activeWorkspaceId);

  // Client-side filtering for fields the API already filters,
  // but kept as a safety-net in case API returns unfiltered results
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
      const matchesSearch =
        !searchQuery ||
        (project.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [projects, filterStatus, searchQuery]);

  const getPriorityStyle = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'high': return 'badge-high-priority';
      case 'medium': return 'badge-medium-priority';
      case 'low': return 'badge-low-priority';
      default: return 'badge-low-priority';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active': return 'badge-inprogress';
      case 'completed': return 'badge-completed';
      case 'on hold': return 'badge-todo';
      case 'at risk': return 'badge-atrisk';
      default: return 'badge-todo';
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !startDateInput || !targetCompletion) {
      setError('Please fill out all required fields.');
      return;
    }
    if (!projectKey.trim() || projectKey.length < 2 || projectKey.length > 4) {
      setError('Project Key must be 2–4 uppercase letters (e.g. MKTG).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        userId: currentUser?._id || currentUser?.id,
        workspaceId: activeWorkspaceId,
        name: projectName,
        key: projectKey.toUpperCase(),
        projectType: template.toLowerCase(),           // "scrum" | "kanban"
        status: initialStatus,
        priority: priority,
        visibility: privacy === 'Public Workspace' ? 'Workspace' : 'Private',
        description: description || '',
        color: '#3B82F6',
        icon: 'folder',
        progress: 0,
        startDate: new Date(startDateInput).toISOString(),
        dueDate: new Date(targetCompletion).toISOString(),
        tags: [],
        techStack: [],
        repository: {},
        settings: {
          allowGuests: false,
          notifications: true,
        },
      };

      await createProject(payload);

      // Notify parent if callback exists
      if (onAddProject) onAddProject(payload);

      // Reset form
      setProjectName('');
      setProjectClient('');
      setProjectKey('');
      setTemplate('Scrum');
      setPrivacy('Public Workspace');
      setInitialStatus('Active');
      setPriority('Medium');
      setStartDateInput('');
      setTargetCompletion('');
      setDescription('');
      setError('');
      setIsModalOpen(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create project. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats — prefer API data, fallback to local count
  const total = stats?.totalProjects ?? projects.length;
  const completed = stats?.totalCompleted ?? projects.filter(p => p.status === 'Completed').length;
  const inProgress = projects.filter(p => p.status === 'Active').length;
  const activeMembers = stats?.totalActiveMembers ?? '—';

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Projects</h1>
          <p>Manage your workspace initiatives and monitor real-time team progress.</p>
        </div>
        <button className="btn-gradient" onClick={() => setIsModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Project
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar-responsive" style={styles.filterBar}>
        <div className="search-container-responsive" style={styles.searchContainer}>
          <svg style={styles.searchIcon} viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Find a project by name or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-focus"
            style={styles.filterSearchInput}
          />
        </div>
        
        {/* Status Filter Chips */}
        <div className="chips-row-responsive" style={styles.chipsRow}>
          {['All', 'Active', 'Completed', 'On Hold'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                ...styles.chipBtn,
                ...(filterStatus === status ? styles.chipBtnActive : {})
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isProjectsLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9AA6B2' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px', width: '32px', height: '32px', border: '3px solid #ECEEF4', borderTopColor: '#5B5FFB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Loading projects…
        </div>
      )}

      {/* Error State */}
      {isProjectsError && !isProjectsLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#C53030' }}>
          Failed to load projects. Please try again.
        </div>
      )}

      {/* Empty State */}
      {!isProjectsLoading && !isProjectsError && filteredProjects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9AA6B2' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📂</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#6C7A87', marginBottom: '4px' }}>No projects found</div>
          <div style={{ fontSize: '13px' }}>Create your first project to get started.</div>
        </div>
      )}

      {/* Projects Grid */}
      {!isProjectsLoading && filteredProjects.length > 0 && (
      <div style={styles.projectsGrid}>
        {filteredProjects.map((project) => {
          const projType = (project.projectType || project.methodology || 'kanban').toLowerCase();
          const formattedDueDate = project.dueDate
            ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '—';
          const members = Array.isArray(project.members) ? project.members : [];

          return (
          <div
            key={project.id || project._id}
            className="premium-card"
            style={styles.projectCard}
            onClick={() => onSelectProject(project)}
          >
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className={`badge ${getStatusBadgeStyle(project.status)}`}>
                  {project.status}
                </span>
                <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', backgroundColor: projType === 'scrum' ? '#EDE9FE' : '#E0F2FE', color: projType === 'scrum' ? '#7C3AED' : '#0369A1' }}>
                  {projType === 'scrum' ? 'SCRUM' : 'KANBAN'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ ...styles.moreBtn, color: '#5B5FFB', fontSize: '11px', fontWeight: '600' }} onClick={(e) => { 
                  e.stopPropagation(); 
                  setEditingProject(project);
                  setProjectName(project.name);
                  setProjectKey(project.key || '');
                  setTemplate((project.projectType || 'Scrum').charAt(0).toUpperCase() + (project.projectType || 'Scrum').slice(1));
                  setInitialStatus(project.status || 'Active');
                  setPriority(project.priority || 'Medium');
                  setStartDateInput(project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '');
                  setTargetCompletion(project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '');
                  setDescription(project.description || '');
                  setIsEditModalOpen(true);
                }}>Edit</button>
                <button style={{ ...styles.moreBtn, color: '#EF4444', fontSize: '11px', fontWeight: '600' }} onClick={async (e) => { 
                  e.stopPropagation(); 
                  if (window.confirm('Are you sure you want to delete this project?')) {
                    await deleteProject(project.id || project._id);
                  }
                }}>Delete</button>
              </div>
            </div>

            <h3 style={styles.projectTitle}>{project.name}</h3>
            <div style={styles.clientName}>{project.description || project.client || ''}</div>

            <div style={styles.progressSection}>
              <div style={styles.progressTextRow}>
                <span style={styles.progressPercent}>{project.progress ?? 0}% Complete</span>
                <span className={`badge ${getPriorityStyle(project.priority)}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                  {project.priority} Priority
                </span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${project.progress ?? 0}%` }} />
              </div>
            </div>

            <div style={styles.cardFooter}>
              <div style={styles.teamAvatars}>
                {members.map((member, i) => {
                  const memberData = member.userId || member;
                  const avatar = memberData.avatar || memberData.name?.charAt(0) || '?';
                  const name = memberData.name || memberData.email || 'Member';
                  // If avatar is a URL, render img; otherwise render initial
                  return avatar.startsWith('http') ? (
                    <img
                      key={i}
                      src={avatar}
                      alt={name}
                      title={name}
                      style={{
                        ...styles.memberAvatar,
                        marginLeft: i > 0 ? '-8px' : '0'
                      }}
                    />
                  ) : (
                    <div
                      key={i}
                      title={name}
                      style={{
                        ...styles.memberAvatar,
                        marginLeft: i > 0 ? '-8px' : '0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#5B5FFB', color: '#fff', fontSize: '11px', fontWeight: '700',
                      }}
                    >
                      {avatar}
                    </div>
                  );
                })}
              </div>
              <div style={styles.dueDate}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formattedDueDate}
              </div>
            </div>
          </div>
          );
        })}
      </div>
      )}

      {/* Bottom Summary Stats Box */}
      <div style={styles.statsPanel}>
        <div style={styles.statBox}>
          <div style={styles.statIcon}></div>
          <div>
            <div style={styles.statTitle}>TOTAL PROJECTS</div>
            <div style={styles.statValue}>{total}</div>
          </div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statIcon}></div>
          <div>
            <div style={styles.statTitle}>COMPLETED</div>
            <div style={styles.statValue}>{completed}</div>
          </div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statIcon}></div>
          <div>
            <div style={styles.statTitle}>IN PROGRESS</div>
            <div style={styles.statValue}>{inProgress}</div>
          </div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statIcon}></div>
          <div>
            <div style={styles.statTitle}>TEAM ACTIVE</div>
            <div style={styles.statValue}>{activeMembers} Members</div>
          </div>
        </div>
      </div>

      {/* Launch New Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Launch New Project</h2>
              <p style={styles.modalSubtitle}>Define the scope, goals, and initial metadata for your new initiative.</p>
              <button style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateProject} style={styles.modalForm}>
              {error && <div style={styles.errorText}>{error}</div>}

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Project Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Enterprise Site Migration"
                    className="form-input"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: '0 0 110px' }}>
                  <label className="form-label">Project Key *</label>
                  <input
                    type="text"
                    placeholder="MKTG"
                    className="form-input"
                    maxLength={4}
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                    required
                    style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '700' }}
                  />
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Client/Department *</label>
                  <input
                    type="text"
                    placeholder="e.g. Vogue Retail"
                    className="form-input"
                    value={projectClient}
                    onChange={(e) => setProjectClient(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Initial Status</label>
                  <select
                    className="form-input"
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Template & Privacy row */}
              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Template *</label>
                  <select
                    className="form-input"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    <option value="Scrum">Scrum — Sprint-based delivery</option>
                    <option value="Kanban">Kanban — Continuous flow board</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Privacy *</label>
                  <div style={styles.privacyToggle}>
                    {['Public Workspace', 'Private Project'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPrivacy(opt)}
                        style={{
                          ...styles.privacyOption,
                          ...(privacy === opt ? styles.privacyOptionActive : {})
                        }}
                      >
                        {opt === 'Public Workspace' ? '' : ''} {opt === 'Public Workspace' ? 'Public' : 'Private'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Target Completion *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={targetCompletion}
                    onChange={(e) => setTargetCompletion(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}></div>
              </div>

              <div className="form-group">
                <label className="form-label">Mission Statement / Description</label>
                <textarea
                  placeholder="Describe the high-level goals and expected outcomes..."
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={styles.tipBox}>
                <div style={styles.tipHeader}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B5FFB" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Tip
                </div>
                <div style={styles.tipBody}>
                  You can assign team members and create milestones immediately after the project is created in the Project Detail view.
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.discardBtn}>
                  Discard
                </button>
                <button type="submit" className="btn-gradient" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.6 : 1 }}>
                  {isSubmitting ? 'Creating…' : 'Initialize Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Project</h2>
              <button style={styles.modalCloseBtn} onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateProject({
                  projectId: editingProject.id || editingProject._id,
                  updates: {
                    name: projectName,
                    key: projectKey,
                    projectType: template.toLowerCase(),
                    status: initialStatus,
                    priority,
                    description,
                    startDate: startDateInput ? new Date(startDateInput).toISOString() : undefined,
                    dueDate: targetCompletion ? new Date(targetCompletion).toISOString() : undefined,
                  }
                });
                setIsEditModalOpen(false);
              } catch (err) {
                setError('Failed to update project');
              }
            }} style={styles.modalForm}>
              {error && <div style={styles.errorText}>{error}</div>}

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Project Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: '0 0 110px' }}>
                  <label className="form-label">Project Key *</label>
                  <input
                    type="text"
                    className="form-input"
                    maxLength={4}
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                    required
                  />
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Methodology</label>
                  <select className="form-input" value={template} onChange={(e) => setTemplate(e.target.value)}>
                    <option>Scrum</option>
                    <option>Kanban</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={initialStatus} onChange={(e) => setInitialStatus(e.target.value)}>
                    <option>Active</option>
                    <option>On Hold</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Target Completion</label>
                  <input
                    type="date"
                    className="form-input"
                    value={targetCompletion}
                    onChange={(e) => setTargetCompletion(e.target.value)}
                  />
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority</label>
                  <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}></div>
              </div>

              <div className="form-group">
                <label className="form-label">Project Brief / Description</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={styles.discardBtn}>Cancel</button>
                <button type="submit" className="btn-gradient">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '28px',
  },
  searchContainer: {
    position: 'relative',
    width: '320px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#9AA6B2',
    pointerEvents: 'none',
  },
  filterSearchInput: {
    width: '100%',
    padding: '8px 12px 8px 36px',
    borderRadius: '8px',
    border: '1px solid #ECEEF4',
    fontSize: '13px',
    color: '#1A1D20',
    backgroundColor: '#FAFCFF',
    outline: 'none',
  },
  chipsRow: {
    display: 'flex',
    gap: '8px',
  },
  chipBtn: {
    background: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6C7A87',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  chipBtnActive: {
    backgroundColor: '#F0F2FF',
    borderColor: '#5B5FFB',
    color: '#5B5FFB',
    fontWeight: '600',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  projectCard: {
    padding: '24px',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  moreBtn: {
    background: 'none',
    border: 'none',
    color: '#9AA6B2',
    cursor: 'pointer',
    fontSize: '13px',
  },
  projectTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '4px',
  },
  clientName: {
    fontSize: '13px',
    color: '#6C7A87',
    marginBottom: '20px',
  },
  progressSection: {
    marginBottom: '20px',
  },
  progressTextRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1A1D20',
    marginBottom: '8px',
  },
  progressPercent: {
    fontWeight: '600',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5B5FFB',
    borderRadius: '3px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #ECEEF4',
  },
  teamAvatars: {
    display: 'flex',
    alignItems: 'center',
  },
  memberAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1.5px solid #FFFFFF',
  },
  dueDate: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: '#6C7A87',
    fontWeight: '500',
  },
  statsPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '16px',
    padding: '24px',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    fontSize: '24px',
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: '#F8F9FD',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1A1D20',
  },
  modalContent: {
    maxWidth: '560px',
  },
  modalHeader: {
    padding: '32px 32px 16px 32px',
    borderBottom: '1px solid #ECEEF4',
    position: 'relative',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '6px',
  },
  modalSubtitle: {
    fontSize: '13px',
    color: '#6C7A87',
    lineHeight: '1.4',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#9AA6B2',
    cursor: 'pointer',
    lineHeight: 1,
  },
  modalForm: {
    padding: '24px 32px 32px 32px',
  },
  errorText: {
    backgroundColor: '#FFE5E5',
    color: '#C53030',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '16px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  tipBox: {
    backgroundColor: '#F8F9FD',
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '24px',
  },
  tipHeader: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#5B5FFB',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
  },
  tipBody: {
    fontSize: '11.5px',
    color: '#6C7A87',
    lineHeight: '1.4',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px',
  },
  discardBtn: {
    background: 'none',
    border: 'none',
    color: '#6C7A87',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px',
  },
  privacyToggle: {
    display: 'flex',
    gap: '0',
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '40px',
  },
  privacyOption: {
    flex: 1,
    border: 'none',
    background: '#FAFCFF',
    color: '#6C7A87',
    fontSize: '12.5px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    borderRight: '1px solid #ECEEF4',
  },
  privacyOptionActive: {
    background: '#F0F2FF',
    color: '#5B5FFB',
    fontWeight: '700',
  },
};
