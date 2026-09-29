import React from 'react';
import { X, Bell, Check, Clock, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { AppNotification } from '../../types';
import { store } from '../../services/store';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-full vesper-card border-l border-white/15 p-5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/15 text-white flex items-center justify-center shadow-md">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Transport Alerts
              </h3>
              <p className="text-[11px] text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread notices` : 'All notices up to date'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={() => store.markAllNotificationsRead()}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white text-xs hover:bg-white/10 flex items-center gap-1"
                title="Mark all as read"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => store.markNotificationRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-black/40 border-white/5 text-gray-400'
                    : 'bg-white/[0.08] border-white/20 text-white shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse flex-shrink-0" />
                    )}
                    <span className="text-white">{notif.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-white/10 text-center text-[11px] text-gray-400">
          Joy University Campus Broadcast Dispatcher
        </div>
      </div>
    </div>
  );
};
