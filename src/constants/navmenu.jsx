import {
  Heart, Droplets, Bell,
  Home, User, Settings
} from "lucide-react";
export const NAV_MENU = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { id: 'requestsList', label: 'Blood Requests', path: '/requests', icon: <Droplets size={18} /> },
    { id: 'donorSearch', label: 'Donors', path: '/donors', icon: <Heart size={18} /> },
    { id: 'notifications', label: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
    { id: 'myProfile', label: 'My Profile', path: '/profile', icon: <User size={18} /> },
    { id: 'settings', label: 'Settings', path: '/settings', icon: <Settings size={18} /> }
  ];