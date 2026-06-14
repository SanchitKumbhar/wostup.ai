import React, { useState } from 'react';

export default function ProjectOverview({
  project,
  tasks,
  milestones,
  onBack,
  onAddTask,
  onAddMilestone,
  onAddComment,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  // Form states
  const [inlineTaskDesc, setInlineTaskDesc] = useState('');
  const [inlineTaskAssignee, setInlineTaskAssignee] = useState('Sarah Chen');
  
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestonePhase, setNewMilestonePhase] = useState('Phase 1');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [newMilestoneOwner, setNewMilestoneOwner] = useState('Alex Rivera');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  
  const [commentText, setCommentText] = useState('');

  // Filter tasks specific to this project
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectMilestones = milestones.filter(m => m.projectId === project.id);

  // Mock comments
  const [comments, setComments] = useState([
    { id: 1, author: 'Sarah Chen', role: 'LEAD DEVELOPER', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', text: "I've started the socket.io integration on the backend. We'll need to define the event payload structure for workspace updates. @Alex, can you review the draft documentation in the shared Figma file?", time: '2 hours ago', reactions: { thumb: 2, clap: 3 } },
    { id: 2, author: 'Alex Rivera', role: 'PRODUCT DESIGNER', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', text: "Looking at it now. The notification badges should probably follow the brand secondary color (#E11D48) for high urgency events like task blockers.", time: '45 minutes ago', reactions: { thumb: 2 } },
    { id: 3, author: 'Jordan Smith', role: 'QA ENGINEER', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', text: "Don't forget to handle the reconnection logic gracefully. We saw some flickering in the staging environment when the socket heartbeat failed yesterday.", time: '12 minutes ago', reactions: {} }
  ]);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: 'Alex Rivers',
      role: 'PROJECT MANAGER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text: commentText,
      time: 'Just now',
      reactions: {}
    };
    setComments([...comments, newComment]);
    setCommentText('');
    if (onAddComment) onAddComment(project.id, newComment);
  };

  const handleCreateMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !newMilestoneDate) return;
    const newMil = {
      id: `M-${Date.now()}`,
      projectId: project.id,
      title: newMilestoneTitle,
      phase: newMilestonePhase,
      dueDate: new Date(newMilestoneDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      owner: newMilestoneOwner,
      description: newMilestoneDesc,
      progress: 0,
      status: 'Upcoming'
    };
    onAddMilestone(newMil);
    setIsMilestoneModalOpen(false);
    // Reset
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
    setNewMilestoneDesc('');
  };

  const handleAddInlineTask = (e) => {
    e.preventDefault();
    if (!inlineTaskDesc.trim()) return;
    const newT = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      projectId: project.id,
      title: inlineTaskDesc,
      assignee: inlineTaskAssignee,
      avatar: inlineTaskAssignee === 'Sarah Chen' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'Todo',
      dueDate: 'Jun 30',
      priority: 'Medium',
      progress: 0
    };
    onAddTask(newT);
    setInlineTaskDesc('');
  };

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
      case 'todo': return 'badge-todo';
      case 'in progress': return 'badge-inprogress';
      case 'review': return 'badge-review';
      case 'completed':
      case 'done': return 'badge-completed';
      case 'at risk': return 'badge-atrisk';
      default: return 'badge-todo';
    }
  };

  // Calc summary stats
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.status === 'Completed' || t.status === 'Done').length;
  const atRiskTasks = projectTasks.filter(t => t.status === 'At Risk').length;
  const avgProgress = totalTasks > 0 ? Math.round(projectTasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks) : 0;

  return (
    <div className="page-body">
      {/* Back to projects breadcrumb row */}
      <div style={styles.breadcrumbRow}>
        <button onClick={onBack} style={styles.backBtn}>
          ← Back to Projects
        </button>
        <span style={styles.breadcrumbDivider}>/</span>
        <span style={styles.breadcrumbCurrent}>{project.name}</span>
      </div>

      {/* Project Banner Header */}
      <div style={styles.projectHeader}>
        <div>
          <div style={styles.projectMetaRow}>
            <span style={styles.projectCode}>{project.id}</span>
            <span className={`badge ${getStatusBadgeStyle(project.status)}`}>{project.status}</span>
            <span style={styles.metaLabel}>{project.dueDate}</span>
            <span style={styles.metaLabel}>• 24 Days Remaining</span>
          </div>
          <h1 style={styles.projectName}>{project.name}</h1>
          <p style={styles.projectDesc}>{project.description || 'Comprehensive project execution workspace incorporating AI metrics monitoring.'}</p>
        </div>

        {/* Project Owner Section */}
        <div style={styles.ownerBox}>
          <div style={styles.ownerTitle}>PROJECT OWNER</div>
          <div style={styles.ownerMeta}>
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Owner" style={styles.ownerAvatar} />
            <div>
              <div style={styles.ownerName}>Sarah Jenkins</div>
              <div style={styles.ownerRole}>Senior Project Manager</div>
            </div>
          </div>
          <div style={styles.ownerActions}>
            <button className="btn-gradient" style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }} onClick={() => setActiveTab('tasks')}>
              + Add Task
            </button>
            <button className="btn-secondary" style={{ padding: '8px' }} onClick={() => alert('Invite Link Copied!')}>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Tab Menu Bar */}
      <div className="tab-bar">
        {['overview', 'tasks', 'milestones', 'comments'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="overview-grid" style={styles.overviewGrid}>
          {/* Left Side */}
          <div style={styles.overviewLeft}>
            {/* KPI Cards Row */}
            <div className="kpi-row-small" style={styles.kpiRowSmall}>
              <div className="premium-card kpi-card-small" style={styles.kpiCardSmall}>
                <div style={styles.kpiSmallTitle}>BUDGET USED</div>
                <div style={styles.kpiSmallVal}>$45,200</div>
                <span style={styles.kpiSmallChange}>↗ +12%</span>
              </div>
              <div className="premium-card kpi-card-small" style={styles.kpiCardSmall}>
                <div style={styles.kpiSmallTitle}>TASKS COMPLETED</div>
                <div style={styles.kpiSmallVal}>{completedTasks}/{totalTasks}</div>
                <span style={styles.kpiSmallChange}>↗ +8 today</span>
              </div>
              <div className="premium-card kpi-card-small" style={styles.kpiCardSmall}>
                <div style={styles.kpiSmallTitle}>VELOCITY</div>
                <div style={styles.kpiSmallVal}>18.5</div>
                <span style={{ ...styles.kpiSmallChange, color: '#EF4444' }}>↘ -1.2</span>
              </div>
              <div className="premium-card kpi-card-small" style={styles.kpiCardSmall}>
                <div style={styles.kpiSmallTitle}>MILESTONES</div>
                <div style={styles.kpiSmallVal}>
                  {projectMilestones.filter(m => m.status === 'Completed').length}/{projectMilestones.length}
                </div>
                <span style={styles.kpiSmallChange}>On Time</span>
              </div>
            </div>

            {/* Custom SVG Burndown trends chart */}
            <div className="premium-card" style={styles.chartPanel}>
              <div style={styles.chartHeader}>
                <div>
                  <h3 style={styles.cardTitle}>Burndown Trends</h3>
                  <p style={styles.cardSubtitle}>Visualizing project velocity vs planned schedule</p>
                </div>
                <div style={styles.chartLegends}>
                  <div style={styles.legendItem}>
                    <span style={{ ...styles.legendDot, backgroundColor: '#A0AEC0' }} />
                    Planned Progress
                  </div>
                  <div style={styles.legendItem}>
                    <span style={{ ...styles.legendDot, backgroundColor: '#5B5FFB' }} />
                    Actual Progress
                  </div>
                </div>
              </div>
              
              {/* Burndown SVG */}
              <div style={styles.chartContainer}>
                <svg viewBox="0 0 500 200" width="100%" height="100%">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#ECEEF4" strokeDasharray="3" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#ECEEF4" strokeDasharray="3" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#ECEEF4" strokeDasharray="3" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#ECEEF4" strokeDasharray="3" />

                  {/* Planned Line */}
                  <path d="M 40 170 L 110 135 L 180 110 L 250 85 L 320 60 L 390 35 L 480 20" fill="none" stroke="#A0AEC0" strokeWidth="2.5" />
                  
                  {/* Actual Line */}
                  <path d="M 40 170 L 110 140 L 180 105 L 250 90 L 320 50 L 390 40 L 480 25" fill="none" stroke="#5B5FFB" strokeWidth="3" />
                  
                  {/* Actual Points */}
                  <circle cx="110" cy="140" r="4" fill="#5B5FFB" />
                  <circle cx="180" cy="105" r="4" fill="#5B5FFB" />
                  <circle cx="250" cy="90" r="4" fill="#5B5FFB" />
                  <circle cx="320" cy="50" r="4" fill="#5B5FFB" />
                  <circle cx="390" cy="40" r="4" fill="#5B5FFB" />
                  <circle cx="480" cy="25" r="4" fill="#5B5FFB" />
                  
                  {/* Axes labels */}
                  <text x="40" y="190" fontSize="10" fill="#9AA6B2" textAnchor="middle">Mon</text>
                  <text x="110" y="190" fontSize="10" fill="#9AA6B2" textAnchor="middle">Tue</text>
                  <text x="180" y="190" fontSize="10" fill="#9AA6B2" textAnchor="middle">Wed</text>
                  <text x="250" y="190" fontSize="10" fill="#9AA6B2" textAnchor="middle">Thu</text>
                  <text x="320" y="190" fontSize="10" fill="#9AA6B2" textAnchor="middle">Fri</text>
                  <text x="390" y="190" fontSize="10" fill="#9AA6B2" textAnchor="middle">Sat</text>
                  <text x="480" y="190" fontSize="10" fill="#9AA6B2" textAnchor="middle">Sun</text>

                  <text x="30" y="174" fontSize="10" fill="#9AA6B2" textAnchor="end">0</text>
                  <text x="30" y="124" fontSize="10" fill="#9AA6B2" textAnchor="end">50</text>
                  <text x="30" y="74" fontSize="10" fill="#9AA6B2" textAnchor="end">75</text>
                  <text x="30" y="24" fontSize="10" fill="#9AA6B2" textAnchor="end">100</text>
                </svg>
              </div>
            </div>

            {/* Split Objectives and Risk */}
            <div className="split-row" style={{ display: 'flex', gap: '20px' }}>
              {/* Key Objectives */}
              <div className="premium-card" style={{ ...styles.panelCard, flex: 1 }}>
                <h3 style={styles.cardTitle}>Key Objectives</h3>
                <ul style={styles.objectivesList}>
                  <li>Complete cloud resource mapping.</li>
                  <li>Migrate Core API DB workloads.</li>
                  <li>Zero downtime fallback cutover.</li>
                </ul>
              </div>

              {/* Risk Assessment */}
              <div className="premium-card" style={{ ...styles.panelCard, flex: 1 }}>
                <h3 style={styles.cardTitle}>Risk Assessment</h3>
                <div style={styles.riskCard}>
                  <div style={styles.riskHeaderHigh}>HIGH RISK</div>
                  <div style={styles.riskBody}>
                    Third-party API integration delays might affect sprint 4 delivery.
                  </div>
                </div>
                <div style={{ ...styles.riskCard, borderLeft: '4px solid #10B981', marginTop: '12px' }}>
                  <div style={styles.riskHeaderGreen}>MITIGATION READY</div>
                  <div style={styles.riskBody}>
                    Backup vendor identified for specialized encryption modules.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div style={styles.overviewRight}>
            {/* Project Team */}
            <div className="premium-card" style={styles.panelCard}>
              <div style={styles.panelTitleRow}>
                <h3 style={styles.cardTitle}>Project Team</h3>
                <button style={styles.linkTextBtn} onClick={() => alert('Assignee manager simulated.')}>Manage</button>
              </div>
              <div style={styles.teamList}>
                {project.members.map((member, i) => (
                  <div key={i} style={styles.teamMemberRow}>
                    <img src={member.avatar} alt={member.name} style={styles.memberAvatarMedium} />
                    <div>
                      <div style={styles.memberName}>{member.name}</div>
                      <div style={styles.memberRole}>{i === 0 ? 'Project Manager' : 'Developer'}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => alert('Stakeholder invitations simulated.')}>
                + Invite Stakeholder
              </button>
            </div>

            {/* Quick Summary */}
            <div className="premium-card" style={styles.panelCard}>
              <h3 style={styles.cardTitle}>Quick Summary</h3>
              <div style={styles.progressSummaryRow}>
                <span style={styles.summaryLabel}>Overall Completion</span>
                <span style={styles.summaryVal}>{avgProgress}%</span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${avgProgress}%` }} />
              </div>
              
              <div style={styles.summaryStatsGrid}>
                <div style={styles.summaryStatBox}>
                  <div style={styles.summaryStatVal}>{totalTasks}</div>
                  <div style={styles.summaryStatLabel}>OPEN TASKS</div>
                </div>
                <div style={styles.summaryStatBox}>
                  <div style={{ ...styles.summaryStatVal, color: '#EF4444' }}>{atRiskTasks}</div>
                  <div style={styles.summaryStatLabel}>AT RISK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div style={styles.tasksTabContent}>
          {/* Tasks KPI summary header */}
          <div style={styles.tasksSummaryHeader}>
            <div style={styles.taskSummaryBox}>
              <div style={styles.taskSummaryTitle}>TOTAL TASKS</div>
              <div style={styles.taskSummaryVal}>{totalTasks}</div>
            </div>
            <div style={styles.taskSummaryBox}>
              <div style={styles.taskSummaryTitle}>COMPLETED</div>
              <div style={{ ...styles.taskSummaryVal, color: '#10B981' }}>{completedTasks}</div>
            </div>
            <div style={styles.taskSummaryBox}>
              <div style={styles.taskSummaryTitle}>AT RISK</div>
              <div style={{ ...styles.taskSummaryVal, color: '#EF4444' }}>{atRiskTasks}</div>
            </div>
            <div style={styles.taskSummaryBox}>
              <div style={styles.taskSummaryTitle}>AVG PROGRESS</div>
              <div style={styles.taskSummaryVal}>{avgProgress}%</div>
            </div>
          </div>

          {/* Filters Row */}
          <div style={styles.tasksActionsRow}>
            <div style={styles.searchContainer}>
              <svg style={styles.searchIcon} viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search tasks by ID or name..." style={styles.filterSearchInput} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => onNavigate('my-tasks')}>Kanban Board</button>
            </div>
          </div>

            {/* Tasks Table */}
            <div className="premium-card table-responsive" style={{ overflow: 'hidden' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.tableTh}>TASK ID</th>
                  <th style={styles.tableTh}>DESCRIPTION</th>
                  <th style={styles.tableTh}>ASSIGNEE</th>
                  <th style={styles.tableTh}>STATUS</th>
                  <th style={styles.tableTh}>DUE DATE</th>
                  <th style={styles.tableTh}>PRIORITY</th>
                  <th style={styles.tableTh}>PROGRESS</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((task) => (
                  <tr key={task.id} style={styles.tableRow}>
                    <td style={styles.tableTdCode}>{task.id}</td>
                    <td style={styles.tableTdDesc}>{task.title}</td>
                    <td style={styles.tableTd}>
                      <div style={styles.assigneeFlex}>
                        <img src={task.avatar} alt={task.assignee} style={styles.avatarMini} />
                        {task.assignee}
                      </div>
                    </td>
                    <td style={styles.tableTd}>
                      <span className={`badge ${getStatusBadgeStyle(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td style={styles.tableTd}>{task.dueDate}</td>
                    <td style={styles.tableTd}>
                      <span className={`badge ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={styles.tableTd}>
                      <div style={styles.tableProgressContainer}>
                        <div style={styles.tableProgressBarBg}>
                          <div style={{ ...styles.progressBarFill, width: `${task.progress}%` }} />
                        </div>
                        <span style={styles.tableProgressPercent}>{task.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Inline Task Creation Form */}
            <form onSubmit={handleAddInlineTask} style={styles.inlineForm}>
              <input
                type="text"
                placeholder="+ Add task inline..."
                value={inlineTaskDesc}
                onChange={(e) => setInlineTaskDesc(e.target.value)}
                style={styles.inlineInput}
              />
              <select
                value={inlineTaskAssignee}
                onChange={(e) => setInlineTaskAssignee(e.target.value)}
                style={styles.inlineSelect}
              >
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="Alex Rivers">Alex Rivers</option>
                <option value="Jordan Smith">Jordan Smith</option>
              </select>
              <button type="submit" style={styles.inlineAddBtn}>Add</button>
            </form>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div>
          <div style={styles.panelTitleRow}>
            <h3>Project Milestones</h3>
            <button className="btn-gradient" onClick={() => setIsMilestoneModalOpen(true)}>
              + Add Milestone
            </button>
          </div>

          <div style={styles.milestonesTimeline}>
            {projectMilestones.map((milestone, i) => (
              <div key={milestone.id} style={styles.milestoneCard}>
                <div style={styles.milestonePoint}>
                  <div style={styles.milestoneDot} />
                  {i < projectMilestones.length - 1 && <div style={styles.milestoneLine} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="premium-card" style={styles.milestoneDetailCard}>
                    <div style={styles.milestoneHeader}>
                      <span style={styles.milestonePhase}>{milestone.phase}</span>
                      {milestone.status === 'Completed' ? (
                        <span className="badge badge-completed">COMPLETED</span>
                      ) : milestone.status === 'At Risk' ? (
                        <span className="badge badge-atrisk">AT RISK</span>
                      ) : (
                        <span className="badge badge-todo">UPCOMING</span>
                      )}
                    </div>
                    <h4 style={styles.milestoneCardTitle}>{milestone.title}</h4>
                    <p style={styles.milestoneCardDesc}>{milestone.description}</p>
                    
                    <div style={styles.milestoneMeta}>
                      <div style={styles.metaLabel}>
                        <strong>Lead Owner:</strong> {milestone.owner}
                      </div>
                      <div style={styles.metaLabel}>
                        <strong>Due Date:</strong> {milestone.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments / Discussion Tab */}
      {activeTab === 'comments' && (
        <div className="discussion-container" style={styles.discussionContainer}>
          {/* Left discussion thread */}
          <div style={styles.chatSection}>
            <div style={styles.chatHeader}>
              <div style={styles.chatCodeBadge}>TSK-842</div>
              <h3 style={styles.chatTitle}>Implement Real-time WebSocket Notifications</h3>
            </div>

            <div style={styles.chatHistory}>
              {comments.map((comment) => (
                <div key={comment.id} style={styles.commentItem}>
                  <img src={comment.avatar} alt={comment.author} style={styles.commentAvatar} />
                  <div style={styles.commentCard}>
                    <div style={styles.commentMeta}>
                      <span style={styles.commentAuthor}>{comment.author}</span>
                      <span style={styles.commentRole}>{comment.role}</span>
                      <span style={styles.commentTime}>{comment.time}</span>
                    </div>
                    <p style={styles.commentText}>{comment.text}</p>
                    
                    {/* Reactions */}
                    <div style={styles.reactionRow}>
                      {Object.entries(comment.reactions).map(([reaction, count]) => (
                        <button key={reaction} style={styles.reactionBtn}>
                          {reaction === 'thumb' ? '👍' : '👏'} {count}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handlePostComment} style={styles.chatInputForm}>
              <textarea
                placeholder="Write a comment or type @ to mention someone..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={styles.chatTextarea}
              />
              <div style={styles.chatFooterRow}>
                <div style={styles.editorTools}>
                  <button type="button" style={styles.toolIconBtn}>📎</button>
                  <button type="button" style={styles.toolIconBtn}>@</button>
                  <button type="button" style={styles.toolIconBtn}>😊</button>
                </div>
                <button type="submit" className="btn-gradient">
                  Post Comment
                </button>
              </div>
            </form>
          </div>

          {/* Right sidebar details */}
          <div className="premium-card" style={styles.detailsSidebar}>
            <h4 style={styles.detailsSidebarTitle}>TASK DETAILS</h4>
            <div style={styles.detailList}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Status</span>
                <span className="badge badge-inprogress">In Progress</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Priority</span>
                <span className="badge badge-high-priority">High</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Due Date</span>
                <span style={styles.detailVal}>Oct 24, 2024</span>
              </div>
            </div>

            <div style={styles.divider} />

            <h4 style={styles.detailsSidebarTitle}>ASSIGNEES</h4>
            <div style={styles.assigneesRow}>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Sarah" title="Sarah Chen" style={styles.avatarMini} />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Alex" title="Alex Rivera" style={styles.avatarMini} />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Jordan" title="Jordan Smith" style={styles.avatarMini} />
            </div>

            <div style={styles.divider} />

            <h4 style={styles.detailsSidebarTitle}>SHARED ASSETS</h4>
            <div style={styles.assetsList}>
              <a href="#asset" style={styles.assetItem}>
                <span style={styles.assetIcon}>📄</span>
                System_Architecture.pdf
              </a>
              <a href="#asset" style={styles.assetItem}>
                <span style={styles.assetIcon}>🎨</span>
                Workflow_Draft_v2.fig
              </a>
              <a href="#asset" style={styles.assetItem}>
                <span style={styles.assetIcon}>📄</span>
                Requirement_Specs.docx
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Create New Milestone Modal */}
      {isMilestoneModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New Milestone</h2>
              <p style={styles.modalSubtitle}>Define a strategic goal for the project. Linked tasks will update progress.</p>
              <button style={styles.modalCloseBtn} onClick={() => setIsMilestoneModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateMilestone} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Milestone Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 User Acceptance Testing"
                  className="form-input"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  required
                />
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Project Phase</label>
                  <select
                    className="form-input"
                    value={newMilestonePhase}
                    onChange={(e) => setNewMilestonePhase(e.target.value)}
                  >
                    <option value="Phase 1">Phase 1: Discovery</option>
                    <option value="Phase 2">Phase 2: Development</option>
                    <option value="Phase 3">Phase 3: Deployment</option>
                    <option value="Phase 4">Phase 4: Optimization</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Lead Owner</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newMilestoneOwner}
                    onChange={(e) => setNewMilestoneOwner(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={newMilestoneDate}
                  onChange={(e) => setNewMilestoneDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="What objective does this milestone accomplish?"
                  className="form-input"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={newMilestoneDesc}
                  onChange={(e) => setNewMilestoneDesc(e.target.value)}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsMilestoneModalOpen(false)} style={styles.discardBtn}>
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
  breadcrumbRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    fontSize: '13px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#5B5FFB',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
  },
  breadcrumbDivider: {
    color: '#9AA6B2',
  },
  breadcrumbCurrent: {
    color: '#6C7A87',
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '28px',
  },
  projectMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  projectCode: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#F0F2FF',
    color: '#5B5FFB',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  metaLabel: {
    fontSize: '13px',
    color: '#6C7A87',
    fontWeight: '500',
  },
  projectName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '8px',
  },
  projectDesc: {
    fontSize: '14px',
    color: '#6C7A87',
    lineHeight: '1.5',
    maxWidth: '600px',
  },
  ownerBox: {
    width: '240px',
    backgroundColor: '#F8F9FD',
    border: '1px solid #ECEEF4',
    borderRadius: '12px',
    padding: '16px',
  },
  ownerTitle: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
    marginBottom: '10px',
  },
  ownerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  ownerAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  ownerName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  ownerRole: {
    fontSize: '11px',
    color: '#9AA6B2',
  },
  ownerActions: {
    display: 'flex',
    gap: '8px',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  overviewLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  overviewRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  kpiRowSmall: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  kpiCardSmall: {
    padding: '16px',
  },
  kpiSmallTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  kpiSmallVal: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '4px',
  },
  kpiSmallChange: {
    fontSize: '11px',
    color: '#10B981',
    fontWeight: '600',
  },
  chartPanel: {
    padding: '24px',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  cardSubtitle: {
    fontSize: '12px',
    color: '#6C7A87',
  },
  chartLegends: {
    display: 'flex',
    gap: '16px',
  },
  legendItem: {
    fontSize: '12px',
    color: '#6C7A87',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  chartContainer: {
    height: '200px',
    display: 'flex',
    alignItems: 'center',
  },
  panelCard: {
    padding: '20px',
  },
  panelTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  linkTextBtn: {
    background: 'none',
    border: 'none',
    color: '#5B5FFB',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
  },
  teamList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  teamMemberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  memberAvatarMedium: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  memberName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  memberRole: {
    fontSize: '11px',
    color: '#9AA6B2',
  },
  objectivesList: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    fontSize: '13.5px',
    color: '#6C7A87',
    lineHeight: '1.8',
  },
  riskCard: {
    borderLeft: '4px solid #E53E3E',
    backgroundColor: '#F8F9FD',
    borderRadius: '0 8px 8px 0',
    padding: '10px 12px',
  },
  riskHeaderHigh: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#E53E3E',
    marginBottom: '4px',
  },
  riskHeaderGreen: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#10B981',
    marginBottom: '4px',
  },
  riskBody: {
    fontSize: '12px',
    color: '#1A1D20',
    lineHeight: '1.4',
  },
  progressSummaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1A1D20',
    marginBottom: '8px',
  },
  summaryLabel: {
    color: '#6C7A87',
  },
  summaryVal: {
    fontWeight: '700',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5B5FFB',
    borderRadius: '3px',
  },
  summaryStatsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  summaryStatBox: {
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center',
  },
  summaryStatVal: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '2px',
  },
  summaryStatLabel: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#9AA6B2',
  },
  tasksTabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  tasksSummaryHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  taskSummaryBox: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '12px',
    padding: '16px',
  },
  taskSummaryTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  taskSummaryVal: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1A1D20',
  },
  tasksActionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'relative',
    width: '300px',
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
    backgroundColor: '#FFFFFF',
    outline: 'none',
    transition: 'all 0.2s ease',
    '&:focus': {
      borderColor: '#5B5FFB',
    },
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeadRow: {
    backgroundColor: '#FAFCFF',
    borderBottom: '1px solid #ECEEF4',
  },
  tableTh: {
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
  },
  tableRow: {
    borderBottom: '1px solid #ECEEF4',
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FAFCFF',
    },
  },
  tableTd: {
    padding: '14px 16px',
    fontSize: '13.5px',
    color: '#1A1D20',
  },
  tableTdCode: {
    padding: '14px 16px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#5B5FFB',
  },
  tableTdDesc: {
    padding: '14px 16px',
    fontSize: '13.5px',
    color: '#1A1D20',
    fontWeight: '500',
  },
  assigneeFlex: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatarMini: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  tableProgressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tableProgressBarBg: {
    width: '60px',
    height: '4px',
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  tableProgressPercent: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6C7A87',
  },
  inlineForm: {
    display: 'flex',
    padding: '12px 16px',
    backgroundColor: '#FAFCFF',
    alignItems: 'center',
    gap: '12px',
  },
  inlineInput: {
    flex: 1,
    border: 'none',
    background: 'none',
    fontSize: '13.5px',
    outline: 'none',
    color: '#1A1D20',
  },
  inlineSelect: {
    border: '1px solid #ECEEF4',
    borderRadius: '6px',
    fontSize: '12px',
    padding: '4px 8px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
  },
  inlineAddBtn: {
    backgroundColor: '#5B5FFB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  milestonesTimeline: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginTop: '20px',
    paddingLeft: '24px',
  },
  milestoneCard: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
    position: 'relative',
  },
  milestonePoint: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  milestoneDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#5B5FFB',
    border: '3px solid #FFFFFF',
    boxShadow: '0 0 0 2px #5B5FFB',
    zIndex: 2,
    marginTop: '16px',
  },
  milestoneLine: {
    width: '2px',
    backgroundColor: '#ECEEF4',
    flex: 1,
    position: 'absolute',
    top: '28px',
    bottom: '-16px',
    left: '5px',
    zIndex: 1,
  },
  milestoneDetailCard: {
    padding: '20px',
    width: '100%',
  },
  milestoneHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  milestonePhase: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#5B5FFB',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  milestoneCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '6px',
  },
  milestoneCardDesc: {
    fontSize: '13px',
    color: '#6C7A87',
    lineHeight: '1.4',
    marginBottom: '16px',
  },
  milestoneMeta: {
    display: 'flex',
    gap: '24px',
    borderTop: '1px solid #ECEEF4',
    paddingTop: '12px',
  },
  discussionContainer: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1fr',
    gap: '24px',
    alignItems: 'flex-start',
  },
  chatSection: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '500px',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #ECEEF4',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  chatCodeBadge: {
    fontSize: '10px',
    fontWeight: '700',
    backgroundColor: '#F0F2FF',
    color: '#5B5FFB',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  chatTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1A1D20',
  },
  chatHistory: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flex: 1,
    overflowY: 'auto',
    marginBottom: '20px',
    maxHeight: '380px',
    paddingRight: '6px',
  },
  commentItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  commentCard: {
    flex: 1,
    backgroundColor: '#F8F9FD',
    borderRadius: '12px',
    padding: '14px 16px',
    border: '1px solid #ECEEF4',
  },
  commentMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  commentAuthor: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  commentRole: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
  },
  commentTime: {
    fontSize: '11px',
    color: '#9AA6B2',
    marginLeft: 'auto',
  },
  commentText: {
    fontSize: '13px',
    color: '#6C7A87',
    lineHeight: '1.4',
  },
  reactionRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  },
  reactionBtn: {
    fontSize: '11px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '12px',
    padding: '2px 8px',
    cursor: 'pointer',
    color: '#6C7A87',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#5B5FFB',
      color: '#5B5FFB',
    },
  },
  chatInputForm: {
    borderTop: '1px solid #ECEEF4',
    paddingTop: '16px',
  },
  chatTextarea: {
    width: '100%',
    border: '1px solid #ECEEF4',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '13px',
    minHeight: '70px',
    resize: 'none',
    outline: 'none',
    backgroundColor: '#FAFCFF',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    '&:focus': {
      backgroundColor: '#FFFFFF',
      borderColor: '#5B5FFB',
    },
  },
  chatFooterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  editorTools: {
    display: 'flex',
    gap: '12px',
  },
  toolIconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
    color: '#9AA6B2',
  },
  detailsSidebar: {
    padding: '20px',
  },
  detailsSidebarTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
    marginBottom: '12px',
  },
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: '13px',
    color: '#6C7A87',
  },
  detailVal: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  divider: {
    height: '1px',
    backgroundColor: '#ECEEF4',
    margin: '16px 0',
  },
  assigneesRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '16px',
  },
  assetsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  assetItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12.5px',
    color: '#5B5FFB',
    textDecoration: 'none',
    fontWeight: '500',
  },
  assetIcon: {
    fontSize: '16px',
  },
  modalContent: {
    maxWidth: '500px',
  },
  modalHeader: {
    padding: '28px 28px 16px 28px',
    borderBottom: '1px solid #ECEEF4',
    position: 'relative',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '4px',
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
    padding: '20px 28px 28px 28px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
};
