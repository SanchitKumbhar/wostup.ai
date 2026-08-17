import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function useWorkspaceSocket(workspaceId, userId) {
  const [notifications, setNotifications] = useState([]);
  const [detectorAlerts, setDetectorAlerts] = useState({
    conflicts: [],
    overloads: [],
    stuckTasks: [],
  });
  const [updates, setUpdates] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Only connect if we have a valid workspaceId and a 24-char hex string userId (MongoDB ObjectId)
    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(userId);
    if (!workspaceId || !isValidMongoId) return;

    // Enforce pure WebSocket connection
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("🟢 [Socket Connected] ID:", socket.id);
      // Join workspace and user rooms
      console.log("[Socket Join Payload]", { userId, workspaceId });
      socket.emit("join", { userId, workspaceId });
    });

    socket.on("join_error", (err) => {
      console.error("🔴 [Socket Join Error]", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("🟡 [Socket Disconnected]", reason);
      setIsConnected(false);
    });

    // 1. General & AI Notifications
    socket.on("notification", (newNotification) => {
      console.log("🔔 [Real-Time Notification Received]", newNotification);
      setNotifications((prev) => [newNotification, ...prev]);
    });

    // 2. Conflict Detector Live Alert
    socket.on("detector:conflict_alert", (conflictData) => {
      setDetectorAlerts((prev) => ({
        ...prev,
        conflicts: [conflictData, ...prev.conflicts],
      }));
    });

    // 3. Overload Detector Live Alert
    socket.on("detector:overload_alert", (overloadData) => {
      setDetectorAlerts((prev) => ({
        ...prev,
        overloads: [overloadData, ...prev.overloads],
      }));
    });

    // 4. Stuck Task Live Alert
    socket.on("detector:stuck_task", (stuckData) => {
      setDetectorAlerts((prev) => ({
        ...prev,
        stuckTasks: [stuckData, ...prev.stuckTasks],
      }));
    });

    // 5. Workspace Activity Feed
    socket.on("workspace_update", (newUpdate) => {
      setUpdates((prev) => [newUpdate, ...prev]);
    });

    // 6. Online Presence Counter
    socket.on("online_count", (count) => {
      setOnlineCount(count);
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [workspaceId, userId]);

  // Read action
  const markAsRead = useCallback((notificationId) => {
    if (socketRef.current) {
      socketRef.current.emit("mark_notification_read", {
        notificationId,
        recipientUserId: userId,
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    }
  }, [userId]);

  // Trigger on-demand workspace conflict evaluation
  const triggerConflictScan = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("trigger_conflict_check", { workspaceId });
    }
  }, [workspaceId]);

  return {
    isConnected,
    notifications,
    detectorAlerts,
    updates,
    onlineCount,
    markAsRead,
    triggerConflictScan,
  };
}
