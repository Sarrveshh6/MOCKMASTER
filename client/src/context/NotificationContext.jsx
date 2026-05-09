import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const MAX_ITEMS = 50;

export const NOTIFICATION_TYPES = {
  TEST_GENERATED: 'test_generated',
  QUESTION_PAPER: 'question_paper',
  RANK: 'rank',
  SYSTEM: 'system',
};

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user?._id ? `mockmaster_notifications_${user._id}` : 'mockmaster_notifications_guest';

  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      /* ignore quota */
    }
  }, [items, storageKey]);

  const addNotification = useCallback(
    ({ type = NOTIFICATION_TYPES.SYSTEM, title, body, link = null }) => {
      if (!title) return;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const entry = {
        id,
        type,
        title,
        body: body || '',
        link,
        read: false,
        createdAt: Date.now(),
      };
      setItems((prev) => [entry, ...prev].slice(0, MAX_ITEMS));
    },
    []
  );

  const markRead = useCallback((id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const value = useMemo(
    () => ({
      items,
      unreadCount,
      addNotification,
      markRead,
      markAllRead,
      clearAll,
    }),
    [items, unreadCount, addNotification, markRead, markAllRead, clearAll]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
}
