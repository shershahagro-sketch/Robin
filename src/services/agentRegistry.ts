import { AgentDefinition, AgentDivisionHierarchy, AgentSubcategoryGroup } from '../types';
import { INITIAL_AGENTS } from '../data/initialState';

/**
 * Dynamic Agent Preset Packs for instant dynamic injection demonstration
 */
export const DYNAMIC_AGENT_PACKS: {
  id: string;
  name: string;
  division: string;
  description: string;
  agents: Omit<AgentDefinition, 'id' | 'enabled' | 'status' | 'executionsCount' | 'isDynamic' | 'registeredAt'>[];
}[] = [
  {
    id: 'pack-cloud-k8s',
    name: 'Cloud & Kubernetes Ops Pack',
    division: 'Developer',
    description: '10 dynamic sub-agents specialized in container orchestration, helm deployments, pod telemetry, and cloud IAM.',
    agents: [
      {
        name: 'Kubernetes Pod Sentinel',
        role: 'Kubelet Pod Health & CrashLoopBackOff Guard',
        category: 'Developer',
        subcategory: 'Containers & DevOps',
        description: 'Continuously queries kubectl pod metrics, diagnoses CrashLoopBackOff events, and triggers automated restarts.',
        tier: 'Tier 1 Autonomous',
        tags: ['k8s', 'cloud', 'devops', 'containers'],
        tools: ['kubectl CLI', 'Pod Restart Engine', 'Kubelet Health Check'],
      },
      {
        name: 'Helm Release Governor',
        role: 'Helm Chart Lifecycle & Rollback Manager',
        category: 'Developer',
        subcategory: 'Containers & DevOps',
        description: 'Validates chart values.yaml syntax, orchestrates atomic helm upgrades, and initiates automatic rollbacks on test failure.',
        tier: 'Tier 2 Semi-Autonomous',
        tags: ['helm', 'k8s', 'charts'],
        tools: ['Helm 3 Engine', 'Values Validator', 'Release Rollback'],
      },
      {
        name: 'Terraform State Auditor',
        role: 'IaC Drift Detector & State Sentinel',
        category: 'Developer',
        subcategory: 'Containers & DevOps',
        description: 'Detects cloud infrastructure drift between live GCP/AWS resources and committed Terraform state files.',
        tier: 'Tier 2 Semi-Autonomous',
        tags: ['terraform', 'iac', 'cloud'],
        tools: ['Terraform CLI', 'State File Parser', 'Drift Analyzer'],
      },
      {
        name: 'GCP Service Account Sieve',
        role: 'Least-Privilege Cloud IAM Guardian',
        category: 'Security',
        subcategory: 'Governance & Crypto',
        description: 'Audits over-privileged GCP IAM roles, detects unused service account keys, and recommends granular role bindings.',
        tier: 'Tier 1 Autonomous',
        tags: ['iam', 'gcp', 'security'],
        tools: ['IAM Policy Analyzer', 'Key Expiry Watcher', 'Role Binder'],
      },
      {
        name: 'Prometheus Alert Correlator',
        role: 'Real-time Metrics & Incident Triage',
        category: 'System',
        subcategory: 'Diagnostics & Hardware',
        description: 'De-duplicates firing Alertmanager notifications, groups root cause alerts, and links directly to Grafana dashboards.',
        tier: 'Tier 1 Autonomous',
        tags: ['prometheus', 'grafana', 'monitoring'],
        tools: ['Alertmanager API', 'PromQL Evaluator', 'Grafana Linker'],
      },
      {
        name: 'Kafka Stream Lag Watcher',
        role: 'Message Broker Partition Monitor',
        category: 'System',
        subcategory: 'Diagnostics & Hardware',
        description: 'Calculates consumer group lag across Kafka topics and signals auto-scaling triggers when backpressure builds.',
        tier: 'Tier 1 Autonomous',
        tags: ['kafka', 'streaming', 'queues'],
        tools: ['Kafka Admin Client', 'Lag Calculator', 'Consumer Scaler'],
      },
      {
        name: 'Redis Cache Memory Evictor',
        role: 'In-Memory Cache TTL & Maxmemory Tuner',
        category: 'System',
        subcategory: 'Diagnostics & Hardware',
        description: 'Monitors Redis memory fragmentation, identifies expired TTL leaks, and dynamically configures LRU eviction policies.',
        tier: 'Tier 2 Semi-Autonomous',
        tags: ['redis', 'cache', 'memory'],
        tools: ['Redis INFO Parser', 'BigKeys Scanner', 'Eviction Optimizer'],
      },
      {
        name: 'Nginx Ingress Rate Limiter',
        role: 'Edge Traffic Shaper & WAF Rules Engine',
        category: 'Network',
        subcategory: 'Routing & Tunnels',
        description: 'Applies dynamic burst rate limits on abusive client IP blocks and inspects HTTP headers for malformed request smuggling.',
        tier: 'Tier 1 Autonomous',
        tags: ['nginx', 'ingress', 'waf', 'rate-limit'],
        tools: ['Nginx Config Injector', 'IP Throttler', 'Smuggle Detector'],
      },
      {
        name: 'CI/CD Pipeline Accelerant',
        role: 'GitHub Actions Build Cache Optimizer',
        category: 'Developer',
        subcategory: 'Quality & Testing',
        description: 'Caches node_modules, Docker layer blobs, and cargo target files, cutting CI build latency by up to 60%.',
        tier: 'Tier 1 Autonomous',
        tags: ['cicd', 'github-actions', 'caching'],
        tools: ['Action Cache Manager', 'Layer Blob Pruner', 'Pipeline Profiler'],
      },
      {
        name: 'Chaos Engineering Sentry',
        role: 'Resilience Probe & Network Chaos Runner',
        category: 'Security',
        subcategory: 'Exploit & Malware',
        description: 'Simulates controlled network latency spikes, packet drops, and node termination to verify graceful failover handling.',
        tier: 'Tier 3 Supervised',
        tags: ['chaos', 'resilience', 'reliability'],
        tools: ['Chaos Mesh Injector', 'Packet Delayer', 'Failover Verifier'],
      },
    ],
  },
  {
    id: 'pack-pentest-redteam',
    name: 'Autonomous Cybersecurity & Red Team Pack',
    division: 'Security',
    description: '10 specialized offensive and defensive sub-agents for penetration testing, fuzzing, secret hunting, and network auditing.',
    agents: [
      {
        name: 'Nmap Port & Script Auditor',
        role: 'Comprehensive Network Surface Mapper',
        category: 'Security',
        subcategory: 'Network Defense',
        description: 'Runs automated NSE vulnerability scripts and syn scans across perimeter subnets, logging open administrative ports.',
        tier: 'Tier 2 Semi-Autonomous',
        tags: ['nmap', 'portscan', 'network', 'recon'],
        tools: ['Nmap NSE Engine', 'SYN Scanner', 'Banner Grabber'],
      },
      {
        name: 'Web Application Fuzzer',
        role: 'Dynamic URL & Parameter Fuzzer',
        category: 'Security',
        subcategory: 'Network Defense',
        description: 'Fuzzes web endpoints with edge payloads to detect path traversal, parameter tampering, and SSRF flaws.',
        tier: 'Tier 2 Semi-Autonomous',
        tags: ['fuzzing', 'web-security', 'owasp'],
        tools: ['ffuf Core', 'Wordlist Rotator', 'Anomaly Detector'],
      },
      {
        name: 'JWT Header & Signature Inspector',
        role: 'Cryptographic Token Security Auditor',
        category: 'Security',
        subcategory: 'Governance & Crypto',
        description: 'Validates JSON Web Token algorithm agility, none-algorithm vulnerabilities, and weak HMAC secret keys.',
        tier: 'Tier 1 Autonomous',
        tags: ['jwt', 'crypto', 'tokens', 'auth'],
        tools: ['JWT Decoder', 'Alg Agility Tester', 'Key Dictionary Matcher'],
      },
      {
        name: 'Git Secret Repo Sweeper',
        role: 'Pre-Commit & Historic Commit Scanner',
        category: 'Security',
        subcategory: 'Zero Trust & Access',
        description: 'Examines full git tree histories (including deleted commits) for accidentally committed private keys and OAuth secrets.',
        tier: 'Tier 1 Autonomous',
        tags: ['git', 'trufflehog', 'secrets'],
        tools: ['Git Commit Walker', 'Entropy Evaluator', 'TruffleHog Pattern'],
      },
      {
        name: 'CORS & CSP Policy Verifier',
        role: 'Browser Security Header Enforcer',
        category: 'Security',
        subcategory: 'Zero Trust & Access',
        description: 'Audits Content-Security-Policy directives, wildcard Access-Control-Allow-Origin headers, and frame-ancestors tags.',
        tier: 'Tier 1 Autonomous',
        tags: ['cors', 'csp', 'headers', 'browser'],
        tools: ['Header Inspector', 'CSP Evaluator', 'Origin Tester'],
      },
      {
        name: 'Subdomain Takeover Watcher',
        role: 'Dangling CNAME DNS Sentinel',
        category: 'Network',
        subcategory: 'DNS & Wi-Fi',
        description: 'Detects orphaned CNAME records pointing to unclaimed S3 buckets, GitHub Pages, or Azure endpoints.',
        tier: 'Tier 1 Autonomous',
        tags: ['dns', 'subdomain', 'cname'],
        tools: ['CNAME Resolver', 'Takeover Matcher', 'DNS Query Engine'],
      },
      {
        name: 'Active Directory Kerberos Guard',
        role: 'Kerberoasting & AS-REP Roast Auditor',
        category: 'Security',
        subcategory: 'Zero Trust & Access',
        description: 'Flags Service Principal Names (SPNs) with weak RC4 encryption susceptible to offline Kerberoasting password cracking.',
        tier: 'Tier 2 Semi-Autonomous',
        tags: ['active-directory', 'kerberos', 'windows'],
        tools: ['SPN Auditor', 'Ticket Verifier', 'Encryption Suite Checker'],
      },
      {
        name: 'Container Image CVE Scanner',
        role: 'Static Docker Base Image Inspector',
        category: 'Security',
        subcategory: 'Exploit & Malware',
        description: 'Performs static SBOM inspection of container root filesystems to highlight critical vulnerabilities prior to deployment.',
        tier: 'Tier 1 Autonomous',
        tags: ['trivy', 'docker', 'cve', 'sbom'],
        tools: ['Trivy Scanner', 'SBOM Generator', 'Vulnerability Matcher'],
      },
      {
        name: 'Phishing Email Header Forensic',
        role: 'SPF, DKIM & DMARC Forensic Agent',
        category: 'Security',
        subcategory: 'Governance & Crypto',
        description: 'Parses raw RFC 822 email headers, computes DKIM signature alignments, and verifies SPF host authorization.',
        tier: 'Tier 1 Autonomous',
        tags: ['email', 'dmarc', 'dkim', 'spf', 'phishing'],
        tools: ['RFC 822 Parser', 'DKIM Verifier', 'DMARC Lookup'],
      },
      {
        name: 'Endpoint Ransomware Canaries',
        role: 'Early Warning Filesystem Tripwire',
        category: 'Security',
        subcategory: 'Exploit & Malware',
        description: 'Plants encrypted canary decoy files in sensitive directories; immediately alerts if unexpected mass encryption begins.',
        tier: 'Tier 1 Autonomous',
        tags: ['ransomware', 'canary', 'tripwire', 'edr'],
        tools: ['Canary File Sentinel', 'Mass Write Interceptor', 'Process Freezing'],
      },
    ],
  },
];

type RegistryListener = (agents: AgentDefinition[]) => void;

/**
 * AgentRegistry: Central singleton managing the registry of all sub-agents,
 * dynamic runtime injection of 100+ agents, hierarchical categorization,
 * and subscription events.
 */
class AgentRegistry {
  private agentsMap: Map<string, AgentDefinition> = new Map();
  private listeners: Set<RegistryListener> = new Set();

  constructor() {
    this.initDefaultAgents();
  }

  /**
   * Initialize agents from default state
   */
  public initDefaultAgents(): void {
    this.agentsMap.clear();
    INITIAL_AGENTS.forEach((agent) => {
      // Ensure defaults for hierarchical fields
      const enriched: AgentDefinition = {
        ...agent,
        subcategory: agent.subcategory || this.deduceSubcategory(agent),
        tier: agent.tier || 'Tier 1 Autonomous',
        tags: agent.tags || [agent.category.toLowerCase(), 'orchestration'],
        isDynamic: false,
        registeredAt: Date.now(),
      };
      this.agentsMap.set(enriched.id, enriched);
    });
    this.notify();
  }

  /**
   * Helper to deduce subcategory if not explicitly configured
   */
  private deduceSubcategory(agent: AgentDefinition): string {
    const cat = agent.category;
    const name = agent.name.toLowerCase();

    if (cat === 'System') {
      if (name.includes('registry') || name.includes('driver') || name.includes('dll')) return 'Kernel & Registry';
      if (name.includes('service') || name.includes('task') || name.includes('daemon')) return 'Daemons & Tasks';
      if (name.includes('bsod') || name.includes('power') || name.includes('firmware') || name.includes('telemetry')) return 'Diagnostics & Hardware';
      return 'Memory & Sandboxing';
    }
    if (cat === 'Files') {
      if (name.includes('duplicate') || name.includes('junk') || name.includes('cache')) return 'Deduplication & Purge';
      if (name.includes('archive') || name.includes('iso')) return 'Compression & Packaging';
      if (name.includes('permission') || name.includes('shredder')) return 'Permissions & Shredding';
      return 'Sync & Metadata';
    }
    if (cat === 'Web') {
      if (name.includes('crawler') || name.includes('dom') || name.includes('rss')) return 'Crawling & Scraping';
      if (name.includes('cookie') || name.includes('ssl')) return 'Browser Security';
      if (name.includes('screenshot') || name.includes('pdf')) return 'Visual & Export';
      return 'APIs & Automation';
    }
    if (cat === 'Intelligence') {
      if (name.includes('token') || name.includes('context')) return 'Token & Context';
      if (name.includes('embedding') || name.includes('synthesizer') || name.includes('knowledge')) return 'Knowledge & Embeddings';
      if (name.includes('fact') || name.includes('query') || name.includes('sentiment')) return 'Fact & Quality';
      return 'Reasoning & Prompts';
    }
    if (cat === 'Developer') {
      if (name.includes('git') || name.includes('merge')) return 'Git & Version Control';
      if (name.includes('docker') || name.includes('build')) return 'Containers & DevOps';
      if (name.includes('package') || name.includes('linter') || name.includes('test')) return 'Quality & Testing';
      return 'Data & Regex';
    }
    if (cat === 'Security') {
      if (name.includes('gatekeeper') || name.includes('command') || name.includes('secret')) return 'Zero Trust & Access';
      if (name.includes('firewall') || name.includes('port') || name.includes('vpn')) return 'Network Defense';
      if (name.includes('exploit') || name.includes('malware')) return 'Exploit & Malware';
      return 'Governance & Crypto';
    }
    if (cat === 'Speech') {
      if (name.includes('saraiki') || name.includes('hindi') || name.includes('urdu') || name.includes('nlp')) return 'Multilingual NLP';
      if (name.includes('dsp') || name.includes('noise') || name.includes('echo')) return 'Acoustic DSP';
      if (name.includes('pitch') || name.includes('vad')) return 'Synthesis & VAD';
      return 'Sensors & Biometrics';
    }
    if (cat === 'Vision') {
      if (name.includes('ocr') || name.includes('qr') || name.includes('icon')) return 'OCR & Recognition';
      if (name.includes('geometry') || name.includes('monitor') || name.includes('element')) return 'Geometry & Topology';
      if (name.includes('contrast') || name.includes('dpi')) return 'Display & Accessibility';
      return 'Motion & Buffers';
    }
    if (cat === 'Network') {
      if (name.includes('latency') || name.includes('bandwidth') || name.includes('packet')) return 'Latency & Throughput';
      if (name.includes('dns') || name.includes('wifi') || name.includes('bluetooth')) return 'DNS & Wi-Fi';
      if (name.includes('proxy') || name.includes('ssh') || name.includes('nic')) return 'Routing & Tunnels';
      return 'Remote Power';
    }
    if (cat === 'Productivity') {
      if (name.includes('clipboard') || name.includes('snippet')) return 'Clipboard & Text';
      if (name.includes('calendar') || name.includes('email') || name.includes('meeting')) return 'Calendar & Comm';
      if (name.includes('focus') || name.includes('tile') || name.includes('workspace')) return 'Focus & Layout';
      return 'Automation & Alerts';
    }
    return 'General Core';
  }

  /**
   * Retrieve all registered agents in sorted order
   */
  public getAllAgents(): AgentDefinition[] {
    return Array.from(this.agentsMap.values());
  }

  /**
   * Find an agent by its unique identifier
   */
  public getAgentById(id: string): AgentDefinition | undefined {
    return this.agentsMap.get(id);
  }

  /**
   * Register or update a single agent
   */
  public registerAgent(agent: AgentDefinition, notify = true): void {
    const enriched: AgentDefinition = {
      ...agent,
      subcategory: agent.subcategory || this.deduceSubcategory(agent),
      tier: agent.tier || 'Tier 1 Autonomous',
      tags: agent.tags || [agent.category.toLowerCase(), 'sub-agent'],
      registeredAt: agent.registeredAt || Date.now(),
    };
    this.agentsMap.set(enriched.id, enriched);
    if (notify) this.notify();
  }

  /**
   * Register a batch of agents in bulk
   */
  public registerBatch(agents: AgentDefinition[]): void {
    agents.forEach((a) => {
      this.registerAgent(a, false);
    });
    this.notify();
  }

  /**
   * Unregister an agent by ID
   */
  public unregisterAgent(id: string): boolean {
    const deleted = this.agentsMap.delete(id);
    if (deleted) this.notify();
    return deleted;
  }

  /**
   * Dynamically inject a custom sub-agent
   */
  public injectDynamicAgent(draft: {
    name: string;
    role: string;
    category: string;
    subcategory?: string;
    description: string;
    tools?: string[];
    tier?: 'Tier 1 Autonomous' | 'Tier 2 Semi-Autonomous' | 'Tier 3 Supervised';
    tags?: string[];
  }): AgentDefinition {
    const id = `dynamic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newAgent: AgentDefinition = {
      id,
      name: draft.name.trim(),
      role: draft.role.trim(),
      category: draft.category || 'Developer',
      subcategory: draft.subcategory || 'Custom Automation',
      description: draft.description.trim(),
      enabled: true,
      status: 'idle',
      tools: draft.tools && draft.tools.length > 0 ? draft.tools : ['Dynamic Execution Sandbox', 'CLI Bridge'],
      executionsCount: 0,
      tier: draft.tier || 'Tier 1 Autonomous',
      tags: draft.tags && draft.tags.length > 0 ? draft.tags : ['dynamic', 'custom', draft.category.toLowerCase()],
      isDynamic: true,
      registeredAt: Date.now(),
    };

    this.registerAgent(newAgent, true);
    return newAgent;
  }

  /**
   * Inject a preset pack of sub-agents dynamically
   */
  public injectPresetPack(packId: string): AgentDefinition[] {
    const pack = DYNAMIC_AGENT_PACKS.find((p) => p.id === packId);
    if (!pack) return [];

    const injected: AgentDefinition[] = pack.agents.map((draft, idx) => {
      const id = `dynamic-${packId}-${idx + 1}-${Date.now()}`;
      return {
        ...draft,
        id,
        enabled: true,
        status: 'idle',
        executionsCount: Math.floor(Math.random() * 15) + 1,
        isDynamic: true,
        registeredAt: Date.now(),
      };
    });

    this.registerBatch(injected);
    return injected;
  }

  /**
   * Toggle agent enabled/disabled state
   */
  public toggleAgent(id: string): boolean {
    const agent = this.agentsMap.get(id);
    if (!agent) return false;
    agent.enabled = !agent.enabled;
    this.notify();
    return agent.enabled;
  }

  /**
   * Enable all registered agents
   */
  public enableAll(): void {
    this.agentsMap.forEach((agent) => {
      agent.enabled = true;
    });
    this.notify();
  }

  /**
   * Disable all registered agents
   */
  public disableAll(): void {
    this.agentsMap.forEach((agent) => {
      agent.enabled = false;
    });
    this.notify();
  }

  /**
   * Increment execution metric for an agent
   */
  public recordExecution(id: string): void {
    const agent = this.agentsMap.get(id);
    if (agent) {
      agent.executionsCount += 1;
      agent.status = 'executing';
      this.notify();

      setTimeout(() => {
        if (this.agentsMap.has(id)) {
          this.agentsMap.get(id)!.status = 'idle';
          this.notify();
        }
      }, 1500);
    }
  }

  /**
   * Build hierarchical taxonomy of divisions and subcategories
   */
  public getDivisionsHierarchy(): AgentDivisionHierarchy[] {
    const divisionMap = new Map<string, Map<string, string[]>>();

    this.agentsMap.forEach((agent) => {
      const div = agent.category || 'Other';
      const sub = agent.subcategory || 'General';

      if (!divisionMap.has(div)) {
        divisionMap.set(div, new Map());
      }
      const subMap = divisionMap.get(div)!;
      if (!subMap.has(sub)) {
        subMap.set(sub, []);
      }
      subMap.get(sub)!.push(agent.id);
    });

    const hierarchy: AgentDivisionHierarchy[] = [];
    divisionMap.forEach((subMap, division) => {
      let divisionTotal = 0;
      const subcategories: AgentSubcategoryGroup[] = [];

      subMap.forEach((agentIds, name) => {
        divisionTotal += agentIds.length;
        subcategories.push({
          name,
          count: agentIds.length,
          agentIds,
        });
      });

      subcategories.sort((a, b) => b.count - a.count);

      hierarchy.push({
        division,
        count: divisionTotal,
        subcategories,
      });
    });

    hierarchy.sort((a, b) => a.division.localeCompare(b.division));
    return hierarchy;
  }

  /**
   * Get operational statistics
   */
  public getStats(): {
    total: number;
    online: number;
    dynamic: number;
    totalExecutions: number;
    divisionCounts: Record<string, number>;
  } {
    let online = 0;
    let dynamic = 0;
    let totalExecutions = 0;
    const divisionCounts: Record<string, number> = {};

    this.agentsMap.forEach((a) => {
      if (a.enabled) online++;
      if (a.isDynamic) dynamic++;
      totalExecutions += a.executionsCount;
      divisionCounts[a.category] = (divisionCounts[a.category] || 0) + 1;
    });

    return {
      total: this.agentsMap.size,
      online,
      dynamic,
      totalExecutions,
      divisionCounts,
    };
  }

  /**
   * Export all agents as JSON manifest
   */
  public exportManifest(): string {
    return JSON.stringify(Array.from(this.agentsMap.values()), null, 2);
  }

  /**
   * Import agents from JSON string
   */
  public importManifest(jsonString: string): number {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        let count = 0;
        parsed.forEach((item) => {
          if (item.name && item.category) {
            const id = item.id || `imported-${Date.now()}-${count}`;
            this.registerAgent({
              ...item,
              id,
              enabled: item.enabled ?? true,
              status: 'idle',
              executionsCount: item.executionsCount || 0,
              tools: Array.isArray(item.tools) ? item.tools : ['Standard Tooling'],
              isDynamic: true,
              registeredAt: Date.now(),
            }, false);
            count++;
          }
        });
        this.notify();
        return count;
      }
      return 0;
    } catch {
      return 0;
    }
  }

  /**
   * Subscribe to registry updates
   */
  public subscribe(listener: RegistryListener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.getAllAgents());

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all registered listeners
   */
  private notify(): void {
    const list = this.getAllAgents();
    this.listeners.forEach((listener) => {
      try {
        listener(list);
      } catch (err) {
        console.error('AgentRegistry listener error:', err);
      }
    });
  }
}

// Export singleton instance
export const agentRegistry = new AgentRegistry();
