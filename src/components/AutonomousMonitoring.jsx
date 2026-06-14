import React, { useState, useEffect } from 'react';

export default function AutonomousMonitoring() {
  const [activeJobs, setActiveJobs] = useState(0);
  const [evalTime, setEvalTime] = useState(0);
  const [latency, setLatency] = useState(24);

  // Simulate real-time monitoring metric fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveJobs(Math.floor(Math.random() * 3));
      setEvalTime(prev => (prev + 1) % 60);
      setLatency(20 + Math.floor(Math.random() * 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { id: 'users', label: 'Users', sub: '12 Active sessions', x: 50, y: 100, color: '#5B5FFB' },
    { id: 'api', label: 'Node.js API Cluster', sub: `${latency}ms latency`, x: 200, y: 100, color: '#5B5FFB' },
    { id: 'queue', label: 'Priority Queue Workers', sub: `${activeJobs} pending jobs`, x: 380, y: 100, color: '#B24DFF' },
    { id: 'eval', label: 'Deadline Evaluation', sub: `Last checked: ${evalTime}s ago`, x: 560, y: 100, color: '#B24DFF' },
    { id: 'fastapi', label: 'FastAPI AI Orchestrator', sub: 'Model: SVM-Regressor', x: 740, y: 100, color: '#10B981' },
    { id: 'mongo', label: 'MongoDB Cluster', sub: 'Status: Connected', x: 740, y: 250, color: '#10B981' },
    { id: 'ws', label: 'WebSocket Notifications', sub: 'Feed: Healthy', x: 380, y: 250, color: '#FF7A00' },
    { id: 'email', label: 'Email Alert Dispatcher', sub: 'Triggers: Active', x: 100, y: 250, color: '#EF4444' },
  ];

  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div className="page-title-group">
          <h1>AI Engine Operations</h1>
          <p>Autonomous monitoring & orchestrating pipeline. Observing live system event flows.</p>
        </div>
      </div>

      {/* Grid wrapper */}
      <div style={styles.gridContainer}>
        {/* SVG Flow diagram card */}
        <div className="premium-card" style={styles.diagramCard}>
          <h3 style={styles.cardTitle}>Real-time Event Processing Loop</h3>
          <p style={styles.cardSubtitle}>Glowing connections illustrate live autonomous analysis packages traveling through the cluster.</p>

          <div style={styles.svgWrapper}>
            <svg viewBox="0 0 900 360" width="100%" height="100%" style={styles.svgElement}>
              
              {/* Definitions for gradients and drop shadows */}
              <defs>
                <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5B5FFB" />
                  <stop offset="100%" stopColor="#B24DFF" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connections/Lines */}
              {/* Users -> API */}
              <path d="M 120 100 L 150 100" stroke="#5B5FFB" strokeWidth="2.5" />
              {/* API -> Queue */}
              <path d="M 300 100 L 330 100" stroke="#5B5FFB" strokeWidth="2.5" strokeDasharray="5 3" />
              {/* Queue -> Eval */}
              <path d="M 480 100 L 510 100" stroke="#B24DFF" strokeWidth="2.5" />
              {/* Eval -> FastAPI */}
              <path d="M 660 100 L 690 100" stroke="#B24DFF" strokeWidth="2.5" />
              {/* FastAPI -> Mongo */}
              <path d="M 740 140 L 740 210" stroke="#10B981" strokeWidth="2.5" />
              {/* Mongo -> WS */}
              <path d="M 690 250 L 480 250" stroke="#10B981" strokeWidth="2.5" />
              {/* WS -> Email */}
              <path d="M 330 250 L 200 250" stroke="#FF7A00" strokeWidth="2.5" />
              {/* WS -> Users Loopback */}
              <path d="M 380 250 L 90 250 L 90 140" stroke="#5B5FFB" strokeWidth="2.5" strokeDasharray="3 3" />

              {/* Animated Glowing Packages (small circles moving along paths) */}
              <circle r="4" fill="#B24DFF" filter="url(#glow)">
                <animateMotion
                  path="M 120 100 L 330 100 L 510 100 L 690 100"
                  begin="0s"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="4" fill="#10B981" filter="url(#glow)">
                <animateMotion
                  path="M 740 140 L 740 210 L 480 250"
                  begin="2s"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="4" fill="#FF7A00" filter="url(#glow)">
                <animateMotion
                  path="M 330 250 L 90 250 L 90 140"
                  begin="1s"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Nodes Blocks */}
              {nodes.map((node) => (
                <g key={node.id} transform={`translate(${node.x - 70}, ${node.y - 40})`}>
                  {/* Outer glow box */}
                  <rect
                    width="140"
                    height="60"
                    rx="8"
                    fill="#FFFFFF"
                    stroke={node.color}
                    strokeWidth="1.5"
                    style={{ filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.03))' }}
                  />
                  {/* Side color accent bar */}
                  <rect width="4" height="60" rx="2" fill={node.color} />
                  
                  {/* Node label and metadata */}
                  <text x="12" y="22" fontSize="11" fontWeight="700" fill="#1A1D20">{node.label}</text>
                  <text x="12" y="44" fontSize="9.5" fill="#6C7A87" fontWeight="500">{node.sub}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Process list card */}
        <div className="premium-card" style={styles.processCard}>
          <h3 style={styles.cardTitle}>Operations Log</h3>
          <div style={styles.logList}>
            <div style={styles.logItem}>
              <span style={styles.logTime}>11:00:12 AM</span>
              <span style={styles.logTagSuccess}>HEALTHCHECK</span>
              <span style={styles.logText}>FastAPI evaluator successfully queried database nodes. Score: 92%</span>
            </div>
            <div style={styles.logItem}>
              <span style={styles.logTime}>10:59:45 AM</span>
              <span style={styles.logTagWarn}>WARNING</span>
              <span style={styles.logText}>Redis Queue: Sarah Chen has 12 items pending on thread-pool-2.</span>
            </div>
            <div style={styles.logItem}>
              <span style={styles.logTime}>10:59:00 AM</span>
              <span style={styles.logTagInfo}>SOCKETIO</span>
              <span style={styles.logText}>Opened persistent pipeline channel 82b for workspace sync.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1fr',
    gap: '24px',
    flex: 1,
    overflow: 'hidden',
  },
  diagramCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  cardSubtitle: {
    fontSize: '12px',
    color: '#6C7A87',
    marginBottom: '20px',
  },
  svgWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFBFD',
    border: '1px dashed #ECEEF4',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
  },
  svgElement: {
    width: '100%',
    height: '100%',
    maxHeight: '340px',
  },
  processCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
    overflowY: 'auto',
    flex: 1,
  },
  logItem: {
    borderBottom: '1px solid #ECEEF4',
    paddingBottom: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  logTime: {
    fontSize: '10px',
    color: '#9AA6B2',
    fontFamily: 'monospace',
  },
  logTagSuccess: {
    alignSelf: 'flex-start',
    fontSize: '8px',
    fontWeight: '700',
    backgroundColor: '#E6FFFA',
    color: '#10B981',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  logTagWarn: {
    alignSelf: 'flex-start',
    fontSize: '8px',
    fontWeight: '700',
    backgroundColor: '#FFE5E5',
    color: '#EF4444',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  logTagInfo: {
    alignSelf: 'flex-start',
    fontSize: '8px',
    fontWeight: '700',
    backgroundColor: '#F0F2FF',
    color: '#5B5FFB',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  logText: {
    fontSize: '12px',
    color: '#1A1D20',
    lineHeight: '1.4',
  },
};
