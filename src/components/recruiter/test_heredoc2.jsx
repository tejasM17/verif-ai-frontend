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
