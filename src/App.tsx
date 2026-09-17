import React, { useState, useEffect, useCallback } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { SidebarActivityLogs } from './components/SidebarActivityLogs';
import { CommandCenterModal } from './components/CommandCenterModal';
import { ConfirmationDialog } from './components/ConfirmationDialog';

import { DashboardView } from './components/views/DashboardView';
import { AgentsView } from './components/views/AgentsView';
import { FilesView } from './components/views/FilesView';
import { WorkflowsView } from './components/views/WorkflowsView';
import { ToolsView } from './components/views/ToolsView';
import { ThemesView } from './components/views/ThemesView';
import { HistoryMemoryView } from './components/views/HistoryMemoryView';
import { DesktopAppView } from './components/views/DesktopAppView';
import { SettingsWizardView } from './components/views/SettingsWizardView';

import {
  RobinState,
  VoicePersonality,
  ThemeConfig,
  SystemTelemetry,
  LogEntry,
  CommandItem,
  AgentDefinition,
  ToolDefinition,
  VirtualFile,
  CustomWorkflow,
  MemoryItem,
  ToolPermission,
  SupportedLanguage,
} from './types';

import {
  PRESET_THEMES,
  INITIAL_AGENTS,
  INITIAL_TOOLS,
  INITIAL_FILES,
  INITIAL_WORKFLOWS,
  INITIAL_MEMORIES,
} from './data/initialState';
import { getLanguageConfig } from './data/languages';

import { sounds } from './services/soundEffects';
import { voiceEngine } from './services/voiceEngine';
import { agentRegistry } from './services/agentRegistry';

export default function App() {
  // Core State
  const [robinState, setRobinState] = useState<RobinState>('IDLE');
  const [statusText, setStatusText] = useState<string>('Online and ready.');
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [personality, setPersonality] = useState<VoicePersonality>('Futuristic');
  const [language, setLanguage] = useState<SupportedLanguage>('en-US');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [emergencyStopped, setEmergencyStopped] = useState<boolean>(false);

  // Theme & Navigation
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(PRESET_THEMES[0]); // Cyber
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>(PRESET_THEMES);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Security confirmation state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionName: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    actionName: '',
    onConfirm: () => {},
  });

  // Entities & Collections
  const [agents, setAgents] = useState<AgentDefinition[]>(() => agentRegistry.getAllAgents());
  const [tools, setTools] = useState<ToolDefinition[]>(INITIAL_TOOLS);
  const [files, setFiles] = useState<VirtualFile[]>(INITIAL_FILES);
  const [workflows, setWorkflows] = useState<CustomWorkflow[]>(INITIAL_WORKFLOWS);
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);

  // Subscribe to central Agent Registry changes
  useEffect(() => {
    const unsubscribe = agentRegistry.subscribe((updated) => {
      setAgents(updated);
    });
    return unsubscribe;
  }, []);

  // Command History & Logs
  const [commandHistory, setCommandHistory] = useState<CommandItem[]>([
    {
      id: 'cmd-init-1',
      command: 'Check system status',
      intent: 'SYSTEM_STATUS',
      tool: 'System Telemetry',
      agent: 'System Agent',
      status: 'SUCCESS',
      timestamp: '11:05:22',
      durationSec: 0.12,
      voiceResponse: 'System telemetry nominal. CPU at 18%, 14 Cores active, RAM 42% utilized.',
      favorite: true,
    },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: '11:00:00',
      category: 'SYSTEM',
      title: 'ROBIN JARVIS Core Initialized',
      message: 'Autonomous Windows command center kernel online. Wake word "Robin" armed.',
      level: 'info',
    },
    {
      id: 'log-2',
      timestamp: '11:00:02',
      category: 'SECURITY',
      title: 'Safety Gate Armed',
      message: 'Zero-silent-destruction policy active. High-risk operations require explicit human consent.',
      level: 'info',
    },
  ]);

  // Telemetry State
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    cpuUsagePercent: 18,
    cpuCores: 14,
    cpuModel: 'Intel Core i9-13900K @ 5.40 GHz',
    ramUsagePercent: 42,
    ramUsedGB: '13.4',
    ramTotalGB: '32.0',
    gpu: 'NVIDIA GeForce RTX 4090 (24GB VRAM)',
    gpuUsagePercent: 24,
    gpuTempC: 48,
    diskUsagePercent: 38,
    diskUsedGB: 760,
    diskTotalGB: 2000,
    networkStatus: 'ONLINE • High Speed Wi-Fi 6E',
    batteryPercent: 100,
    batteryCharging: true,
    activeApps: [
      { name: 'chrome.exe', pid: 14208, memMB: 840, cpuPercent: 3.2, status: 'running' },
      { name: 'code.exe', pid: 9812, memMB: 610, cpuPercent: 1.8, status: 'running' },
      { name: 'spotify.exe', pid: 21044, memMB: 280, cpuPercent: 0.4, status: 'running' },
      { name: 'wt.exe (Terminal)', pid: 7840, memMB: 120, cpuPercent: 0.1, status: 'running' },
      { name: 'taskmgr.exe', pid: 5612, memMB: 95, cpuPercent: 0.8, status: 'running' },
    ],
  });

  // Logging Helper
  const addLog = useCallback(
    (category: LogEntry['category'], title: string, message: string, level: LogEntry['level'] = 'info', details?: any) => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLogs((prev) => [
        {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: timeStr,
          category,
          title,
          message,
          level,
          details,
        },
        ...prev.slice(0, 150),
      ]);
    },
    []
  );

  // Poll server telemetry
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          setTelemetry((prev) => ({
            ...prev,
            ...data,
            activeApps: data.activeApps || prev.activeApps,
          }));
        }
      } catch (err) {
        // Local simulation fallback
        setTelemetry((prev) => ({
          ...prev,
          cpuUsagePercent: Math.floor(Math.random() * 15) + 12,
          ramUsagePercent: Math.floor(Math.random() * 6) + 40,
        }));
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  // Emergency Stop Trigger
  const triggerEmergencyStop = useCallback(() => {
    sounds.playEmergencyStop();
    setEmergencyStopped(true);
    setRobinState('WARNING');
    setStatusText('EMERGENCY STOP TRIGGERED. All automation halted.');
    addLog('SECURITY', 'EMERGENCY STOP TRIGGERED', 'Global safety halt executed via hotkey/button.', 'warn');
  }, [addLog]);

  const resetEmergencyStop = useCallback(() => {
    sounds.playSuccessTone();
    setEmergencyStopped(false);
    setRobinState('IDLE');
    setStatusText('Ready and waiting for directives.');
    addLog('SECURITY', 'Emergency Latch Reset', 'Automation subsystems cleared and re-armed.', 'info');
  }, [addLog]);

  // Command Execution Engine
  const executeCommand = useCallback(
    async (commandText: string) => {
      if (!commandText.trim()) return;

      if (emergencyStopped) {
        sounds.playErrorChime();
        addLog('SECURITY', 'Execution Blocked', 'Command rejected: Emergency Stop latch is currently engaged.', 'warn');
        return;
      }

      const startTime = performance.now();
      const lower = commandText.toLowerCase().trim();
      addLog('VOICE', `Directive Received: "${commandText}"`, `Received natural language command from user.`);

      // Check for destructive commands requiring high-risk confirmation
      if (
        lower.includes('delete') ||
        lower.includes('remove folder') ||
        lower.includes('format') ||
        lower.includes('kill all')
      ) {
        setRobinState('WARNING');
        sounds.playErrorChime();
        setConfirmModal({
          isOpen: true,
          title: 'High-Risk Operation Safety Barrier',
          message: `ROBIN detected a potentially destructive command: "${commandText}". Deletion or forced termination may cause permanent data loss.`,
          actionName: commandText,
          onConfirm: () => {
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            proceedWithExecution(commandText, startTime, true);
          },
        });
        return;
      }

      // Safe command: proceed immediately
      proceedWithExecution(commandText, startTime, false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [emergencyStopped, addLog, personality, workflows, files]
  );

  const proceedWithExecution = async (commandText: string, startTime: number, isConfirmedHighRisk: boolean) => {
    setRobinState('THINKING');
    setStatusText(`Reasoning: "${commandText}"...`);
    addLog('INTENT', 'Decomposing Intent', `Evaluating tool permissions and parameters for "${commandText}"`);

    // Check custom workflows first (e.g. "start work", "clean system")
    const matchedWf = workflows.find((w) => w.enabled && commandText.toLowerCase().includes(w.trigger.toLowerCase()));
    if (matchedWf) {
      setRobinState('EXECUTING');
      addLog('TOOL', `Triggered Workflow: ${matchedWf.name}`, `Executing ${matchedWf.actions.length} sequential steps.`);

      for (let i = 0; i < matchedWf.actions.length; i++) {
        const step = matchedWf.actions[i];
        addLog('EXECUTION', `Step ${i + 1}/${matchedWf.actions.length}`, `Running ${step.name} via ${step.tool}...`);
        await new Promise((r) => setTimeout(r, Math.min(step.delayMs, 500)));
      }

      const duration = Number(((performance.now() - startTime) / 1000).toFixed(2));
      const respMsg = `Custom workflow "${matchedWf.name}" completed successfully. All ${matchedWf.actions.length} steps executed.`;

      finalizeCommandResult(commandText, 'WORKFLOW_CHAIN', 'Sequence Runner', 'Task Agent', respMsg, duration);
      return;
    }

    // Call server parsing API
    try {
      const response = await fetch('/api/parse-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandText, personality, language }),
      });

      if (response.ok) {
        const data = await response.json();
        setRobinState('EXECUTING');
        addLog('TOOL', `Tool Invocation: ${data.tool}`, `Parameters dispatched: ${JSON.stringify(data.parameters || {})}`);
        await new Promise((r) => setTimeout(r, 400));

        const duration = Number(((performance.now() - startTime) / 1000).toFixed(2));
        finalizeCommandResult(
          commandText,
          data.intent || 'GENERAL_COMMAND',
          data.tool || 'Application Manager',
          data.agent || 'PC Agent',
          data.voiceResponse || `Command executed: ${commandText}`,
          duration
        );
        return;
      }
    } catch (err) {
      console.warn('Server parse fallback triggered:', err);
    }

    // Local heuristic execution fallback
    const duration = Number(((performance.now() - startTime) / 1000).toFixed(2));
    let tool = 'Application Manager';
    let agent = 'PC Agent';
    let intent = 'APP_LAUNCH';
    let resp = `Executed command: ${commandText}`;

    const l = commandText.toLowerCase();
    if (l.includes('chrome') || l.includes('browser')) {
      resp = 'Google Chrome launched with default developer profile.';
    } else if (l.includes('cpu') || l.includes('ram') || l.includes('status')) {
      tool = 'System Telemetry';
      agent = 'System Agent';
      intent = 'SYSTEM_STATUS';
      resp = `System telemetry: CPU is at ${telemetry.cpuUsagePercent}%, RAM utilization is at ${telemetry.ramUsagePercent}%. All cores stable.`;
    } else if (l.includes('create') && l.includes('folder')) {
      tool = 'File Controller';
      agent = 'File Agent';
      intent = 'FILE_CREATE';
      resp = `Created new directory in workspace path.`;
    } else if (l.includes('screenshot')) {
      tool = 'Screen Capture';
      agent = 'PC Agent';
      intent = 'SCREENSHOT';
      resp = `Desktop screenshot captured and saved to Pictures\\Screenshots.`;
    } else if (l.includes('terminal') || l.includes('cmd')) {
      resp = `Windows Terminal initialized.`;
    }

    finalizeCommandResult(commandText, intent, tool, agent, resp, duration);
  };

  const finalizeCommandResult = (
    command: string,
    intent: string,
    tool: string,
    agent: string,
    voiceResponse: string,
    durationSec: number
  ) => {
    sounds.playExecutionWhoosh();
    addLog('RESULT', `Execution Success (${durationSec}s)`, voiceResponse);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const newItem: CommandItem = {
      id: `cmd-${Date.now()}`,
      command,
      intent,
      tool,
      agent,
      status: 'SUCCESS',
      timestamp: timeStr,
      durationSec,
      voiceResponse,
    };

    setCommandHistory((prev) => [newItem, ...prev.slice(0, 50)]);

    // Voice response output
    setRobinState('SPEAKING');
    setStatusText(voiceResponse);

    voiceEngine.speak(
      voiceResponse,
      personality,
      () => {
        setRobinState('IDLE');
        setStatusText('Ready for next directive.');
      }
    );
  };

  // Language Change Handler
  const handleLanguageChange = useCallback(
    (newLang: SupportedLanguage) => {
      setLanguage(newLang);
      voiceEngine.setLanguage(newLang);
      const cfg = getLanguageConfig(newLang);
      addLog('VOICE', `Voice Language Switched: ${cfg.name} (${cfg.nativeName})`, `Recognition & synthesis configured to ${newLang}`);

      // Provide quick spoken confirmation in the newly selected language
      let greeting = `Voice engine configured for English.`;
      if (newLang === 'skr-PK') {
        greeting = `روبن سرائیکی آواز فعال تھی گئی اے۔ فرماؤ، میں تہاڈی کیا مدد کر سکدا ہاں؟`;
      } else if (newLang === 'hi-IN') {
        greeting = `रॉबिन हिन्दी वॉइस एक्टिवेटेड। कहिए, मैं आपकी क्या सहायता कर सकता हूँ?`;
      } else if (newLang === 'ur-PK') {
        greeting = `روبن اردو وائس ایکٹیویٹ ہو گئی ہے۔ حکم کیجیے، میں آپ کی کیا مدد کر سکتا ہوں؟`;
      }

      voiceEngine.speak(greeting, personality, () => {
        setRobinState('IDLE');
      });
    },
    [addLog, personality]
  );

  // Voice Listening Toggle
  const toggleListening = useCallback(() => {
    if (isListening) {
      voiceEngine.stopListening();
      setIsListening(false);
      setRobinState('IDLE');
      setStatusText('Voice listening paused.');
      addLog('VOICE', 'Microphone Paused', 'Continuous wake-word detection deactivated.');
    } else {
      sounds.playWakeChime();
      setIsListening(true);
      setRobinState('LISTENING');
      voiceEngine.setLanguage(language);
      const cfg = getLanguageConfig(language);
      setStatusText(`Listening in ${cfg.name} (${cfg.nativeName}). Say "${cfg.wakeWords[0]}" or your command...`);
      addLog('VOICE', 'Listening Armed', `Microphone active in ${cfg.name}. Awaiting wake word or speech.`);

      voiceEngine.startListening(
        (transcript: string, isFinal: boolean) => {
          setTranscriptText(transcript);
          if (isFinal) {
            sounds.playSuccessTone();
            executeCommand(transcript);
          }
        },
        () => {
          sounds.playWakeChime();
          setRobinState('LISTENING');
          setStatusText(`Wake word detected in ${cfg.name}!`);
          addLog('VOICE', 'Wake Word Acknowledged', 'Trigger keyword recognized.');
        },
        (error: any) => {
          console.warn('Voice error:', error);
          setIsListening(false);
          setRobinState('IDLE');
        }
      );
    }
  }, [isListening, language, addLog, executeCommand]);

  // Global Keyboard Shortcuts (Ctrl+Space for Palette, Ctrl+Shift+Esc for Emergency Stop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Emergency stop: Ctrl + Shift + Esc
      if (e.ctrlKey && e.shiftKey && e.key === 'Escape') {
        e.preventDefault();
        triggerEmergencyStop();
        return;
      }

      // Command Center: Ctrl + Space
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        sounds.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Escape closes palette
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerEmergencyStop, isCommandPaletteOpen]);

  // File Actions
  const handleCreateFile = (name: string, content: string) => {
    const ext = name.split('.').pop() || 'txt';
    const newFile: VirtualFile = {
      id: `f-${Date.now()}`,
      name,
      path: `C:\\Users\\Robin\\Documents\\${name}`,
      type: 'file',
      extension: ext,
      sizeBytes: content.length,
      sizeFormatted: `${(content.length / 1024).toFixed(1)} KB`,
      content,
      modified: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setFiles((prev) => [newFile, ...prev]);
    addLog('TOOL', `File Created: ${name}`, `Written to C:\\Users\\Robin\\Documents\\${name}`);
  };

  const handleDeleteFileRequest = (file: VirtualFile) => {
    setRobinState('WARNING');
    sounds.playErrorChime();
    setConfirmModal({
      isOpen: true,
      title: 'Confirm File Removal',
      message: `You are requesting permanent deletion of "${file.name}" (${file.path}). This operation will remove the file from virtual storage.`,
      actionName: `Delete ${file.name}`,
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
        sounds.playSuccessTone();
        setRobinState('IDLE');
        addLog('TOOL', `File Deleted: ${file.name}`, `File permanently unlinked from drive.`, 'warn');
      },
    });
  };

  return (
    <div
      id="robin-root-shell"
      className="flex flex-col h-screen w-screen overflow-hidden select-none transition-colors duration-500"
      style={{
        backgroundColor: currentTheme.bgBase,
        color: currentTheme.textBase,
      }}
    >
      {/* Top Header Bar */}
      <HeaderBar
        robinState={robinState}
        personality={personality}
        onPersonalityChange={setPersonality}
        language={language}
        onLanguageChange={handleLanguageChange}
        isListening={isListening}
        onToggleListening={toggleListening}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          sounds.setEnabled(next);
        }}
        onOpenCommandCenter={() => setIsCommandPaletteOpen(true)}
        onEmergencyStop={triggerEmergencyStop}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentTheme={currentTheme}
        availableThemes={availableThemes}
        onSelectTheme={(id) => {
          const found = availableThemes.find((t) => t.id === id);
          if (found) setCurrentTheme(found);
        }}
        onOpenSettings={() => setActiveTab('settings')}
        emergencyStopped={emergencyStopped}
        onResetEmergency={resetEmergencyStop}
      />

      {/* Navigation Sub-Tabs */}
      <NavigationTabs activeTab={activeTab} onSelectTab={setActiveTab} currentTheme={currentTheme} />

      {/* Main Content & Activity Sidebar Split */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Active View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300">
          {activeTab === 'dashboard' && (
            <DashboardView
              robinState={robinState}
              statusText={statusText}
              transcriptText={transcriptText}
              isListening={isListening}
              onToggleListening={toggleListening}
              telemetry={telemetry}
              currentTheme={currentTheme}
              recentCommands={commandHistory}
              onExecuteCommand={executeCommand}
              onEmergencyStop={triggerEmergencyStop}
              onOpenCommandCenter={() => setIsCommandPaletteOpen(true)}
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          )}

          {activeTab === 'agents' && (
            <AgentsView
              agents={agents}
              onToggleAgent={(id) => {
                agentRegistry.toggleAgent(id);
              }}
              onExecuteAgentTest={(agentName) => {
                executeCommand(`Test ${agentName} diagnostic cycle`);
              }}
              onInjectAgent={(draft) => {
                const newAgent = agentRegistry.injectDynamicAgent(draft);
                addLog('SYSTEM', 'Dynamic Agent Injected', `Sub-agent "${newAgent.name}" registered to division ${newAgent.category}.`, 'success');
              }}
              onInjectPack={(packId) => {
                const list = agentRegistry.injectPresetPack(packId);
                addLog('SYSTEM', 'Batch Pack Injected', `Deployed ${list.length} dynamic sub-agents to registry.`, 'success');
              }}
              onDeleteDynamicAgent={(id) => {
                agentRegistry.unregisterAgent(id);
                addLog('SYSTEM', 'Agent Ejected', 'Dynamic sub-agent removed from runtime kernel.', 'warn');
              }}
              onResetAgents={() => {
                agentRegistry.initDefaultAgents();
                addLog('SYSTEM', 'Registry Restored', 'Reset agent registry to baseline initial configuration.', 'info');
              }}
              currentTheme={currentTheme}
            />
          )}

          {activeTab === 'files' && (
            <FilesView
              files={files}
              currentTheme={currentTheme}
              onCreateFile={handleCreateFile}
              onCreateFolder={(folderName) => {
                const newFolder: VirtualFile = {
                  id: `f-${Date.now()}`,
                  name: folderName,
                  path: `C:\\Users\\Robin\\Documents\\${folderName}`,
                  type: 'folder',
                  sizeBytes: 0,
                  sizeFormatted: '0 Items',
                  modified: new Date().toISOString().slice(0, 16).replace('T', ' '),
                };
                setFiles((prev) => [newFolder, ...prev]);
                addLog('TOOL', `Folder Created: ${folderName}`, `New folder initialized.`);
              }}
              onDeleteRequest={handleDeleteFileRequest}
              onOrganizeDownloads={() => {
                executeCommand('Organize downloads folder by file extensions');
              }}
              onFindLargeFiles={() => {
                executeCommand('Scan drive for files consuming over 100MB disk space');
              }}
            />
          )}

          {activeTab === 'workflows' && (
            <WorkflowsView
              workflows={workflows}
              currentTheme={currentTheme}
              onExecuteWorkflow={(wf) => executeCommand(wf.trigger)}
              onCreateWorkflow={(wf) => {
                setWorkflows((prev) => [wf, ...prev]);
                addLog('TOOL', `Custom Command Registered: "${wf.trigger}"`, `Created workflow ${wf.name}`);
              }}
              onDeleteWorkflow={(id) => {
                setWorkflows((prev) => prev.filter((w) => w.id !== id));
              }}
            />
          )}

          {activeTab === 'tools' && (
            <ToolsView
              tools={tools}
              currentTheme={currentTheme}
              onToggleTool={(id) => {
                setTools((prev) =>
                  prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
                );
              }}
              onChangePermission={(id, perm: ToolPermission) => {
                setTools((prev) =>
                  prev.map((t) => (t.id === id ? { ...t, permission: perm } : t))
                );
                addLog('SECURITY', `Permission Updated`, `Tool ${id} permission set to ${perm}`);
              }}
              onTestTool={(toolName) => {
                executeCommand(`Test execution of ${toolName}`);
              }}
            />
          )}

          {activeTab === 'themes' && (
            <ThemesView
              currentTheme={currentTheme}
              availableThemes={availableThemes}
              onSelectTheme={(id) => {
                const found = availableThemes.find((t) => t.id === id);
                if (found) setCurrentTheme(found);
              }}
              onUpdateCustomTheme={(newTheme) => {
                setCurrentTheme(newTheme);
                setAvailableThemes((prev) => {
                  const filtered = prev.filter((t) => t.id !== newTheme.id);
                  return [...filtered, newTheme];
                });
              }}
            />
          )}

          {activeTab === 'history' && (
            <HistoryMemoryView
              commandHistory={commandHistory}
              memories={memories}
              currentTheme={currentTheme}
              onExecuteCommand={executeCommand}
              onToggleFavorite={(id) => {
                setCommandHistory((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))
                );
              }}
              onClearHistory={() => {
                setCommandHistory([]);
                addLog('SYSTEM', 'Command History Cleared', 'Cleared historical traces.');
              }}
              onSaveMemory={(key, value, category) => {
                const newMem: MemoryItem = {
                  id: `mem-${Date.now()}`,
                  category,
                  key,
                  value,
                  updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
                };
                setMemories((prev) => [newMem, ...prev]);
                addLog('SYSTEM', `Memory Stored: [${category}] ${key}`, value);
              }}
              onDeleteMemory={(id) => {
                setMemories((prev) => prev.filter((m) => m.id !== id));
              }}
              onClearAllMemories={() => {
                setMemories([]);
                addLog('SYSTEM', 'Memory Vault Purged', 'All context wiped.', 'warn');
              }}
            />
          )}

          {activeTab === 'desktop' && <DesktopAppView currentTheme={currentTheme} />}

          {activeTab === 'settings' && (
            <SettingsWizardView
              currentTheme={currentTheme}
              personality={personality}
              onPersonalityChange={setPersonality}
              language={language}
              onLanguageChange={handleLanguageChange}
              onSelectTheme={(id) => {
                const found = availableThemes.find((t) => t.id === id);
                if (found) setCurrentTheme(found);
              }}
              soundEnabled={soundEnabled}
              onToggleSound={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                sounds.setEnabled(next);
              }}
              onResetToDefaults={() => {
                setCurrentTheme(PRESET_THEMES[0]);
                setPersonality('Futuristic');
                setLanguage('en-US');
                voiceEngine.setLanguage('en-US');
                setAgents(INITIAL_AGENTS);
                setTools(INITIAL_TOOLS);
                setFiles(INITIAL_FILES);
                setWorkflows(INITIAL_WORKFLOWS);
                addLog('SYSTEM', 'Factory Reset Applied', 'Reset all preferences to defaults.');
              }}
            />
          )}
        </main>

        {/* Live Activity Sidebar */}
        {!sidebarCollapsed && (
          <SidebarActivityLogs
            logs={logs}
            currentTheme={currentTheme}
            onClearLogs={() => setLogs([])}
            onClose={() => setSidebarCollapsed(true)}
          />
        )}
      </div>

      {/* Command Center Slide Palette (Ctrl+Space) */}
      <CommandCenterModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onExecuteCommand={executeCommand}
        isListening={isListening}
        onToggleListening={toggleListening}
        currentTheme={currentTheme}
        recentCommands={commandHistory.map((c) => c.command)}
        language={language}
      />

      {/* Security Barrier Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        actionName={confirmModal.actionName}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          setRobinState('IDLE');
          setStatusText('Operation cancelled by user.');
        }}
        currentTheme={currentTheme}
      />
    </div>
  );
}
