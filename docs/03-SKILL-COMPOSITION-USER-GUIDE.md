# Skill Composition User Guide

**Target Audience:** GSD-Core Users  
**Purpose:** How to enable, configure, and use multi-framework skills  
**Version:** 1.0  

---

## Quick Start

### Installation

#### 1. Install @obra/superpowers

```bash
npm install @obra/superpowers --save-dev
```

**Verify:**
```bash
node -e "require('@obra/superpowers')" && echo "✓ obra installed"
```

#### 2. Install @addyosmani/agent-skills

```bash
npm install @addyosmani/agent-skills --save-dev
```

**Verify:**
```bash
node -e "const skills = require('@addyosmani/agent-skills'); console.log(Object.keys(skills).length + ' skills loaded')" && echo "✓ addy installed"
```

#### 3. Install @ponytail (optional)

```bash
npm install @DietrichGebert/ponytail --save-dev
```

**Verify:**
```bash
node -e "require('@DietrichGebert/ponytail')" && echo "✓ ponytail installed"
```

#### 4. Update .planning/config.json

```javascript
{
  "skill_composition": {
    "enabled": true,
    "packs": {
      "agent-skills": {
        "enabled": true,
        "profile": "balanced"
      },
      "superpowers": {
        "enabled": true
      },
      "ponytail": {
        "enabled": true,
        "mode": "full"
      }
    }
  }
}
```

#### 5. Test

```bash
/gsd:session-start
```

You should see in the output:
```
✓ Loading skill pack: agent-skills (24 skills)
✓ Loading skill pack: superpowers (23 skills)
✓ Loading skill pack: ponytail (YAGNI optimizer)
✓ Resolving conflicts (TDD, CodeReview, Debugging)
✓ Multi-framework composition ready
```

---

## Configuration Reference

### Full .planning/config.json Schema

```javascript
{
  "skill_composition": {
    // Enable/disable multi-framework composition
    "enabled": true,
    
    "packs": {
      // @addyosmani/agent-skills (24 production-grade skills)
      "agent-skills": {
        "enabled": true,
        
        // Profile: what skills to load
        // minimal: core skills only (plan, code, test)
        // balanced: core + quality skills (default)
        // comprehensive: all 24 skills
        "profile": "balanced",
        
        // Personas for code review (when enabled)
        // code-reviewer: catches logic/style issues
        // test-engineer: validates test coverage
        // security-auditor: checks OWASP/auth
        // performance-auditor: Core Web Vitals, profiling
        "personas": [
          "code-reviewer",
          "test-engineer",
          "security-auditor"
        ]
      },
      
      // @obra/superpowers (23 behavioral strategy skills)
      "superpowers": {
        "enabled": true,
        
        // Specific skills to load (omit to load all)
        "skills": [
          "subagent-driven-development",
          "test-driven-development",
          "brainstorming"  // optional: add to define phase
        ]
      },
      
      // @DietrichGebert/ponytail (cost optimizer)
      "ponytail": {
        "enabled": true,
        
        // Mode controls aggressiveness
        // off:    don't use ponytail
        // lite:   minimal changes (only obvious removals)
        // full:   moderate optimization (YAGNI + stdlib-first)
        // ultra:  aggressive (cut everything unnecessary)
        "mode": "full",
        
        // Which phases should ponytail filter?
        "apply_after": [
          "execute-phase",
          "code-review-phase"
        ]
      }
    },
    
    // Conflict resolution strategy
    // addy-preferred: use @addy/agent-skills when conflicts (recommended)
    // obra-preferred: use @obra/superpowers (not recommended)
    // user-prompt: ask user at runtime (verbose, not recommended)
    "conflict_resolution": "addy-preferred",
    
    // How to handle overlaps in specific domains
    "overlap_handling": {
      "tdd": "unified",          // Use unified test-patterns.md
      "code-review": "addy-5axis", // Use addy's 5-axis review
      "debugging": "addy-5step"   // Use addy's 5-step triage
    },
    
    // Cache compiled skill registry?
    // Recommended: true (faster startup)
    "cache_registry": true,
    
    // Log skill loading + conflict resolution?
    // Recommended: false in production, true during setup
    "debug": false
  }
}
```

### Minimal Config (Default)

```javascript
{
  "skill_composition": {
    "enabled": true
    // All other keys use defaults (addy balanced profile, all packs enabled)
  }
}
```

### Disable All (GSD-Core Only)

```javascript
{
  "skill_composition": {
    "enabled": false
    // Reverts to vanilla gsd-core (no @obra, @addy, @ponytail)
  }
}
```

---

## Per-Phase Usage Guide

### PHASE 1: Define / Brainstorm

**Active Skills:**
- `addy:interview-me` — Structured intake questions
- `addy:idea-refine` — Refine raw idea into shaped opportunity
- `obra:brainstorming` — Optional: Socratic method deepdive

**Config:**
```javascript
{
  "skill_composition": {
    "packs": {
      "agent-skills": { "enabled": true },
      "superpowers": { "skills": ["brainstorming"] },  // optional
      "ponytail": { "enabled": false }  // Not useful in define phase
    }
  }
}
```

**CLI:**
```bash
/gsd:discuss-phase 1
```

**What it does:**
1. `interview-me` asks clarifying questions
2. `idea-refine` structures answers into PRD shape
3. Optionally, `brainstorming` explores design space

---

### PHASE 2: Plan / Breakdown

**Active Skills:**
- `addy:planning-and-task-breakdown` — Atomic task decomposition
- `addy:spec-driven-development` — 24-point spec checklist

**Config:**
```javascript
{
  "skill_composition": {
    "packs": {
      "agent-skills": { "profile": "balanced" },
      "superpowers": { "skills": ["writing-plans"] },
      "ponytail": { "enabled": false }
    }
  }
}
```

**CLI:**
```bash
/gsd:plan-phase 1
```

**What it does:**
1. Breaks user story into atomic tasks
2. Each task: acceptance criteria, effort estimate, file list
3. Validates 24-point spec checklist
4. Produces PLAN.md ready for execution

---

### PHASE 3: Execute / Build

**Active Skills:**
- `gsd:execute-phase` (wave dispatch)
- `addy:incremental-implementation` (thin slices)
- `obra:subagent-driven-development` (2-stage review)
- `ponytail:filter` (optional: cost optimization)

**Config:**
```javascript
{
  "skill_composition": {
    "packs": {
      "agent-skills": {
        "profile": "comprehensive",
        "personas": ["code-reviewer", "test-engineer"]
      },
      "superpowers": {
        "skills": [
          "subagent-driven-development",
          "test-driven-development"
        ]
      },
      "ponytail": {
        "enabled": true,
        "mode": "full",
        "apply_after": ["execute-phase"]
      }
    }
  }
}
```

**CLI (with ponytail ultra mode):**
```bash
/gsd:execute-phase 1 --ultra
```

**What it does:**
1. Dispatch each task to a subagent
2. Subagent implements incrementally (thin slices)
3. Obra's 2-stage review validates spec + code quality
4. Optional: ponytail removes unnecessary code
5. Result: minimal but correct implementation

---

### PHASE 4: Verify / Test

**Active Skills:**
- `gsd:verify-work` (test adequacy gate)
- `addy:browser-testing-with-devtools` (manual testing MCP)
- `addy:debugging-and-error-recovery` (5-step triage)

**Config:**
```javascript
{
  "skill_composition": {
    "packs": {
      "agent-skills": { "profile": "comprehensive" },
      "superpowers": { "enabled": false },
      "ponytail": { "enabled": false }
    }
  }
}
```

**CLI:**
```bash
/gsd:verify-work 1
```

**What it does:**
1. Run all tests; gate on >80% coverage
2. Use DevTools MCP to validate UI behavior
3. If failures: run 5-step debugging triage
4. Iterate until all tests pass

---

### PHASE 5: Review / Quality

**Active Skills:**
- `gsd:code-review` (gsd gates)
- `addy:code-review-and-quality` (5-axis review)
- `addy:code-simplification` (Chesterton's Fence)
- `ponytail:ultra-simplify` (optional: aggressive)

**Config:**
```javascript
{
  "skill_composition": {
    "packs": {
      "agent-skills": {
        "profile": "comprehensive",
        "personas": ["code-reviewer", "test-engineer", "security-auditor", "performance-auditor"]
      },
      "superpowers": { "enabled": false },
      "ponytail": {
        "enabled": true,
        "mode": "full",
        "apply_after": ["code-review-phase"]
      }
    }
  }
}
```

**CLI (with all personas):**
```bash
/gsd:code-review 1
```

**What it does:**
1. Run gsd gates (style, naming, structure)
2. Run 5-axis review (logic, tests, security, perf, maintainability)
3. Get feedback from all 4 specialist personas
4. Apply code simplification (Chesterton)
5. Optional: ponytail aggressively removes shortcuts

---

### PHASE 6: Ship / Deploy

**Active Skills:**
- `gsd:ship` (tag + release)
- `addy:git-workflow-and-versioning` (trunk-based)
- `addy:ci-cd-and-automation` (Shift Left)
- `addy:shipping-and-launch` (staged rollout)

**Config:**
```javascript
{
  "skill_composition": {
    "packs": {
      "agent-skills": { "profile": "comprehensive" },
      "superpowers": { "enabled": false },
      "ponytail": { "enabled": false }
    }
  }
}
```

**CLI:**
```bash
/gsd:ship 1.0.0
```

**What it does:**
1. Validate git workflow (clean trunk, atomic commits)
2. Run CI/CD gates (all checks must pass)
3. Merge to main
4. Tag release
5. Execute shipping plan (staged rollout with monitoring)

---

## Common Scenarios

### Scenario A: Minimum Overhead (GSD-Core Only)

**Use case:** You just want gsd-core, no extra frameworks

```javascript
{
  "skill_composition": { "enabled": false }
}
```

**Result:** Vanilla gsd-core behavior, ~0 extra token cost

---

### Scenario B: Balanced (Recommended)

**Use case:** You want quality gates without overwhelming token budget

```javascript
{
  "skill_composition": {
    "enabled": true,
    "packs": {
      "agent-skills": { "profile": "balanced" },
      "superpowers": { "enabled": true },
      "ponytail": { "mode": "full" }
    }
  }
}
```

**Result:** ~50 skills available, moderate token cost, maximum value

---

### Scenario C: Minimal Code (Startup Mode)

**Use case:** You want to ship fast with minimal dependencies

```javascript
{
  "skill_composition": {
    "enabled": true,
    "packs": {
      "agent-skills": { "profile": "minimal" },
      "superpowers": { "skills": ["test-driven-development"] },
      "ponytail": { "mode": "ultra" }  // aggressive cost optimization
    }
  }
}
```

**Result:** Core skills only, ponytail cuts everything unnecessary, fastest to ship

---

### Scenario D: Comprehensive (Enterprise)

**Use case:** You want all quality gates and all specialized expertise

```javascript
{
  "skill_composition": {
    "enabled": true,
    "packs": {
      "agent-skills": { "profile": "comprehensive" },
      "superpowers": { "enabled": true },
      "ponytail": { "mode": "lite" }  // light optimization
    }
  }
}
```

**Result:** All 50+ skills, highest quality, higher token cost

---

## Troubleshooting

### Q: "skill_composition not found in config"

**Fix:** Add to .planning/config.json:
```javascript
{
  "skill_composition": { "enabled": true }
}
```

### Q: "@obra/superpowers not installed"

**Fix:**
```bash
npm install @obra/superpowers --save-dev
```

### Q: "Conflict: TDD undefined (no winner selected)"

**Fix:** Ensure config has:
```javascript
{
  "skill_composition": {
    "conflict_resolution": "addy-preferred"
  }
}
```

### Q: "Too many tokens used (ponytail increasing cost)"

**Fix:** Set ponytail mode to `off` or `lite`:
```javascript
{
  "skill_composition": {
    "packs": {
      "ponytail": { "mode": "off" }
    }
  }
}
```

### Q: "Which persona should I use for code review?"

**Answer:** Depends on your project:
- **Startups:** `["code-reviewer", "test-engineer"]` (speed)
- **Security-critical:** Add `"security-auditor"`
- **Performance-critical:** Add `"performance-auditor"`
- **Enterprise:** All 4 personas

---

## FAQ

### Q: Can I enable/disable skills per-phase?

**A:** Yes! Modify config before each phase:
```bash
/gsd:plan-phase 1  # Uses plan config
/gsd:execute-phase 1  # Uses execute config
```

Each phase reads fresh config from disk.

### Q: Does ponytail conflict with other frameworks?

**A:** No, it's a post-filter (applies after execution). Zero conflicts.

### Q: What's the token cost of each framework?

**A:** Rough estimates (in tokens, per phase):
- GSD-Core: ~10k
- @addy/agent-skills: +5k (balanced profile)
- @obra/superpowers: +2k
- @ponytail: +1k
- **Total:** ~18k tokens/phase (vs ~10k vanilla)

### Q: Can I use only @addy without @obra and @ponytail?

**A:** Yes:
```javascript
{
  "skill_composition": {
    "packs": {
      "agent-skills": { "enabled": true },
      "superpowers": { "enabled": false },
      "ponytail": { "enabled": false }
    }
  }
}
```

### Q: What if my project uses a different test framework (Vitest, Playwright, etc.)?

**A:** Addy skills auto-detect. No config needed.

### Q: How do I debug which skills are loaded?

**A:** Set `"debug": true` in skill_composition:
```javascript
{
  "skill_composition": {
    "debug": true  // Logs all loaded skills + conflicts
  }
}
```

---

## Next Steps

1. ✅ Install all 3 frameworks (see Quick Start above)
2. ✅ Add config to .planning/config.json
3. ✅ Run `/gsd:session-start` to verify
4. ✅ Choose a scenario (A-D) that fits your workflow
5. ✅ Run `/gsd:discuss-phase 1` and observe skills in action

---

**Questions?** → See `/docs/03-ARCHITECTURE.md` for technical details

**Having issues?** → File an issue at github.com/jeffmasc/open-gsd-get-skill-shit-done
