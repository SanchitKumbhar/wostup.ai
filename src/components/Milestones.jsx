import React, { useState } from 'react';

export default function Milestones({
  milestones,
  projects,
  onAddMilestone,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState('Phase 1');
  const [dueDate, setDueDate] = useState('');
  const [owner, setOwner] = useState('Sarah Chen');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  const handleCreateMilestone = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      setError('Please fill out all required fields.');
      return;
    }

    const newMil = {
      id: `M-${Date.now()}`,
      projectId: selectedProjectId,
      title: title,
      phase: phase,
      dueDate: new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      owner: owner,
      description: desc,
      progress: 0,
      status: 'Upcoming'
    };

    onAddMilestone(newMil);
    setIsModalOpen(false);

    // Reset
    setTitle('');
    setDueDate('');
    setDesc('');
    setError('');
  };

  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'badge-completed';
      case 'at risk': return 'badge-atrisk';
      default: return 'badge-todo';
    }
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Strategic Milestones</h1>
          <p>Timeline-based milestone tracking across all active workspace initiatives.</p>
        </div>
        <button className="btn-gradient" onClick={() => setIsModalOpen(true)}>
          + Add Milestone
        </button>
      </div>

      {/* Overview stats cards */}
      <div style={styles.statsRow}>
        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statTitle}>TOTAL MILESTONES</div>
          <div style={styles.statVal}>{milestones.length}</div>
        </div>
        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statTitle}>COMPLETED</div>
          <div style={{ ...styles.statVal, color: '#10B981' }}>
            {milestones.filter(m => m.status === 'Completed').length}
          </div>
        </div>
        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statTitle}>AT RISK</div>
          <div style={{ ...styles.statVal, color: '#EF4444' }}>
            {milestones.filter(m => m.status === 'At Risk').length}
          </div>
        </div>
      </div>

      {/* Strategic Timeline View */}
      <div className="premium-card" style={styles.timelineContainer}>
        <h3 style={styles.timelineTitle}>Global Project Timeline</h3>
        <div style={styles.timelineList}>
          {milestones.map((ms, idx) => {
            const proj = projects.find(p => p.id === ms.projectId);
            return (
              <div key={ms.id} style={styles.timelineItem}>
                <div style={styles.timelineLeft}>
                  <div style={styles.timelineDot} />
                  {idx < milestones.length - 1 && <div style={styles.timelineLine} />}
                </div>
                <div style={styles.timelineRight}>
                  <div style={styles.cardHeader}>
                    <div style={styles.projectContext}>{proj ? proj.name : 'Unknown Project'}</div>
                    <span className={`badge ${getStatusBadgeStyle(ms.status)}`}>
                      {ms.status}
                    </span>
                  </div>
                  <h4 style={styles.milestoneTitleText}>{ms.title}</h4>
                  <p style={styles.milestoneDescText}>{ms.description}</p>
                  
                  <div style={styles.milestoneFooter}>
                    <div><strong>Phase:</strong> {ms.phase}</div>
                    <div><strong>Lead:</strong> {ms.owner}</div>
                    <div><strong>Due Date:</strong> {ms.dueDate}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Onboarding */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New Milestone</h2>
              <p style={styles.modalSubtitle}>Define a strategic goal for the project. Linked tasks will update progress.</p>
              <button style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateMilestone} style={styles.modalForm}>
              {error && <div style={styles.errorText}>{error}</div>}

              <div className="form-group">
                <label className="form-label">Milestone Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 User Acceptance Testing"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project *</label>
                <select
                  className="form-input"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  required
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Project Phase</label>
                  <select
                    className="form-input"
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                  >
                    <option value="Phase 1">Phase 1: Discovery</option>
                    <option value="Phase 2">Phase 2: Development</option>
                    <option value="Phase 3">Phase 3: Deployment</option>
                    <option value="Phase 4">Phase 4: Optimization</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Lead Owner</label>
                  <select
                    className="form-input"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                  >
                    <option value="Sarah Chen">Sarah Chen</option>
                    <option value="Alex Rivers">Alex Rivers</option>
                    <option value="Jordan Smith">Jordan Smith</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="What objective does this milestone accomplish?"
                  className="form-input"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.discardBtn}>
                  Cancel
                </button>
                <button type="submit" className="btn-gradient">
                  Create Milestone
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
  statsRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '28px',
  },
  statCard: {
    flex: 1,
    padding: '20px',
  },
  statTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
    marginBottom: '6px',
  },
  statVal: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1A1D20',
  },
  timelineContainer: {
    padding: '24px',
  },
  timelineTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A1D20',
    marginBottom: '24px',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  timelineItem: {
    display: 'flex',
    gap: '24px',
    marginBottom: '28px',
    position: 'relative',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  timelineLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  timelineDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#5B5FFB',
    zIndex: 2,
    marginTop: '6px',
  },
  timelineLine: {
    width: '2px',
    backgroundColor: '#ECEEF4',
    flex: 1,
    position: 'absolute',
    top: '16px',
    bottom: '-24px',
    left: '4px',
    zIndex: 1,
  },
  timelineRight: {
    flex: 1,
    border: '1px solid #ECEEF4',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#FAFCFF',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  projectContext: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#9AA6B2',
    textTransform: 'uppercase',
  },
  milestoneTitleText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '6px',
  },
  milestoneDescText: {
    fontSize: '13px',
    color: '#6C7A87',
    lineHeight: '1.4',
    marginBottom: '12px',
  },
  milestoneFooter: {
    display: 'flex',
    gap: '24px',
    fontSize: '11.5px',
    color: '#9AA6B2',
    borderTop: '1px solid #ECEEF4',
    paddingTop: '10px',
  },
  modalContent: {
    maxWidth: '460px',
  },
  modalHeader: {
    padding: '24px 24px 12px 24px',
    borderBottom: '1px solid #ECEEF4',
    position: 'relative',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1D20',
  },
  modalSubtitle: {
    fontSize: '12px',
    color: '#6C7A87',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#9AA6B2',
    cursor: 'pointer',
  },
  modalForm: {
    padding: '16px 24px 24px 24px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
  },
  discardBtn: {
    background: 'none',
    border: 'none',
    color: '#6C7A87',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
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
};
