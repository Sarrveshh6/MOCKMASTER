import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NOTIFICATION_TYPES, useNotifications } from '../context/NotificationContext';
import { X, ClipboardCheck, FileText, Trophy, Info } from 'lucide-react';

const typeMeta = {
  [NOTIFICATION_TYPES.TEST_GENERATED]: { label: 'Test', icon: ClipboardCheck, color: '#FCEB7B' },
  [NOTIFICATION_TYPES.QUESTION_PAPER]: { label: 'Question paper', icon: FileText, color: '#A0FF9C' },
  [NOTIFICATION_TYPES.RANK]: { label: 'Rank', icon: Trophy, color: '#F0A6CA' },
  [NOTIFICATION_TYPES.SYSTEM]: { label: 'Update', icon: Info, color: '#bde0ff' },
};

function formatTime(ts) {
  const d = new Date(ts);
  const now = Date.now();
  const diff = Math.floor((now - ts) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

const NotificationPanel = ({ open, onClose, anchorRef }) => {
  const navigate = useNavigate();
  const { items, markRead, markAllRead, clearAll } = useNotifications();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (anchorRef?.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: 0,
        width: 'min(380px, calc(100vw - 32px))',
        maxHeight: 'min(70vh, 480px)',
        backgroundColor: '#fff',
        border: '3px solid #000',
        borderRadius: '14px',
        boxShadow: '8px 8px 0 #000',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '3px solid #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'linear-gradient(135deg, #fff8e7 0%, #f0f6ff 100%)',
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em' }}>Notifications</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.65, marginTop: '2px' }}>
            Tests, papers, ranks & updates
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {items.some((n) => !n.read) && (
            <button
              type="button"
              onClick={markAllRead}
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                border: '2px solid #000',
                borderRadius: '8px',
                padding: '4px 8px',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              Read all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            style={{
              border: '2px solid #000',
              borderRadius: '8px',
              padding: '6px',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        {items.length === 0 ? (
          <div style={{ padding: '28px 16px', textAlign: 'center', fontWeight: 700, opacity: 0.55 }}>
            No notifications yet. Generate a test or upload a PDF to see updates here.
          </div>
        ) : (
          items.map((n) => {
            const meta = typeMeta[n.type] || typeMeta[NOTIFICATION_TYPES.SYSTEM];
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  markRead(n.id);
                  if (n.link) navigate(n.link);
                  onClose();
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  marginBottom: '8px',
                  border: '2px solid #000',
                  borderRadius: '10px',
                  backgroundColor: n.read ? '#fafafa' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  boxShadow: n.read ? 'none' : '3px 3px 0 #000',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '2px solid #000',
                    backgroundColor: meta.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {meta.label}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.5 }}>{formatTime(n.createdAt)}</span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', marginTop: '4px', lineHeight: 1.25 }}>{n.title}</div>
                  {n.body && (
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, marginTop: '6px', lineHeight: 1.35 }}>
                      {n.body}
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {items.length > 0 && (
        <div style={{ padding: '10px 12px', borderTop: '2px solid #000', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => {
              clearAll();
              onClose();
            }}
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              border: '2px solid #000',
              borderRadius: '8px',
              padding: '6px 12px',
              background: '#ff5c5c',
              color: '#000',
              cursor: 'pointer',
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
