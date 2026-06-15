import React, { useState } from 'react';

export default function Projects({
  projects,
  onSelectProject,
  onAddProject,
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Project Form State
  const [projectName, setProjectName] = useState('');
  const [projectClient, setProjectClient] = useState('');
  const [initialStatus, setInitialStatus] = useState('Active');
  const [priority, setPriority] = useState('Medium');
  const [targetCompletion, setTargetCompletion] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Filtering
  const filteredProjects = projects.filter((project) => {
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getPriorityStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'badge-high-priority';
      case 'medium': return 'badge-medium-priority';
      case 'low': return 'badge-low-priority';
      default: return 'badge-low-priority';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'badge-inprogress';
      case 'completed': return 'badge-completed';
      case 'on hold': return 'badge-todo';
      case 'at risk': return 'badge-atrisk';
      default: return 'badge-todo';
    }
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectName.trim() || !projectClient.trim() || !targetCompletion) {
      setError('Please fill out all required fields.');
      return;
    }

    const newProj = {
      id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      name: projectName,
      client: projectClient,
      status: initialStatus,
      priority: priority,
      dueDate: new Date(targetCompletion).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      progress: 0,
      risk: priority === 'High' ? 'High' : 'Low',
      description: description,
      members: [
        { name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
      ]
    };

    onAddProject(newProj);
    
    // Reset
    setProjectName('');
    setProjectClient('');
    setInitialStatus('Active');
    setPriority('Medium');
    setTargetCompletion('');
    setDescription('');
    setError('');
    setIsModalOpen(false);
  };

  // Stats
  const total = projects.length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const inProgress = projects.filter(p => p.status === 'Active').length;

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

      {/* Projects Grid */}
      <div style={styles.projectsGrid}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="premium-card"
            style={styles.projectCard}
            onClick={() => onSelectProject(project)}
          >
            <div style={styles.cardHeader}>
              <span className={`badge ${getStatusBadgeStyle(project.status)}`}>
                {project.status}
              </span>
              <button style={styles.moreBtn} onClick={(e) => { e.stopPropagation(); alert('Context menu.'); }}>
                •••
              </button>
            </div>

            <h3 style={styles.projectTitle}>{project.name}</h3>
            <div style={styles.clientName}>{project.client}</div>

            <div style={styles.progressSection}>
              <div style={styles.progressTextRow}>
                <span style={styles.progressPercent}>{project.progress}% Complete</span>
                <span className={`badge ${getPriorityStyle(project.priority)}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                  {project.priority} Priority
                </span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${project.progress}%` }} />
              </div>
            </div>

            <div style={styles.cardFooter}>
              <div style={styles.teamAvatars}>
                {project.members.map((member, i) => (
                  <img
                    key={i}
                    src={member.avatar}
                    alt={member.name}
                    title={member.name}
                    style={{
                      ...styles.memberAvatar,
                      marginLeft: i > 0 ? '-8px' : '0'
                    }}
                  />
                ))}
              </div>
              <div style={styles.dueDate}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {project.dueDate}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary Stats Box */}
      <div style={styles.statsPanel}>
        <div style={styles.statBox}>
          <div style={styles.statIcon}>📁</div>
          <div>
            <div style={styles.statTitle}>TOTAL PROJECTS</div>
            <div style={styles.statValue}>{total}</div>
          </div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statIcon}>✓</div>
          <div>
            <div style={styles.statTitle}>COMPLETED</div>
            <div style={styles.statValue}>{completed}</div>
          </div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statIcon}>⏱</div>
          <div>
            <div style={styles.statTitle}>IN PROGRESS</div>
            <div style={styles.statValue}>{inProgress}</div>
          </div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <div style={styles.statTitle}>TEAM ACTIVE</div>
            <div style={styles.statValue}>12 Members</div>
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

              <div className="form-group">
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

              <div className="split-row" style={styles.row}>
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
                <button type="submit" className="btn-gradient">
                  Initialize Project
                </button>
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
};
