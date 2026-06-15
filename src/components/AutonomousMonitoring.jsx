import React, { useState, useEffect, useRef } from 'react';

// Initial node definitions
const initialNodes = [
  { id: 'users', label: 'Users Gateway', type: 'Gateway', sub: '12 Active sessions', status: 'Healthy', cpu: 12, ram: 14, color: '#5B5FFB', x: 80, y: 80 },
  { id: 'api', label: 'Node.js API Cluster', type: 'Service', sub: '24ms latency', status: 'Healthy', cpu: 28, ram: 42, color: '#5B5FFB', x: 260, y: 80 },
  { id: 'queue', label: 'Priority Queue Workers', type: 'Queue', sub: '0 pending jobs', status: 'Healthy', cpu: 15, ram: 31, color: '#B24DFF', x: 440, y: 80 },
  { id: 'eval', label: 'Deadline Evaluation', type: 'Worker', sub: 'Last checked: 0s ago', status: 'Healthy', cpu: 34, ram: 25, color: '#B24DFF', x: 620, y: 80 },
  { id: 'fastapi', label: 'FastAPI AI Orchestrator', type: 'AI Engine', sub: 'Model: SVM-Regressor', status: 'Healthy', cpu: 65, ram: 78, color: '#10B981', x: 800, y: 80 },
  { id: 'mongo', label: 'MongoDB Cluster', type: 'Database', sub: 'Status: Connected', status: 'Healthy', cpu: 45, ram: 88, color: '#10B981', x: 800, y: 240 },
  { id: 'ws', label: 'WebSocket Notifications', type: 'Sync', sub: 'Feed: Healthy', status: 'Healthy', cpu: 18, ram: 22, color: '#FF7A00', x: 440, y: 240 },
  { id: 'email', label: 'Email Alert Dispatcher', type: 'Notification', sub: 'Triggers: Active', status: 'Healthy', cpu: 8, ram: 15, color: '#EF4444', x: 140, y: 240 },
];

export default function AutonomousMonitoring() {
  // Main states
  const [activeModel, setActiveModel] = useState('svm');
  const [activeJobs, setActiveJobs] = useState(2);
  const [evalTime, setEvalTime] = useState(0);
  const [latency, setLatency] = useState(24);
  const [throughput, setThroughput] = useState(145);
  const [systemHealth, setSystemHealth] = useState(99.85);
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState('fastapi');
  const [speed, setSpeed] = useState(1);
  const [isAutoHealing, setIsAutoHealing] = useState(true);
  
  // Custom injections
  const [injections, setInjections] = useState([]);
  
  // Node config sliders (local states mapped by nodeId)
  const [nodeConfigs, setNodeConfigs] = useState({
    users: { scaling: 2, threshold: 120 },
    api: { scaling: 4, threshold: 150 },
    queue: { scaling: 3, threshold: 200 },
    eval: { scaling: 1, threshold: 180 },
    fastapi: { scaling: 5, threshold: 300 },
    mongo: { scaling: 3, threshold: 250 },
    ws: { scaling: 2, threshold: 100 },
    email: { scaling: 1, threshold: 80 },
  });

  // Operations Log
  const [logs, setLogs] = useState([
    { id: 1, time: '11:22:15 AM', level: 'SUCCESS', source: 'HEALTHCHECK', text: 'FastAPI evaluator successfully queried database nodes. Score: 98%' },
    { id: 2, time: '11:21:45 AM', level: 'WARNING', source: 'REDIS', text: 'Redis Queue: High database load on deadline evaluations.' },
    { id: 3, time: '11:21:00 AM', level: 'INFO', source: 'SOCKETIO', text: 'Opened persistent pipeline channel 82b for workspace sync.' },
    { id: 4, time: '11:20:10 AM', level: 'SUCCESS', source: 'SYSTEM', text: 'Orchestration engines launched. Current active SVM-Regressor instance: healthy.' }
  ]);
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState('ALL');

  // Telemetry sliding window data
  const [historyData, setHistoryData] = useState(() => {
    // Generate initial history points for nice starting charts
    const initial = [];
    const now = new Date();
    for (let i = 14; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 3000);
      initial.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        throughput: 130 + Math.floor(Math.random() * 30),
        latency: 20 + Math.floor(Math.random() * 10),
      });
    }
    return initial;
  });

  // Sparklines states (last 10 ticks)
  const [sparklineThroughput, setSparklineThroughput] = useState([135, 142, 138, 145, 150, 141, 137, 148, 146, 145]);
  const [sparklineLatency, setSparklineLatency] = useState([22, 24, 25, 23, 21, 26, 28, 23, 24, 24]);

  const logEndRef = useRef(null);

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Helper to add logs
  const addLog = (level, source, text) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      ...prev,
      { id: Date.now() + Math.random(), time, level, source, text }
    ]);
  };

  // Main simulation tick loop
  useEffect(() => {
    if (speed === 0) return;

    const tickInterval = 3000 / speed;
    const interval = setInterval(() => {
      // 1. Fluctuating metrics
      const jobChange = Math.floor(Math.random() * 3) - 1;
      setActiveJobs(prev => Math.max(0, Math.min(15, prev + jobChange)));
      setEvalTime(prev => (prev + 1) % 60);

      // Latency calculation base on active model
      let baseLatency = 24;
      if (activeModel === 'dnn') baseLatency = 42;
      if (activeModel === 'rf') baseLatency = 16;
      if (activeModel === 'llm') baseLatency = 135;

      const nextLatency = Math.max(8, baseLatency + Math.floor(Math.random() * 6) - 3);
      setLatency(nextLatency);

      // Throughput
      const nextThroughput = Math.max(80, 140 + Math.floor(Math.random() * 24) - 12);
      setThroughput(nextThroughput);

      // Health
      const nextHealth = Math.min(100, Math.max(95, 99.75 + (Math.random() * 0.25) - 0.1));
      setSystemHealth(nextHealth);

      // 2. Add history points
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setHistoryData(prev => {
        const nextHist = [...prev, { time: timeStr, throughput: nextThroughput, latency: nextLatency }];
        if (nextHist.length > 15) nextHist.shift();
        return nextHist;
      });

      // Update sparklines
      setSparklineThroughput(prev => {
        const nextSpark = [...prev, nextThroughput];
        if (nextSpark.length > 10) nextSpark.shift();
        return nextSpark;
      });
      setSparklineLatency(prev => {
        const nextSpark = [...prev, nextLatency];
        if (nextSpark.length > 10) nextSpark.shift();
        return nextSpark;
      });

      // Update node loads/metrics
      setNodes(prevNodes => prevNodes.map(node => {
        if (node.status === 'Restarting') return node;

        let cpuChange = Math.floor(Math.random() * 12) - 6;
        let ramChange = Math.floor(Math.random() * 4) - 2;

        if (node.id === 'api') {
          return {
            ...node,
            sub: `${nextLatency}ms latency`,
            cpu: Math.min(90, Math.max(10, 24 + cpuChange)),
            ram: Math.min(85, Math.max(25, 42 + ramChange)),
          };
        }
        if (node.id === 'queue') {
          return {
            ...node,
            sub: `${activeJobs} pending jobs`,
            cpu: Math.min(90, Math.max(10, 15 + activeJobs * 4 + cpuChange)),
            ram: Math.min(85, Math.max(25, 31 + activeJobs * 2 + ramChange)),
          };
        }
        if (node.id === 'fastapi') {
          let modelName = 'SVM-Regressor';
          let loadMultiplier = 1;
          if (activeModel === 'dnn') { modelName = 'DNN-Classifier'; loadMultiplier = 1.4; }
          if (activeModel === 'rf') { modelName = 'Random-Forest'; loadMultiplier = 0.8; }
          if (activeModel === 'llm') { modelName = 'LLM-Orchestrator'; loadMultiplier = 2.2; }

          return {
            ...node,
            sub: `Model: ${modelName}`,
            cpu: Math.min(98, Math.max(20, Math.floor((55 + cpuChange) * loadMultiplier))),
            ram: Math.min(98, Math.max(30, Math.floor((72 + ramChange) * (1 + loadMultiplier * 0.1)))),
          };
        }

        return {
          ...node,
          cpu: Math.min(95, Math.max(5, node.cpu + cpuChange)),
          ram: Math.min(95, Math.max(5, node.ram + ramChange)),
        };
      }));

      // Random background events
      if (Math.random() > 0.7) {
        const backgroundLogs = [
          { level: 'INFO', src: 'MONGO_DB', txt: 'Read operations scaled. Cursor cache hits: 96.4%.' },
          { level: 'SUCCESS', src: 'HEALTHCHECK', txt: 'Automated cluster ping reports all 8 pods online.' },
          { level: 'INFO', src: 'SOCKETIO', txt: 'Active subscription connections synchronized successfully.' },
          { level: 'SUCCESS', src: 'API_GW', txt: 'Gateway rate limits cleared. No throttling actions active.' }
        ];
        const logItem = backgroundLogs[Math.floor(Math.random() * backgroundLogs.length)];
        addLog(logItem.level, logItem.src, logItem.txt);
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, [speed, activeModel, activeJobs, activeModel]);

  // Inject Custom Testing Event Package
  const handleInjectEvent = () => {
    const eventId = Date.now();
    const duration = 5000; // 5s travel duration

    // Path representing event loop sequence
    const eventPath = "M 80 80 L 260 80 L 440 80 L 620 80 L 800 80 L 800 240 L 440 240 L 140 240";
    
    const newInjection = {
      id: eventId,
      path: eventPath,
      color: '#B24DFF',
      dur: `${duration / 1000}s`
    };

    setInjections(prev => [...prev, newInjection]);
    addLog('SUCCESS', 'INJECTOR', 'Manual simulation event packet injected into Users Gateway.');

    // Event sequence log timers matching visually
    const segment = duration / 7;
    setTimeout(() => addLog('INFO', 'API_GW', 'API Gateway authenticated token. Packet relayed to Queue.'), segment * 1);
    setTimeout(() => addLog('INFO', 'QUEUE', 'Queue Scheduler popped packet. Delegating to evaluator...'), segment * 2);
    setTimeout(() => addLog('INFO', 'EVAL_WRK', 'Eval Task checks deadline deadlines. Triggering FastAPI SVM inference...'), segment * 3);
    setTimeout(() => addLog('SUCCESS', 'AI_ENGINE', `FastAPI SVM Inference completed in ${latency - 2}ms.`), segment * 4);
    setTimeout(() => addLog('SUCCESS', 'MONGO_DB', 'MongoDB persisted SVM model response metadata.'), segment * 5);
    setTimeout(() => addLog('INFO', 'WS_SYNC', 'WebSockets broadcast state modification success to front-ends.'), segment * 6);
    setTimeout(() => addLog('SUCCESS', 'EMAIL_DISP', 'Email Dispatcher dispatched completion receipts to owner.'), segment * 7);

    // Remove package when finished
    setTimeout(() => {
      setInjections(prev => prev.filter(inj => inj.id !== eventId));
    }, duration + 500);
  };

  // Restart Selected Node Action
  const handleRestartNode = (nodeId) => {
    const targetNode = nodes.find(n => n.id === nodeId);
    if (!targetNode) return;

    // Set node status to restarting
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          status: 'Restarting',
          cpu: 0,
          ram: 0,
          sub: 'Offline - Booting...'
        };
      }
      return node;
    }));

    addLog('WARNING', 'SYSTEM', `Initializing container reboot: Node ${targetNode.label}...`);

    setTimeout(() => {
      setNodes(prev => prev.map(node => {
        if (node.id === nodeId) {
          const original = initialNodes.find(inNode => inNode.id === nodeId);
          return {
            ...node,
            status: 'Healthy',
            cpu: original.cpu,
            ram: original.ram,
            sub: original.sub
          };
        }
        return node;
      }));
      addLog('SUCCESS', 'SYSTEM', `Node ${targetNode.label} recovered. Pod initialized successfully in 2.0s.`);
    }, 2000);
  };

  // Reset Metrics Action
  const handleResetMetrics = () => {
    addLog('WARNING', 'INJECTOR', 'Telemetry metrics cache cleared. Recalibrating chart...');
    setHistoryData([
      { time: 'Recal', throughput: 135, latency: 24 }
    ]);
  };

  // Selected node config details
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const selectedConfig = nodeConfigs[selectedNode.id] || { scaling: 2, threshold: 100 };

  const handleConfigChange = (key, value) => {
    setNodeConfigs(prev => ({
      ...prev,
      [selectedNode.id]: {
        ...prev[selectedNode.id],
        [key]: value
      }
    }));
  };

  // Filter & Search Logs logic
  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.text.toLowerCase().includes(logSearch.toLowerCase()) || 
                          l.source.toLowerCase().includes(logSearch.toLowerCase());
    const matchesFilter = logFilter === 'ALL' || l.level === logFilter;
    return matchesSearch && matchesFilter;
  });

  // SVG Line Path Helper
  const getLinePath = (key, color, maxVal) => {
    if (historyData.length === 0) return '';
    const width = 680;
    const height = 140;
    const padding = 12;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    
    const step = graphWidth / (historyData.length - 1 || 1);
    
    const coords = historyData.map((d, index) => {
      const x = padding + index * step;
      const val = d[key];
      const normalized = val / maxVal;
      const y = padding + graphHeight - (normalized * graphHeight);
      return `${x},${y}`;
    });

    return `M ${coords.join(' L ')}`;
  };

  // SVG Line Area Fill Path Helper
  const getLineAreaPath = (key, maxVal) => {
    if (historyData.length === 0) return '';
    const width = 680;
    const height = 140;
    const padding = 12;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    
    const step = graphWidth / (historyData.length - 1 || 1);
    
    const coords = historyData.map((d, index) => {
      const x = padding + index * step;
      const val = d[key];
      const normalized = val / maxVal;
      const y = padding + graphHeight - (normalized * graphHeight);
      return `${x},${y}`;
    });

    const startX = padding;
    const endX = padding + graphWidth;
    const bottomY = padding + graphHeight;

    return `M ${startX},${bottomY} L ${coords.join(' L ')} L ${endX},${bottomY} Z`;
  };

  // SVG Sparkline Path Helper
  const getSparklinePath = (data, maxVal) => {
    const width = 70;
    const height = 24;
    const step = width / (data.length - 1);
    const coords = data.map((val, idx) => {
      const x = idx * step;
      const y = height - (val / maxVal) * height;
      return `${x},${y}`;
    });
    return `M ${coords.join(' L ')}`;
  };

  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', paddingBottom: '32px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div className="page-title-group">
          <h1>AI Engine Operations</h1>
          <p>Autonomous monitoring & orchestrating pipeline. Observing live system event flows.</p>
        </div>
        
        {/* Speed & Control Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFFFF', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>SIM SPEED</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              onClick={() => setSpeed(0)} 
              style={{ background: speed === 0 ? '#1A1D20' : '#F4F6FA', color: speed === 0 ? '#FFFFFF' : '#6C7A87', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
            >
              PAUSE
            </button>
            <button 
              onClick={() => setSpeed(1)} 
              style={{ background: speed === 1 ? 'var(--primary)' : '#F4F6FA', color: speed === 1 ? '#FFFFFF' : '#6C7A87', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
            >
              1X
            </button>
            <button 
              onClick={() => setSpeed(2)} 
              style={{ background: speed === 2 ? 'var(--primary)' : '#F4F6FA', color: speed === 2 ? '#FFFFFF' : '#6C7A87', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
            >
              2X
            </button>
            <button 
              onClick={() => setSpeed(5)} 
              style={{ background: speed === 5 ? 'var(--primary)' : '#F4F6FA', color: speed === 5 ? '#FFFFFF' : '#6C7A87', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
            >
              5X
            </button>
          </div>
        </div>
      </div>

      {/* AI Telemetry KPIs Row */}
      <div className="ai-ops-kpis">
        {/* KPI 1: System Status */}
        <div className="premium-card ai-ops-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>SYSTEM HEALTH</span>
            <span className="pulse-dot" style={{ width: '8px', height: '8px' }} />
          </div>
          <div className="ai-ops-kpi-val-row">
            <span className="ai-ops-kpi-value">{systemHealth.toFixed(2)}%</span>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>ONLINE</span>
          </div>
        </div>

        {/* KPI 2: active model selection */}
        <div className="premium-card ai-ops-kpi-card">
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>ACTIVE MODEL</span>
          <div className="ai-ops-kpi-val-row" style={{ marginTop: '4px', width: '100%' }}>
            <select 
              value={activeModel}
              onChange={(e) => {
                setActiveModel(e.target.value);
                addLog('INFO', 'SYSTEM', `Changed active ML inference model to: ${e.target.value.toUpperCase()}`);
              }}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                backgroundColor: '#FAFBFD',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              <option value="svm">SVM Regressor v2.4 (Fast)</option>
              <option value="rf">Random Forest v3.1 (Nominal)</option>
              <option value="dnn">DNN Regressor v1.0 (Deep)</option>
              <option value="llm">LLM-Orchestrator v4.0 (Cognitive)</option>
            </select>
          </div>
        </div>

        {/* KPI 3: latency sparkline */}
        <div className="premium-card ai-ops-kpi-card">
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>AVG LATENCY</span>
          <div className="ai-ops-kpi-val-row">
            <span className="ai-ops-kpi-value">{latency}ms</span>
            <div className="ai-ops-kpi-sparkline">
              <svg width="70" height="24">
                <path 
                  d={getSparklinePath(sparklineLatency, 150)} 
                  fill="none" 
                  stroke="#B24DFF" 
                  strokeWidth="1.5" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 4: throughput sparkline */}
        <div className="premium-card ai-ops-kpi-card">
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>THROUGHPUT</span>
          <div className="ai-ops-kpi-val-row">
            <span className="ai-ops-kpi-value">{throughput} <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>req/s</span></span>
            <div className="ai-ops-kpi-sparkline">
              <svg width="70" height="24">
                <path 
                  d={getSparklinePath(sparklineThroughput, 250)} 
                  fill="none" 
                  stroke="#5B5FFB" 
                  strokeWidth="1.5" 
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Split Operations Grid */}
      <div className="ai-ops-grid">
        
        {/* Left column: SVG diagram & Chart */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Node Diagram Card */}
          <div className="premium-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>Live Node Processing Loop</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Visual pipeline event tracer. Click any node to load statistics & parameters.</p>
              </div>
              <button 
                onClick={handleInjectEvent}
                className="ai-ops-control-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Inject Event
              </button>
            </div>

            {/* Interactive SVG Diagram wrapper */}
            <div className="node-svg-container">
              <svg viewBox="0 0 900 320" width="100%" height="100%">
                <defs>
                  {/* Glow filter */}
                  <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  
                  {/* Gradient paths */}
                  <linearGradient id="bluePurple" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5B5FFB" />
                    <stop offset="100%" stopColor="#B24DFF" />
                  </linearGradient>
                  
                  <linearGradient id="purpleGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#B24DFF" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>

                {/* SVG Connections Paths */}
                {/* Gateway -> API */}
                <path d="M 150 80 L 190 80" stroke="#5B5FFB" strokeWidth="2.5" />
                {/* API -> Queue */}
                <path d="M 330 80 L 370 80" stroke="url(#bluePurple)" strokeWidth="2.5" />
                {/* Queue -> Eval */}
                <path d="M 510 80 L 550 80" stroke="#B24DFF" strokeWidth="2.5" />
                {/* Eval -> FastAPI */}
                <path d="M 690 80 L 730 80" stroke="url(#purpleGreen)" strokeWidth="2.5" />
                {/* FastAPI -> Mongo */}
                <path d="M 800 110 L 800 210" stroke="#10B981" strokeWidth="2.5" />
                {/* Mongo -> WS */}
                <path d="M 730 240 L 510 240" stroke="#10B981" strokeWidth="2.5" />
                {/* WS -> Email */}
                <path d="M 370 240 L 210 240" stroke="#FF7A00" strokeWidth="2.5" />
                {/* WS Loopback feedback to Gateway */}
                <path d="M 440 240 L 80 240 L 80 110" stroke="#5B5FFB" strokeWidth="2" strokeDasharray="3 3" />

                {/* Constant Background flows (dots repeating) */}
                <circle r="4.5" fill="#5B5FFB" filter="url(#nodeGlow)">
                  <animateMotion path="M 150 80 L 370 80" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle r="4.5" fill="#B24DFF" filter="url(#nodeGlow)">
                  <animateMotion path="M 370 80 L 730 80" dur="5s" repeatCount="indefinite" />
                </circle>
                <circle r="4.5" fill="#10B981" filter="url(#nodeGlow)">
                  <animateMotion path="M 800 110 L 800 210 L 510 240" dur="6s" repeatCount="indefinite" />
                </circle>

                {/* Custom injected events */}
                {injections.map(inj => (
                  <circle key={inj.id} r="6.5" fill={inj.color} filter="url(#nodeGlow)">
                    <animateMotion path={inj.path} dur={inj.dur} fill="freeze" repeatCount="1" />
                  </circle>
                ))}

                {/* Node visual elements */}
                {nodes.map(node => {
                  const isSelected = selectedNodeId === node.id;
                  const isRestarting = node.status === 'Restarting';
                  
                  return (
                    <g key={node.id} transform={`translate(${node.x - 70}, ${node.y - 30})`}>
                      {/* Rect card block */}
                      <rect 
                        width="140" 
                        height="60" 
                        rx="8" 
                        fill="#FFFFFF" 
                        stroke={isSelected ? 'var(--primary)' : 'var(--border-light)'}
                        strokeWidth={isSelected ? '2.5' : '1'}
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`node-card-rect ${isSelected ? 'selected' : ''}`}
                        style={{ filter: isSelected ? 'drop-shadow(0px 4px 10px rgba(91, 95, 251, 0.15))' : 'drop-shadow(0px 2px 5px rgba(0,0,0,0.02))' }}
                      />
                      
                      {/* Accent color bar */}
                      <rect width="4" height="60" rx="2" fill={isRestarting ? '#FBBF24' : node.color} />

                      {/* Status indicator mini dot */}
                      <circle 
                        cx="124" 
                        cy="16" 
                        r="3.5" 
                        fill={isRestarting ? '#F59E0B' : '#10B981'} 
                        className={isRestarting ? '' : 'countdown-seconds'} 
                      />

                      {/* Node Typography */}
                      <text x="12" y="20" fontSize="11" fontWeight="700" fill="var(--text-main)" style={{ pointerEvents: 'none' }}>
                        {node.label}
                      </text>
                      <text x="12" y="38" fontSize="9.5" fill="var(--text-muted)" fontWeight="500" style={{ pointerEvents: 'none' }}>
                        {node.sub}
                      </text>

                      {/* Mini Capacity Gauge */}
                      <rect x="12" y="47" width="116" height="3" rx="1.5" fill="#EAEFF5" style={{ pointerEvents: 'none' }} />
                      <rect 
                        x="12" 
                        y="47" 
                        width={isRestarting ? 0 : Math.floor(1.16 * node.cpu)} 
                        height="3" 
                        rx="1.5" 
                        fill={isRestarting ? '#FBBF24' : node.cpu > 80 ? '#EF4444' : node.color} 
                        style={{ pointerEvents: 'none', transition: 'width 0.5s ease-in-out' }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Telemetry charts card */}
          <div className="premium-card chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>Live Telemetry</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Throughput load vs. engine classification latency.</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#5B5FFB' }} />
                  Throughput (req/s)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#B24DFF' }} />
                  Latency (ms)
                </span>
                <button 
                  onClick={handleResetMetrics}
                  style={{ background: 'none', border: '1px solid var(--border-light)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  Clear Cache
                </button>
              </div>
            </div>

            {/* Custom Telemetry Chart Drawing using pure SVG paths */}
            <div style={{ position: 'relative', height: '140px', width: '100%', background: '#FAFCD', border: '1px dashed #ECEEF4', borderRadius: '8px', overflow: 'hidden' }}>
              <svg width="100%" height="100%" viewBox="0 0 680 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B5FFB" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#5B5FFB" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B24DFF" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#B24DFF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Graph gridlines */}
                <line x1="12" y1="35" x2="668" y2="35" stroke="#F1F3F7" strokeWidth="1" />
                <line x1="12" y1="70" x2="668" y2="70" stroke="#F1F3F7" strokeWidth="1" />
                <line x1="12" y1="105" x2="668" y2="105" stroke="#F1F3F7" strokeWidth="1" />

                {/* Graph Area Fills */}
                <path d={getLineAreaPath('throughput', 240)} fill="url(#throughputGrad)" />
                <path d={getLineAreaPath('latency', 200)} fill="url(#latencyGrad)" />

                {/* Graph Stroke Lines */}
                <path d={getLinePath('throughput', '#5B5FFB', 240)} fill="none" stroke="#5B5FFB" strokeWidth="2" />
                <path d={getLinePath('latency', '#B24DFF', 200)} fill="none" stroke="#B24DFF" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right column: Selected Node controls & logs terminal */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Selected Node Details Card */}
          <div className="premium-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                Selected Pod Configuration
              </h3>
              <span 
                className="badge" 
                style={{ 
                  backgroundColor: selectedNode.status === 'Restarting' ? '#FFEFC2' : 'var(--status-completed-bg)', 
                  color: selectedNode.status === 'Restarting' ? '#B7791F' : 'var(--status-completed-text)',
                  fontSize: '10px'
                }}
              >
                {selectedNode.status.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '8px', background: `${selectedNode.color}18`, color: selectedNode.color }}>
                {/* SVG Icon reflecting type */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{selectedNode.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedNode.type}</div>
              </div>
            </div>

            {/* Simulated Live CPU/RAM progress bars */}
            <div className="ai-ops-node-details">
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>CPU LOADING</span>
                  <span style={{ color: selectedNode.cpu > 85 ? '#EF4444' : 'var(--text-main)' }}>{selectedNode.cpu}%</span>
                </div>
                <div style={{ height: '6px', background: '#ECEEF4', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${selectedNode.cpu}%`, background: selectedNode.cpu > 85 ? '#EF4444' : 'var(--primary-gradient)', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>MEMORY OVERHEAD</span>
                  <span style={{ color: 'var(--text-main)' }}>{selectedNode.ram}%</span>
                </div>
                <div style={{ height: '6px', background: '#ECEEF4', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${selectedNode.ram}%`, background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            </div>

            {/* Adjustable Configuration parameters */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>DYNAMIC SCALING RATIO</span>
                  <span style={{ color: 'var(--text-main)' }}>{selectedConfig.scaling} Pods</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={selectedConfig.scaling}
                  onChange={(e) => handleConfigChange('scaling', parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>LATENCY ALERT TRIGGER</span>
                  <span style={{ color: 'var(--text-main)' }}>{selectedConfig.threshold}ms</span>
                </label>
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  step="10"
                  value={selectedConfig.threshold}
                  onChange={(e) => handleConfigChange('threshold', parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>
            </div>

            {/* Interactive Node Controls buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleRestartNode(selectedNode.id)}
                disabled={selectedNode.status === 'Restarting'}
                className="btn-secondary" 
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                Reboot Container
              </button>
              
              <button 
                onClick={() => {
                  addLog('INFO', selectedNode.id.toUpperCase(), `Forced model diagnostics re-evaluation on: ${selectedNode.label}.`);
                }}
                disabled={selectedNode.status === 'Restarting'}
                className="btn-gradient" 
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                Test Diagnostic
              </button>
            </div>
          </div>

          {/* Operations terminal-style Logs Box */}
          <div className="terminal-box">
            
            {/* Terminal Header */}
            <div className="terminal-header">
              <div className="terminal-title">
                <span className="pulse-dot" style={{ width: '6px', height: '6px', background: '#10B981' }} />
                ORCHESTRATOR PIPELINE LOGS
              </div>
              <input 
                type="text" 
                placeholder="Filter logs..." 
                className="terminal-search"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
              />
            </div>

            {/* Terminal Logs List */}
            <div className="terminal-logs">
              {filteredLogs.map(l => (
                <div key={l.id} className="terminal-row">
                  <div className="terminal-row-meta">
                    <span className="terminal-time">{l.time}</span>
                    <span className="terminal-source">[{l.source}]</span>
                    <span className={`terminal-badge terminal-badge-${l.level.toLowerCase()}`}>
                      {l.level}
                    </span>
                  </div>
                  <div className="terminal-message">{l.text}</div>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            {/* Terminal Filters bottom bar */}
            <div className="terminal-filters">
              {['ALL', 'SUCCESS', 'INFO', 'WARNING', 'ERROR'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  className={`terminal-filter-btn ${logFilter === filter ? 'active' : ''}`}
                >
                  {filter}
                </button>
              ))}
              <button 
                onClick={() => {
                  setLogs([]);
                  addLog('INFO', 'SYSTEM', 'Local operations terminal logs buffer cleared.');
                }}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6B7280', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                CLEAR
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
