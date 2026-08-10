import React, { useState } from 'react';

export default function GithubIntegration() {
  const [activeTab, setActiveTab] = useState('commits');
  const [selectedRepo, setSelectedRepo] = useState('All Repos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const tabs = [
    { id: 'commits', label: 'Commits' },
    { id: 'prs', label: 'Pull Requests' },
    { id: 'issues', label: 'Issues' },
    { id: 'comments', label: 'Comments' }
  ];

  const repos = ['All Repos', 'wostup/frontend', 'wostup/backend', 'wostup/api'];

  // Dummy Data
  const commitsData = [
    { id: 'c1', repo: 'wostup/frontend', message: 'fix: updated landing page layout', author: 'Sarah Chen', date: '2 hours ago', hash: 'a1b2c3d' },
    { id: 'c2', repo: 'wostup/backend', message: 'feat: add github integration API', author: 'Marcus Rodriguez', date: '5 hours ago', hash: 'e4f5g6h' },
    { id: 'c3', repo: 'wostup/frontend', message: 'chore: bump dependencies', author: 'David Smith', date: '1 day ago', hash: 'i7j8k9l' },
    { id: 'c4', repo: 'wostup/api', message: 'fix: rate limiting logic', author: 'Sarah Chen', date: '2 days ago', hash: 'm0n1o2p' },
    { id: 'c5', repo: 'wostup/frontend', message: 'style: dashboard tweaks', author: 'Elena Sokolov', date: '2 days ago', hash: 'q3r4s5t' },
    { id: 'c6', repo: 'wostup/backend', message: 'refactor: database schema', author: 'Marcus Rodriguez', date: '3 days ago', hash: 'u6v7w8x' },
  ];

  const prsData = [
    { id: 'pr1', repo: 'wostup/frontend', title: 'Feature/Github Integration UI', author: 'Elena Sokolov', status: 'Open', date: '1 hour ago', prNumber: '#42' },
    { id: 'pr2', repo: 'wostup/backend', title: 'Fix user auth token expiration', author: 'David Smith', status: 'Merged', date: '4 hours ago', prNumber: '#41' },
    { id: 'pr3', repo: 'wostup/api', title: 'Add endpoints for repo sync', author: 'Marcus Rodriguez', status: 'Open', date: '1 day ago', prNumber: '#19' },
  ];

  const issuesData = [
    { id: 'i1', repo: 'wostup/frontend', title: 'Sidebar not collapsing on mobile', author: 'Alex Kim', type: 'Issue', comments: 3, date: '3 hours ago', number: '#88' },
    { id: 'i2', repo: 'wostup/backend', title: 'Database connection timeout in production', author: 'System', type: 'Issue', comments: 12, date: '1 day ago', number: '#87' },
  ];

  const commentsData = [
    { id: 'cm1', repo: 'wostup/frontend', title: 'LGTM! Just fix the padding on line 45.', author: 'Sarah Chen', type: 'Comment', comments: 0, date: '2 hours ago', number: 'PR #42' },
  ];

  const getFilteredData = () => {
    let data = [];
    if (activeTab === 'commits') data = commitsData;
    else if (activeTab === 'prs') data = prsData;
    else if (activeTab === 'issues') data = issuesData;
    else if (activeTab === 'comments') data = commentsData;

    if (selectedRepo !== 'All Repos') {
      data = data.filter(item => item.repo === selectedRepo);
    }
    return data;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleConvertToTask = (item) => {
    alert(`Converted ${item.hash || item.prNumber || item.number} to a Wostup task!`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>GitHub Integration</h1>
          <p style={styles.subtitle}>Track commits, pull requests, and issues directly from your repositories.</p>
        </div>
      </div>

      <div style={styles.controlsRow}>
        <div style={styles.tabsContainer}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={{
                ...styles.tabButton,
                ...(activeTab === tab.id ? styles.activeTabButton : {})
              }}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={styles.filterContainer}>
          <span style={styles.filterLabel}>Filter by Repo:</span>
          <select 
            style={styles.select} 
            value={selectedRepo} 
            onChange={(e) => { setSelectedRepo(e.target.value); setCurrentPage(1); }}
          >
            {repos.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Repository</th>
              <th style={styles.th}>
                {activeTab === 'commits' ? 'Commit Message' : activeTab === 'prs' ? 'PR Title' : activeTab === 'issues' ? 'Issue Title' : 'Comment Content'}
              </th>
              <th style={styles.th}>Author</th>
              <th style={styles.th}>Date</th>
              <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? paginatedData.map((item, idx) => (
              <tr key={item.id} style={{
                ...styles.tr,
                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFBFC'
              }}>
                <td style={styles.td}>
                  <div style={styles.repoBadge}>{item.repo}</div>
                </td>
                <td style={styles.td}>
                  <div style={styles.itemTitle}>
                    {item.hash && <span style={styles.idText}>{item.hash}</span>}
                    {item.prNumber && <span style={styles.idText}>{item.prNumber}</span>}
                    {item.number && <span style={styles.idText}>{item.number}</span>}
                    {item.message || item.title}
                  </div>
                </td>
                <td style={styles.td}>{item.author}</td>
                <td style={styles.td}><span style={styles.dateText}>{item.date}</span></td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  <button style={styles.actionBtn} onClick={() => handleConvertToTask(item)}>
                    Convert to Task
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={styles.emptyState}>No items found for the selected repository.</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div style={styles.paginationContainer}>
          <span style={styles.pageInfo}>
            Showing {paginatedData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {((currentPage - 1) * itemsPerPage) + paginatedData.length} of {filteredData.length} entries
          </span>
          <div style={styles.paginationControls}>
            <button 
              style={{...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1}} 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            <span style={styles.pageCurrent}>{currentPage} / {totalPages}</span>
            <button 
              style={{...styles.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1}} 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '28px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6C7A87',
    margin: 0,
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  tabsContainer: {
    display: 'flex',
    backgroundColor: '#F3F5F8',
    borderRadius: '10px',
    padding: '4px',
  },
  tabButton: {
    background: 'none',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6C7A87',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    color: '#1A1D20',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1A1D20',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #ECEEF4',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    color: '#1A1D20',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    minWidth: '160px',
    cursor: 'pointer',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #ECEEF4',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '16px 20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6C7A87',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #ECEEF4',
    backgroundColor: '#FAFBFC',
  },
  td: {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#1A1D20',
    borderBottom: '1px solid #ECEEF4',
    verticalAlign: 'middle',
  },
  tr: {
    transition: 'background-color 0.2s',
  },
  repoBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: '#F3F5F8',
    color: '#6C7A87',
    fontSize: '12px',
    fontWeight: '500',
  },
  itemTitle: {
    fontWeight: '500',
    color: '#1A1D20',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  idText: {
    color: '#5B5FFB',
    fontWeight: '600',
    fontSize: '13px',
  },
  dateText: {
    color: '#6C7A87',
    fontSize: '13px',
  },
  actionBtn: {
    background: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#5B5FFB',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 20px',
    color: '#6C7A87',
    fontSize: '14px',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#FFFFFF',
  },
  pageInfo: {
    fontSize: '13px',
    color: '#6C7A87',
  },
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  pageBtn: {
    background: '#F3F5F8',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1A1D20',
    cursor: 'pointer',
  },
  pageCurrent: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1D20',
  }
};
