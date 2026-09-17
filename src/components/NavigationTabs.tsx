import React from 'react';
import {
  LayoutDashboard,
  Bot,
  FolderTree,
  Workflow,
  Wrench,
  Palette,
  Clock,
  Settings,
  Download,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { sounds } from '../services/soundEffects';

export type ActiveTab =
  | 'dashboard'
  | 'agents'
  | 'files'
  | 'workflows'
  | 'tools'
  | 'themes'
  | 'history'
  | 'desktop'
  | 'settings';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentTheme: ThemeConfig;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  currentTheme,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'agents', label: 'Multi-Agents', icon: <Bot className="w-4 h-4" /> },
    { id: 'files', label: 'File Explorer', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'workflows', label: 'Command Builder', icon: <Workflow className="w-4 h-4" /> },
    { id: 'tools', label: 'Tool Manager', icon: <Wrench className="w-4 h-4" /> },
    { id: 'themes', label: 'Theme Engine', icon: <Palette className="w-4 h-4" /> },
    { id: 'history', label: 'History & Memory', icon: <Clock className="w-4 h-4" /> },
    { id: 'desktop', label: 'Windows Setup.exe', icon: <Download className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Wizard', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <nav
      id="robin-navigation-tabs"
      className="w-full border-b backdrop-blur-md px-4 flex items-center gap-1 overflow-x-auto font-mono text-xs z-10"
      style={{
        backgroundColor: `${currentTheme.bgBase}cc`,
        borderColor: currentTheme.panelBorder,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => {
              sounds.playClick();
              onSelectTab(tab.id as ActiveTab);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'text-white border-sky-400 bg-sky-500/10'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
            }`}
            style={{
              borderBottomColor: isActive ? currentTheme.primaryColor : 'transparent',
              color: isActive ? currentTheme.primaryColor : undefined,
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
