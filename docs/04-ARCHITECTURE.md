# Multi-Framework Skill Composition Architecture

**Target Audience:** Developers, architects  
**Purpose:** How the composition engine works internally  
**Version:** 1.0  

---

## System Overview

```
┌───────────────────────────────────────────────────────────────┐
│  GSD-Core Session Start                                       │
│  (/gsd:session-start)                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Load Config     │
                    │ .planning/...   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐     ┌────────▼────────┐   ┌──────▼──────┐
   │ Obra      │     │ Addy            │   │ Ponytail    │
   │ Loader    │     │ Loader          │   │ Loader      │
   └────┬─────┘     └────────┬────────┘   └──────┬──────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                 ┌───────────▼───────────┐
                 │ Conflict Resolver     │
                 │ (apply priority rules)│
                 └───────────┬───────────┘
                             │
                 ┌───────────▼───────────┐
                 │ Capability Registry   │
                 │ (union of skills)     │
                 └───────────┬───────────┘
                             │
                 ┌───────────▼───────────┐
                 │ Hook Registration     │
                 │ (per-phase hooks)     │
                 └───────────┬───────────┘
                             │
                 ┌───────────▼───────────┐
                 │ Ready to Execute      │
                 │ (all skills active)   │
                 └───────────────────────┘
```

---

## Core Modules

### 1. SkillComposer (Main Orchestrator)

**File:** `adapters/skill-composition.js`  
**Responsibility:** Orchestrate phase execution with composed skills

```javascript
class SkillComposer {
  // Load config from .planning/config.json
  async loadConfig(cwd) {
    const config = readFileSync(join(cwd, '.planning/config.json'));
    return JSON.parse(config).skill_composition;
  }

  // Execute a phase with all active skills
  async executePhase(phaseName, context) {
    // 1. Load config
    const config = await this.loadConfig(context.cwd);
    if (!config.enabled) return this.executeVanillaGSD(phaseName, context);

    // 2. Load skill packs
    const skills = {
      obra: await this.loadObra(config.packs.superpowers),
      addy: await this.loadAddy(config.packs['agent-skills']),
      ponytail: await this.loadPonytail(config.packs.ponytail)
    };

    // 3. Resolve conflicts
    const resolved = this.resolver.resolveConflicts(skills, config);

    // 4. Register hooks
    this.registerHooks(phaseName, resolved);

    // 5. Execute phase
    return this.executeGSDPhase(phaseName, context, resolved);
  }

  // Register hooks for a specific phase
  registerHooks(phaseName, skills) {
    const hooks = this.hookMap[phaseName];
    for (const hook of hooks) {
      if (skills.activeHooks.includes(hook)) {
        this.registerHook(hook, skills[hook]);
      }
    }
  }
}
```

**Interface:**

```typescript
interface SkillComposerContext {
  cwd: string;          // Working directory
  phase: string;        // Phase name
  phaseNumber: number;  // Phase ID (1-6)
  args: string[];       // CLI arguments
}

interface ExecutePhaseResult {
  phase: string;
  status: 'success' | 'error' | 'blocked';
  activeSkills: string[];
  artifacts: Map<string, string>;  // filename -> path
  errors: string[];
}
```

---

### 2. ConflictResolver

**File:** `adapters/conflict-resolver.js`  
**Responsibility:** Detect & resolve skill conflicts using priority rules

```javascript
class ConflictResolver {
  // Known conflicts from Phase 1 matrix
  CONFLICTS = {
    'tdd': ['obra:test-driven-development', 'addy:test-driven-development'],
    'code-review': ['gsd:code-review', 'obra:requesting-code-review', 'addy:code-review-and-quality'],
    'debugging': ['obra:systematic-debugging', 'addy:debugging-and-error-recovery']
  };

  // Priority order: gsd > addy > obra > ponytail
  PRIORITY = {
    'gsd': 4,
    'addy': 3,
    'obra': 2,
    'ponytail': 1
  };

  async resolveConflicts(skills, config) {
    const conflicts = this.detectConflicts(skills);
    const resolved = {};

    for (const conflict of conflicts) {
      const winner = this.applyPriorityRules(conflict, config);
      resolved[conflict.domain] = winner;
      
      this.logResolution(conflict, winner);
    }

    return {
      ...skills,
      resolvedConflicts: resolved,
      activeHooks: this.computeActiveHooks(skills, resolved)
    };
  }

  // Detect overlapping skills
  detectConflicts(skills) {
    const conflicts = [];
    
    for (const [domain, candidates] of Object.entries(this.CONFLICTS)) {
      const active = candidates.filter(skill => skills.includes(skill));
      if (active.length > 1) {
        conflicts.push({ domain, candidates: active });
      }
    }
    
    return conflicts;
  }

  // Apply priority rules
  applyPriorityRules(conflict, config) {
    const strategy = config.conflict_resolution || 'addy-preferred';
    
    // Sort by priority
    const sorted = conflict.candidates.sort(
      (a, b) => this.PRIORITY[a.split(':')[0]] - this.PRIORITY[b.split(':')[0]]
    );

    const winner = sorted[0];  // Highest priority wins
    
    return {
      domain: conflict.domain,
      winner,
      losers: sorted.slice(1),
      reason: `Priority: ${this.getPriorityReason(winner)}`
    };
  }
}
```

**Interface:**

```typescript
interface ConflictResolution {
  domain: string;              // 'tdd', 'code-review', 'debugging'
  winner: string;              // 'addy:test-driven-development'
  losers: string[];            // ['obra:test-driven-development']
  reason: string;              // 'Priority: addy (3) > obra (2)'
}

interface ResolvedSkillSet {
  obra: string[];
  addy: string[];
  ponytail: string[];
  gsd: string[];
  resolvedConflicts: ConflictResolution[];
  activeHooks: string[];
}
```

---

### 3. Skill Loaders (Adapters)

#### ObrasSkillsLoader

```javascript
class ObrasSkillsLoader {
  async load(config) {
    const obras = require('@obra/superpowers');
    
    if (!config.enabled) return [];
    
    // If specific skills requested, filter; else load all
    const requested = config.skills || Object.keys(obras);
    
    return requested.map(skill => ({
      name: `obra:${skill}`,
      skill: obras[skill],
      phase: this.skillToPhase(skill)
    }));
  }

  // Map skill name to gsd phase
  skillToPhase(skillName) {
    const mapping = {
      'brainstorming': 'define',
      'writing-plans': 'plan',
      'subagent-driven-development': 'execute',
      'systematic-debugging': 'verify',
      'requesting-code-review': 'review',
      'using-git-worktrees': 'ship'
    };
    return mapping[skillName] || 'cross-cutting';
  }
}
```

#### AddySkillsLoader

```javascript
class AddySkillsLoader {
  async load(config) {
    const addy = require('@addyosmani/agent-skills');
    
    const profile = config.profile || 'balanced';
    const skillSet = this.profileToSkillSet(profile);
    
    return skillSet.map(skill => ({
      name: `addy:${skill}`,
      skill: addy[skill],
      phase: this.skillToPhase(skill),
      personas: config.personas || []  // For code review
    }));
  }

  profileToSkillSet(profile) {
    const profiles = {
      'minimal': [
        'planning-and-task-breakdown',
        'test-driven-development',
        'code-review-and-quality'
      ],
      'balanced': [
        // Core
        'idea-refine',
        'spec-driven-development',
        'planning-and-task-breakdown',
        'incremental-implementation',
        'test-driven-development',
        'browser-testing-with-devtools',
        'debugging-and-error-recovery',
        'code-review-and-quality'
        // Security + perf
        'security-and-hardening',
        'performance-optimization'
      ],
      'comprehensive': Object.keys(require('@addyosmani/agent-skills'))
    };
    return profiles[profile];
  }
}
```

#### PonytailLoader

```javascript
class PonytailLoader {
  async load(config) {
    if (!config.enabled || config.mode === 'off') return [];
    
    const ponytail = require('@DietrichGebert/ponytail');
    
    return [{
      name: 'ponytail:filter',
      skill: ponytail.createFilter(config.mode),
      phase: 'cross-cutting',  // Post-execution filter
      mode: config.mode,
      applyAfter: config.apply_after || ['execute-phase']
    }];
  }
}
```

---

## Hook System Integration

### Hook Points by Phase

```
define:start
  ↓ [addy:interview-me]
  ↓ [addy:idea-refine]
  ↓ [obra:brainstorming] (optional)
define:end

plan:start
  ↓ [addy:planning-and-task-breakdown]
  ↓ [addy:spec-driven-development]
  ↓ [ponytail:filter] (if enabled)
plan:end

execute:start
  ↓ [gsd:dispatch-waves]
  ↓ [addy:incremental-setup]
execute:wave-N
  ↓ [gsd:execute-task]
  ↓ [addy:tactical-guidance]
execute:post
  ↓ [obra:subagent-driven-review]
  ↓ [addy:doubt-driven-review]
  ↓ [ponytail:filter] (if enabled)
execute:end

verify:start
  ↓ [gsd:test-adequacy-gate]
  ↓ [addy:browser-testing]
  ↓ [addy:debugging] (if failures)
verify:end

review:start
  ↓ [gsd:code-review-gate]
  ↓ [addy:code-review-5axis]
  ↓ [addy:personas-specialist]
  ↓ [addy:code-simplification]
  ↓ [ponytail:ultra-simplify] (if mode=ultra)
review:end

ship:start
  ↓ [addy:git-workflow]
  ↓ [addy:ci-cd]
  ↓ [addy:shipping-and-launch]
ship:end
```

### Hook Registration

```javascript
class HookRegistry {
  registerHook(point, skill) {
    // Register skill at hook point
    // Hook point format: "phase:stage" (e.g., "execute:post")
    
    this.hooks[point] = this.hooks[point] || [];
    this.hooks[point].push(skill);
  }

  getHooksFor(point) {
    return this.hooks[point] || [];
  }

  // Dispatch hooks in order
  async dispatchHooks(point, context) {
    const hooks = this.getHooksFor(point);
    
    for (const hook of hooks) {
      const result = await hook.execute(context);
      context.artifacts.merge(result.artifacts);
      if (result.blocking && !result.passed) {
        throw new Error(`Hook ${hook.name} failed: ${result.error}`);
      }
    }
    
    return context;
  }
}
```

---

## State Management

### Config Precedence

```
Highest:  Environment variable (GSD_SKILL_COMPOSITION)
    ↓     .planning/config.json
    ↓     .planning/workstreams/<ws>/config.json
Lowest:   Built-in defaults
```

### Config Loading

```javascript
class ConfigLoader {
  async loadConfig(cwd, workstream = null) {
    // 1. Check environment
    if (process.env.GSD_SKILL_COMPOSITION) {
      return JSON.parse(process.env.GSD_SKILL_COMPOSITION).skill_composition;
    }
    
    // 2. Check workstream config
    if (workstream) {
      const wsConfig = join(cwd, '.planning/workstreams', workstream, 'config.json');
      if (existsSync(wsConfig)) {
        return JSON.parse(readFileSync(wsConfig)).skill_composition;
      }
    }
    
    // 3. Check root config
    const rootConfig = join(cwd, '.planning/config.json');
    if (existsSync(rootConfig)) {
      return JSON.parse(readFileSync(rootConfig)).skill_composition;
    }
    
    // 4. Use defaults
    return {
      enabled: true,
      packs: {
        'agent-skills': { enabled: true, profile: 'balanced' },
        'superpowers': { enabled: true },
        'ponytail': { enabled: true, mode: 'full' }
      },
      conflict_resolution: 'addy-preferred'
    };
  }
}
```

---

## Error Handling

### Graceful Degradation

```javascript
class SkillComposer {
  async executePhase(phaseName, context) {
    try {
      return await this.executeWithComposition(phaseName, context);
    } catch (error) {
      // If composition fails, fall back to vanilla gsd-core
      console.warn(`Skill composition failed: ${error.message}`);
      console.warn(`Falling back to vanilla gsd-core for ${phaseName}`);
      
      return this.executeVanillaGSD(phaseName, context);
    }
  }

  // Validate all skills are loadable before execution
  async validateSkills(skills) {
    const errors = [];
    
    for (const skill of skills) {
      try {
        await skill.validate();  // Each skill has validate() method
      } catch (err) {
        errors.push(`${skill.name}: ${err.message}`);
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`Skill validation failed:\n${errors.join('\n')}`);
    }
  }
}
```

---

## Performance Optimization

### Skill Registry Caching

```javascript
class SkillRegistry {
  constructor(cacheDir = '.gsd/skill-cache') {
    this.cacheDir = cacheDir;
  }

  async getRegistry(config) {
    const hash = hashConfig(config);
    const cachePath = join(this.cacheDir, `registry-${hash}.json`);
    
    // Return cached registry if config unchanged
    if (existsSync(cachePath)) {
      return JSON.parse(readFileSync(cachePath));
    }
    
    // Otherwise, load and cache
    const registry = await this.loadRegistry(config);
    writeFileSync(cachePath, JSON.stringify(registry));
    
    return registry;
  }

  // Clean stale cache entries
  async pruneCache(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const files = readdirSync(this.cacheDir);
    const now = Date.now();
    
    for (const file of files) {
      const path = join(this.cacheDir, file);
      const stat = statSync(path);
      if (now - stat.mtime.getTime() > maxAge) {
        unlinkSync(path);
      }
    }
  }
}
```

---

## Testing Strategy

### Unit Tests

```javascript
// Test ConflictResolver in isolation
describe('ConflictResolver', () => {
  it('resolves TDD conflict: addy wins', () => {
    const resolver = new ConflictResolver();
    const result = resolver.resolveConflicts({
      'obra:test-driven-development': true,
      'addy:test-driven-development': true
    }, { conflict_resolution: 'addy-preferred' });
    
    assert.equal(result.resolvedConflicts.tdd.winner, 'addy:test-driven-development');
  });
});
```

### Integration Tests

```javascript
// Test full composition pipeline
describe('SkillComposer', () => {
  it('executes plan phase with addy + ponytail', async () => {
    const composer = new SkillComposer();
    const config = {
      enabled: true,
      packs: {
        'agent-skills': { enabled: true, profile: 'balanced' },
        'superpowers': { enabled: false },
        'ponytail': { enabled: true, mode: 'full' }
      }
    };
    
    const result = await composer.executePhase('plan', { config, cwd: tempDir });
    
    assert(result.activeSkills.includes('addy:planning-and-task-breakdown'));
    assert(result.activeSkills.includes('ponytail:filter'));
    assert(existsSync(join(result.artifacts.get('PLAN.md'))));
  });
});
```

### E2E Tests

```javascript
// Test complete workflow
describe('E2E Multi-Framework', () => {
  it('executes full workflow: define → plan → execute → verify → review → ship', async () => {
    // ... full workflow simulation ...
  });
});
```

---

## Deployment Considerations

### Runtime Compatibility

| Runtime | Supported | Notes |
|---------|-----------|-------|
| Claude Code | ✅ | Full support |
| Gemini CLI | ✅ | Full support |
| Cursor | ✅ | Full support |
| Windsurf | ✅ | Full support |
| Codex | ✅ | Full support |

### Installation Per Runtime

```bash
# Claude Code
npm install @obra/superpowers @addyosmani/agent-skills @DietrichGebert/ponytail

# Gemini CLI
gem install obra-superpowers addy-agent-skills ponytail

# Cursor / Windsurf
# (auto-installed via .cursor/rules or extension)
```

---

## Next Steps

Phase 3: Implement all modules (code skeleton → production code)

**See:** `/docs/02-PHASE-2-WORKPLAN.md` for Week 4 tasks
