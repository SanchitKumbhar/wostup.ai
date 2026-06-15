import React, { useState } from 'react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I'm Wostup AI, your autonomous project operations assistant. I monitor your workspaces, evaluate deadlines, and balance workloads in real time. How can I assist you today?", time: '10:59 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    { label: 'Predict deadline failures', query: 'Do you predict any deadline failures in our active projects?' },
    { label: 'Detect workload imbalance', query: 'Is there any workload imbalance in the team?' },
    { label: 'Recommend reassignment', query: 'What task reassignment do you recommend to balance the load?' },
  ];

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let aiText;
      const query = textToSend.toLowerCase();

      if (query.includes('deadline') || query.includes('failure')) {
        aiText = "Based on current sprint velocity and resource availability, I predict that **Milestone Phase 2: Scalability Stress Test** for Project Phoenix has a 78% probability of delay. This is due to a bottleneck in DB schema migrations assigned to Sarah Chen, who is currently overloaded.";
      } else if (query.includes('workload') || query.includes('imbalance')) {
        aiText = "Yes, a workload imbalance has been detected. **Sarah Chen** is currently allocated at **96% (Load Score 4.8/5.0)** with 12 active tasks, while **James Wilson** is allocated at **42% (Load Score 2.1/5.0)** with 3 tasks. I recommend shifting some QA/Infrastructure support to James.";
      } else if (query.includes('reassign') || query.includes('recommend')) {
        aiText = "To balance the load, I recommend reassigning task **TSK-105: Implement socket.io for Notifications** from Sarah Chen to James Wilson. This action will reduce Sarah's utilization to a stable 3.9/5.0 (Optimal) and optimize overall sprint velocity by 8%.";
      } else {
        aiText = "I've analyzed your workspace configuration. The active databases are synchronous and health index is stable at 92%. Let me know if you would like me to evaluate sprint capacity or generate a risk mitigation report.";
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div className="page-title-group">
          <h1>Wostup AI Assistant</h1>
          <p>Interact with the autonomous engine to audit project risks, loads, and deadlocks.</p>
        </div>
      </div>

      {/* Split chat and explainability panel */}
      <div className="content-split" style={styles.contentSplit}>
        {/* Chat Section */}
        <div className="premium-card" style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <div style={styles.aiAvatarIcon}>🤖</div>
            <div>
              <div style={styles.aiName}>Wostup AI Orchestrator</div>
              <div style={styles.aiStatus}>Online • Monitoring Workspace</div>
            </div>
          </div>

          {/* Messages list */}
          <div style={styles.messagesList}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageItem,
                  alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
                }}
              >
                {msg.sender === 'ai' && <div style={styles.msgAvatar}>🤖</div>}
                <div style={{
                  ...styles.messageBubble,
                  backgroundColor: msg.sender === 'ai' ? '#F0F2FF' : '#5B5FFB',
                  color: msg.sender === 'ai' ? '#1A1D20' : '#FFFFFF',
                  borderRadius: msg.sender === 'ai' ? '12px 12px 12px 0' : '12px 12px 0 12px',
                }}>
                  <p style={styles.messageText} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  <span style={{
                    ...styles.messageTime,
                    color: msg.sender === 'ai' ? '#9AA6B2' : 'rgba(255,255,255,0.7)',
                  }}>{msg.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ ...styles.messageItem, alignSelf: 'flex-start' }}>
                <div style={styles.msgAvatar}>🤖</div>
                <div style={{ ...styles.messageBubble, backgroundColor: '#F0F2FF', color: '#6C7A87' }}>
                  <span>Wostup AI is evaluating metrics...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Prompts */}
          <div style={styles.suggestionsRow}>
            {suggestedPrompts.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSend(s.query)}
                className="suggestion-chip"
                style={styles.suggestionBtn}
              >
                💡 {s.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div style={styles.inputForm}>
            <input
              type="text"
              placeholder="Ask anything about task health, deadlines, or capacity..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              className="chat-input-field"
              style={styles.chatInput}
            />
            <button
              onClick={() => handleSend(inputText)}
              className="btn-gradient"
              style={styles.sendBtn}
            >
              Send
            </button>
          </div>
        </div>

        {/* Explainability Sidebar */}
        <div className="premium-card" style={styles.explainPanel}>
          <h3 style={styles.panelTitle}>AI Explainability Panel</h3>
          <p style={styles.panelSubtitle}>Underlying triggers behind Wostup AI recommendations</p>

          <div style={styles.explainSection}>
            <div style={styles.explainHeader}>
              <span style={styles.explainDot} />
              Deadlock Evaluation
            </div>
            <div style={styles.explainBody}>
              Triggers: Velocity threshold drop &lt; 85%. Overlapping assignee milestones detected in: <strong>Cloud Migration - Phase 2</strong>.
            </div>
          </div>

          <div style={styles.explainSection}>
            <div style={styles.explainHeader}>
              <span style={{ ...styles.explainDot, backgroundColor: '#FF7A00' }} />
              Capacity Limits
            </div>
            <div style={styles.explainBody}>
              Workloads exceeding 4.0 load score automatically trigger reassignment prompts. Sarah Chen is at 4.8.
            </div>
          </div>

          <div style={styles.explainSection}>
            <div style={styles.explainHeader}>
              <span style={{ ...styles.explainDot, backgroundColor: '#10B981' }} />
              Active Models
            </div>
            <div style={styles.explainBody}>
              FASTAPI Orchestrator running SVM/Gradient Boosting on historical velocity datasets. Health checks refresh every 60s.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  contentSplit: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1fr',
    gap: '24px',
    flex: 1,
    overflow: 'hidden',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    padding: '20px',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '16px',
    borderBottom: '1px solid #ECEEF4',
  },
  aiAvatarIcon: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    backgroundColor: '#F0F2FF',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1A1D20',
  },
  aiStatus: {
    fontSize: '12px',
    color: '#10B981',
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messageItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    maxWidth: '75%',
  },
  msgAvatar: {
    fontSize: '14px',
    width: '24px',
    height: '24px',
    backgroundColor: '#E6ECFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4px',
    flexShrink: 0,
  },
  messageBubble: {
    padding: '12px 16px',
    fontSize: '13.5px',
    lineHeight: '1.4',
    position: 'relative',
  },
  messageText: {
    margin: 0,
  },
  messageTime: {
    display: 'block',
    fontSize: '9px',
    textAlign: 'right',
    marginTop: '4px',
  },
  suggestionsRow: {
    display: 'flex',
    gap: '10px',
    padding: '10px 0',
    flexWrap: 'wrap',
  },
  suggestionBtn: {
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    color: '#6C7A87',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  inputForm: {
    borderTop: '1px solid #ECEEF4',
    paddingTop: '16px',
    display: 'flex',
    gap: '12px',
  },
  chatInput: {
    flex: 1,
    border: '1px solid #ECEEF4',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '13.5px',
    backgroundColor: '#FAFCFF',
  },
  sendBtn: {
    padding: '0 24px',
  },
  explainPanel: {
    padding: '20px',
    height: '100%',
    overflowY: 'auto',
  },
  panelTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '4px',
  },
  panelSubtitle: {
    fontSize: '11px',
    color: '#9AA6B2',
    lineHeight: '1.4',
    marginBottom: '20px',
  },
  explainSection: {
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '16px',
  },
  explainHeader: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1A1D20',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  explainDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#5B5FFB',
  },
  explainBody: {
    fontSize: '12px',
    color: '#6C7A87',
    lineHeight: '1.4',
  },
};
