import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Inbox,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Moon,
  LogOut,
  User,
  HelpCircle,
  Building2,
} from 'lucide-react';

const navItems = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'applications', label: 'Applications', icon: LayoutDashboard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function RecruiterSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  activeView,
  onNavigate,
  user,
  onLogoutClick,
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onMobileClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen, onMobileClose]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileMenuOpen]);
