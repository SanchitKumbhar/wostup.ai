import React, { useState } from 'react';
import { useEpics, useCreateEpic } from '../hooks/useEpics';
import { useSprints, useCreateSprint } from '../hooks/useSprints';

export default function EpicsAndSprints({ projects }) {
  const [activeProjectId, setActiveProjectId] = useState(projects?.[0]?.id || projects?.[0]?._id || '');
  const [activeTab, setActiveTab] = useState('epics'); // 'epics' or 'sprints'
  
  // Modals
  const [isCreateEpicOpen, setIsCreateEpicOpen] = useState(false);
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState('To Do');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const { data: epics = [] } = useEpics(activeProjectId);
  const { data: sprints = [] } = useSprints(activeProjectId);
  const { mutateAsync: createEpic } = useCreateEpic();
  const { mutateAsync: createSprint } = useCreateSprint();

  const handleCreateEpic = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !activeProjectId) return;
    try {
      await createEpic({
        projectId: activeProjectId,
        name: newName,
        summary: newSummary,
        description: newDesc,
        status: newStatus,
        startDate: newStartDate ? new Date(newStartDate).toISOString() : new Date().toISOString(),
        dueDate: newEndDate ? new Date(newEndDate).toISOString() : null,
      });
      setIsCreateEpicOpen(false);
      resetForms();
    } catch (err) {
      console.error('Failed to create epic:', err);
    }
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !activeProjectId) return;
    try {
      await createSprint({
        projectId: activeProjectId,
        name: newName,
        goal: newGoal,
        startDate: newStartDate ? new Date(newStartDate).toISOString() : new Date().toISOString(),
        endDate: newEndDate ? new Date(newEndDate).toISOString() : new Date(Date.now() + 14*24*60*60*1000).toISOString(),
      });
      setIsCreateSprintOpen(false);
      resetForms();
    } catch (err) {
      console.error('Failed to create sprint:', err);
    }
  };

  const resetForms = () => {
    setNewName('');
    setNewSummary('');
    setNewDesc('');
    setNewStatus('To Do');
    setNewStartDate('');
    setNewEndDate('');
    setNewGoal('');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Epics & Sprints</h1>
          <p style={styles.subtitle}>Manage your project milestones and timeboxes</p>
        </div>
        
        <div style={styles.headerControls}>
          <select 
            style={styles.select} 
            value={activeProjectId} 
            onChange={(e) => setActiveProjectId(e.target.value)}
          >
            {projects?.length === 0 && <option value="">No projects available</option>}
            {projects?.map(p => (
              <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
            ))}
          </select>
          <button 
            style={styles.primaryBtn}
            onClick={() => activeTab === 'epics' ? setIsCreateEpicOpen(true) : setIsCreateSprintOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create {activeTab === 'epics' ? 'Epic' : 'Sprint'}
          </button>
        </div>
      </header>

      <div style={styles.tabs}>
        <button 
          style={{...styles.tabBtn, ...(activeTab === 'epics' ? styles.activeTabBtn : {})}}
          onClick={() => setActiveTab('epics')}
        >
          Epics
        </button>
        <button 
          style={{...styles.tabBtn, ...(activeTab === 'sprints' ? styles.activeTabBtn : {})}}
          onClick={() => setActiveTab('sprints')}
        >
          Sprints
        </button>
      </div>

      <div style={styles.gridContainer}>
          {activeTab === 'epics' ? (
            epics.length === 0 ? (
              <div style={styles.emptyState}>No Epics found for this project.</div>
            ) : (
              epics.map(epic => (
                <div 
                  key={epic.id || epic._id} 
                  style={styles.card}
                >
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{epic.name}</h3>
                    <span style={styles.statusBadge(epic.status)}>{epic.status || 'To Do'}</span>
                  </div>
                  <p style={styles.cardDesc}>{epic.summary || epic.description || 'No summary provided.'}</p>
                  
                  <div style={styles.cardMeta}>
                    <div style={styles.metaItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      {epic.startDate ? new Date(epic.startDate).toLocaleDateString() : 'No start date'}
                    </div>
                    {epic.dueDate && (
                      <div style={styles.metaItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        Due: {new Date(epic.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            sprints.length === 0 ? (
              <div style={styles.emptyState}>No Sprints found for this project.</div>
            ) : (
              sprints.map(sprint => (
                <div 
                  key={sprint.id || sprint._id} 
                  style={{...styles.card, borderTop: sprint.status === 'active' ? '4px solid #5B5FFB' : '1px solid rgba(0,0,0,0.08)'}}
                >
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{sprint.name}</h3>
                    {sprint.status === 'active' && <span style={styles.activeBadge}>Active</span>}
                  </div>
                  <p style={styles.cardDesc}>{sprint.goal || 'No goal provided.'}</p>
                  
                  <div style={styles.cardMeta}>
                    <div style={styles.metaItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )
          )}
      </div>

      {/* Create Epic Modal */}
        {isCreateEpicOpen && (
          <div style={styles.modalOverlay} onClick={() => setIsCreateEpicOpen(false)}>
            <div 
              style={styles.modalContent} 
              onClick={e => e.stopPropagation()}
            >
              <h2 style={styles.modalTitle}>Create New Epic</h2>
              <form onSubmit={handleCreateEpic} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Epic Name</label>
                  <input required style={styles.input} value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Q3 Marketing Launch" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Summary</label>
                  <input style={styles.input} value={newSummary} onChange={e => setNewSummary(e.target.value)} placeholder="Short summary" />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Start Date</label>
                    <input type="date" style={styles.input} value={newStartDate} onChange={e => setNewStartDate(e.target.value)} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Due Date</label>
                    <input type="date" style={styles.input} value={newEndDate} onChange={e => setNewEndDate(e.target.value)} />
                  </div>
                </div>
                <div style={styles.modalActions}>
                  <button type="button" style={styles.cancelBtn} onClick={() => setIsCreateEpicOpen(false)}>Cancel</button>
                  <button type="submit" style={styles.submitBtn}>Create Epic</button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Create Sprint Modal */}
        {isCreateSprintOpen && (
          <div style={styles.modalOverlay} onClick={() => setIsCreateSprintOpen(false)}>
            <div 
              style={styles.modalContent} 
              onClick={e => e.stopPropagation()}
            >
              <h2 style={styles.modalTitle}>Create New Sprint</h2>
              <form onSubmit={handleCreateSprint} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Sprint Name</label>
                  <input required style={styles.input} value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Sprint 42" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Sprint Goal</label>
                  <input style={styles.input} value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="Main objective for this sprint" />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Start Date</label>
                    <input required type="date" style={styles.input} value={newStartDate} onChange={e => setNewStartDate(e.target.value)} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>End Date</label>
                    <input required type="date" style={styles.input} value={newEndDate} onChange={e => setNewEndDate(e.target.value)} />
                  </div>
                </div>
                <div style={styles.modalActions}>
                  <button type="button" style={styles.cancelBtn} onClick={() => setIsCreateSprintOpen(false)}>Cancel</button>
                  <button type="submit" style={styles.submitBtn}>Create Sprint</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    height: '100%',
    overflowY: 'auto',
    backgroundColor: '#FAFBFC',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748B',
    margin: 0,
  },
  headerControls: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  select: {
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#fff',
    fontSize: '14px',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  primaryBtn: {
    padding: '10px 20px',
    backgroundColor: '#5B5FFB',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(91, 95, 251, 0.25)',
    transition: 'all 0.2s',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    padding: '4px',
    backgroundColor: '#E2E8F0',
    borderRadius: '14px',
    width: 'fit-content',
  },
  tabBtn: {
    padding: '8px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748B',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTabBtn: {
    backgroundColor: '#fff',
    color: '#0F172A',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1E293B',
    margin: 0,
    lineHeight: '1.4',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#64748B',
    margin: '0 0 20px 0',
    lineHeight: '1.5',
    flexGrow: 1,
  },
  cardMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingTop: '16px',
    borderTop: '1px solid #F1F5F9',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#475569',
    fontWeight: '500',
  },
  statusBadge: (status) => {
    let bg = '#E2E8F0';
    let color = '#475569';
    if (status === 'In Progress') { bg = '#DBEAFE'; color = '#1D4ED8'; }
    if (status === 'Done') { bg = '#DCFCE7'; color = '#15803D'; }
    return {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: bg,
      color: color,
    };
  },
  activeBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: '#EDE9FE',
    color: '#6D28D9',
  },
  emptyState: {
    gridColumn: '1 / -1',
    padding: '60px',
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '15px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px dashed #CBD5E1',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 24px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px',
  },
  cancelBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    color: '#64748B',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#5B5FFB',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(91, 95, 251, 0.2)',
  },
};
