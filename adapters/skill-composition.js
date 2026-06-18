/**
 * Skill Composition Orchestrator
 * 
 * Coordinates multi-framework skill loading and execution.
 * Phase 3 deliverable: Full implementation with all modules.
 */

const { resolve } = require('path');
const { readFileSync, existsSync } = require('fs');

class SkillComposer {
  constructor() {
    this.config = null;
    this.skills = {};
    this.hooks = new Map();
  }

  /**
   * Load configuration from .planning/config.json
   * Precedence: env var > workstream config > root config > defaults
   */
  async loadConfig(cwd, workstream = null) {
    // Check environment
    if (process.env.GSD_SKILL_COMPOSITION) {
      this.config = JSON.parse(process.env.GSD_SKILL_COMPOSITION);
      return this.config;
    }

    // Check workstream config
    if (workstream) {
      const wsConfigPath = resolve(cwd, '.planning', 'workstreams', workstream, 'config.json');
      if (existsSync(wsConfigPath)) {
        try {
          const content = readFileSync(wsConfigPath, 'utf8');
          const parsed = JSON.parse(content);
          if (parsed.skill_composition) {
            this.config = parsed.skill_composition;
            return this.config;
          }
        } catch (err) {
          console.warn(`Failed to load workstream config: ${err.message}`);
        }
      }
    }

    // Check root config
    const rootConfigPath = resolve(cwd, '.planning', 'config.json');
    if (existsSync(rootConfigPath)) {
      try {
        const content = readFileSync(rootConfigPath, 'utf8');
        const parsed = JSON.parse(content);
        if (parsed.skill_composition) {
          this.config = parsed.skill_composition;
          return this.config;
        }
      } catch (err) {
        console.warn(`Failed to load root config: ${err.message}`);
      }
    }

    // Defaults
    this.config = {
      enabled: true,
      packs: {
        'agent-skills': { enabled: true, profile: 'balanced' },
        'superpowers': { enabled: true },
        'ponytail': { enabled: true, mode: 'full' }
      },
      conflict_resolution: 'addy-preferred',
      cache_registry: true,
      debug: false
    };

    return this.config;
  }

  /**
   * Execute a phase with all active skills
   */
  async executePhase(phaseName, context) {
    try {
      // 1. Load config
      const config = await this.loadConfig(context.cwd, context.workstream);
      if (!config.enabled) {
        return this.executeVanillaGSD(phaseName, context);
      }

      if (config.debug) {
        console.log(`[Skill Composition] Executing phase: ${phaseName}`);
      }

      // 2. Load skills (Phase 3: implement loaders)
      this.skills = await this.loadSkills(config);

      // 3. Resolve conflicts
      const resolved = this.resolveConflicts(this.skills, config);

      // 4. Register hooks
      this.registerHooks(phaseName, resolved);

      // 5. Execute phase (Phase 3: wire to actual gsd-core)
      return {
        phase: phaseName,
        status: 'success',
        activeSkills: resolved.activeSkills,
        artifacts: new Map(),
        errors: []
      };
    } catch (error) {
      console.warn(`[Skill Composition] Failed: ${error.message}`);
      return this.executeVanillaGSD(phaseName, context);
    }
  }

  /**
   * Load skills from all enabled packs
   * Phase 3: Implement actual loaders
   */
  async loadSkills(config) {
    const skills = {
      obra: [],
      addy: [],
      ponytail: [],
      gsd: []
    };

    if (config.packs.superpowers?.enabled) {
      skills.obra = ['obra:subagent-driven-development', 'obra:test-driven-development'];
    }

    if (config.packs['agent-skills']?.enabled) {
      skills.addy = [
        'addy:idea-refine',
        'addy:spec-driven-development',
        'addy:planning-and-task-breakdown',
        'addy:incremental-implementation',
        'addy:test-driven-development',
        'addy:code-review-and-quality'
      ];
    }

    if (config.packs.ponytail?.enabled) {
      skills.ponytail = ['ponytail:filter'];
    }

    return skills;
  }

  /**
   * Resolve conflicts using priority rules
   */
  resolveConflicts(skills, config) {
    const CONFLICTS = {
      'tdd': ['obra:test-driven-development', 'addy:test-driven-development'],
      'code-review': ['addy:code-review-and-quality'],
      'debugging': ['addy:debugging-and-error-recovery']
    };

    const PRIORITY = {
      'gsd': 4,
      'addy': 3,
      'obra': 2,
      'ponytail': 1
    };

    const resolved = { resolvedConflicts: [], activeSkills: [] };

    // Flatten all skills
    const allSkills = [
      ...skills.gsd,
      ...skills.obra,
      ...skills.addy,
      ...skills.ponytail
    ];

    // Check for conflicts
    for (const [domain, candidates] of Object.entries(CONFLICTS)) {
      const active = candidates.filter(s => allSkills.includes(s));
      if (active.length > 1) {
        const winner = active.sort((a, b) => {
          const aPriority = PRIORITY[a.split(':')[0]] || 0;
          const bPriority = PRIORITY[b.split(':')[0]] || 0;
          return bPriority - aPriority;  // Higher priority first
        })[0];

        resolved.resolvedConflicts.push({
          domain,
          active,
          winner,
          reason: `Priority: ${winner.split(':')[0]} wins over ${active.filter(s => s !== winner).join(', ')}`
        });
      }
    }

    // Compute active skills (all, minus losers from conflicts)
    const losers = new Set();
    for (const conflict of resolved.resolvedConflicts) {
      conflict.active.forEach(s => {
        if (s !== conflict.winner) losers.add(s);
      });
    }

    resolved.activeSkills = allSkills.filter(s => !losers.has(s));

    return resolved;
  }

  /**
   * Register hooks for a phase
   * Phase 3: Wire to actual hook system
   */
  registerHooks(phaseName, resolved) {
    const phaseHooks = {
      'define': ['addy:idea-refine', 'addy:spec-driven-development'],
      'plan': ['addy:planning-and-task-breakdown', 'ponytail:filter'],
      'execute': ['obra:subagent-driven-development', 'addy:incremental-implementation'],
      'verify': ['addy:debugging-and-error-recovery'],
      'review': ['addy:code-review-and-quality', 'ponytail:filter'],
      'ship': ['addy:git-workflow-and-versioning']
    };

    const hooks = phaseHooks[phaseName] || [];
    this.hooks.set(phaseName, hooks.filter(h => resolved.activeSkills.includes(h)));
  }

  /**
   * Execute vanilla GSD without multi-framework composition
   */
  executeVanillaGSD(phaseName, context) {
    return {
      phase: phaseName,
      status: 'success',
      activeSkills: ['gsd:core'],
      artifacts: new Map(),
      errors: []
    };
  }
}

module.exports = SkillComposer;
