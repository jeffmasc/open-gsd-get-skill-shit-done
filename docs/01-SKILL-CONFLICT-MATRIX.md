# Phase 1: Multi-Framework Skill Conflict Matrix

**Status:** ✅ Complete  
**Date:** 2026-06-18  
**Scope:** Integration of @obra/superpowers, @addyosmani/agent-skills, @DietrichGebert/ponytail into gsd-core  

---

## Executive Summary

GSD-core将集成三个外部skill框架。本矩阵识别：
- **直接skill重叠** (同领域，不同方法)
- **互补skill** (填补gsd-core空缺)
- **冲突处理** (优先级规则)
- **集成入点** (hook位置)

### 框架定位

```
GSD-CORE (Orchestrator)
    ↓
[obra] [addy:24skills] [ponytail]
 (高)     (高)          (低)
```

---

## Framework Profile

### @obra/superpowers (v6.0.2)

**Role:** Behavioral Strategy Layer  
**Skills:** 23 lifecycle + 1 meta  
**Key:** subagent-driven-development, TDD, brainstorming  
**Coupling:** MEDIUM - 可选enhance gsd行为

### @addyosmani/agent-skills (v24)

**Role:** Quality Gates & Tactics  
**Skills:** 24 production-grade skills  
**Key:** spec-driven, code-review-5axis, planning-breakdown, debugging-5step  
**Coupling:** HIGH - 填补gsd-core大量空缺

### @DietrichGebert/ponytail

**Role:** Cost Optimizer (Cross-cutting)  
**Skills:** YAGNI, minimal-code, edge-case-correct  
**Coupling:** LOW - 纯后处理过滤器

---

## Skill Conflict Matrix (Complete)

### PHASE 1: Define / Brainstorm

| Domain | GSD | Obra | Addy | Ponytail | ✅ Winner | 理由 |
|--------|-----|------|------|----------|-----------|------|
| Idea refinement | discuss-phase | brainstorming | interview-me + idea-refine | N/A | **addy:idea-refine** | 更结构化 |
| Spec creation | N/A | N/A | spec-driven-development | N/A | **addy:spec-driven** | 24-point checklist |
| Design prep | N/A | brainstorming | N/A | N/A | **obra:brainstorming** | Socratic method (optional) |
| **Conflict** | N/A | brainstorming ⚠️ | idea-refine ⚠️ | N/A | **Use addy** + offer obra as prep | Addy更详细 |

### PHASE 2: Plan / Breakdown

| Domain | GSD | Obra | Addy | Ponytail | ✅ Winner | 理由 |
|--------|-----|------|------|----------|-----------|------|
| Task decomposition | plan-phase | writing-plans | planning-and-task-breakdown | N/A | **addy:planning-breakdown** | 原子任��� |
| Task structure | PLAN.md | Implicit | Explicit acceptance criteria | N/A | **gsd PLAN.md** (compatible) | 已符合 |
| **Conflict** | N/A | writing-plans ⚠️ | planning-breakdown ⚠️ | N/A | **Use addy** + same PLAN.md format | 互补，无真冲突 |

### PHASE 3: Execute / Build

| Domain | GSD | Obra | Addy | Ponytail | ✅ Winner | 理由 |
|--------|-----|------|------|----------|-----------|------|
| Subagent dispatch | execute-phase (wave) | subagent-driven-dev (2-stage) | incremental-impl (slices) | N/A | ➕ **COMPOSE ALL** | Wave → Slices → 2-stage-review |
| TDD enforcement | optional | test-driven-dev (RED-GREEN) | test-driven-dev (RED-GREEN) | N/A | ⚠️ **UNIFIED** | Addy TDD + shared test-patterns |
| Code style | N/A | Implicit | frontend-ui, api-design | N/A | **addy:*-design** | Auto-trigger on context |
| Minimal coding | N/A | N/A | N/A | ponytail:full | ➕ **ponytail post-filter** | Optional --ultra mode |
| Source verification | N/A | N/A | source-driven-dev | N/A | **addy:source-driven** | Ground in docs |
| **Conflict** | execute-phase ⚠️ | subagent-driven ⚠️ | incremental ⚠️ | N/A | **Orchestrate together** | Wave dispatch (gsd) → Tactics (addy) → Review (obra) |

### PHASE 4: Verify / Test

| Domain | GSD | Obra | Addy | Ponytail | ✅ Winner | 理由 |
|--------|-----|------|------|----------|-----------|------|
| Verification | verify-work | Implicit | browser-testing, debugging | N/A | ➕ **Compose** | gsd-verify → addy-browser → addy-debug |
| Debugging | Implicit | systematic-debug (4-phase) | debugging-error-recovery (5-step) | N/A | **addy:debugging** | 5-step更现代 |
| Test adequacy | Implicit | N/A | test-pyramid (80/15/5) | N/A | **addy:TDD** | Unified |
| **Conflict** | N/A | systematic ⚠️ | debugging-error-recovery ⚠️ | N/A | **Use addy** | Addy更explicit |

### PHASE 5: Review / Quality

| Domain | GSD | Obra | Addy | Ponytail | ✅ Winner | 理由 |
|--------|-----|------|------|----------|-----------|------|
| Code review | code-review | requesting-code-review | code-review-and-quality (5-axis) | N/A | **addy:code-review** | 5-axis更全面 |
| Review personas | Implicit | N/A | 4 specialists (reviewer, tester, security, perf) | N/A | **addy:personas** | Config-selectable |
| Simplification | N/A | N/A | code-simplification (Chesterton) | ponytail:ultra | ➕ **Compose** | Addy + ponytail aggressive mode |
| Security | N/A | N/A | security-and-hardening (OWASP) | N/A | **addy:security** | Comprehensive |
| Performance | N/A | N/A | performance-optimization (Core Web Vitals) | N/A | **addy:perf** | Metric-driven |
| **Conflict** | code-review ⚠️ | requesting ⚠️ | code-review-quality ⚠️ | N/A | **Use addy** | Addy最全面 |

### PHASE 6: Ship / Deploy

| Domain | GSD | Obra | Addy | Ponytail | ✅ Winner | 理由 |
|--------|-----|------|------|----------|-----------|------|
| Git workflow | ship | using-git-worktrees, finishing-branch | git-workflow-and-versioning | N/A | **addy:git-workflow** | Trunk-based + atomic commits |
| CI/CD | N/A | N/A | ci-cd-and-automation (Shift Left) | N/A | **addy:ci-cd** | Quality gates |
| Deprecation | N/A | N/A | deprecation-and-migration | N/A | **addy:deprecation** | Patterns |
| Documentation | N/A | N/A | documentation-and-adrs | N/A | **addy:documentation** | ADR + API docs |
| Observability | N/A | N/A | observability-instrumentation (RED, OTEL) | N/A | **addy:observability** | Structured logging |
| Launch | N/A | N/A | shipping-and-launch (staged, monitoring) | N/A | **addy:shipping** | Rollout strategy |
| **Conflict** | N/A | None | None | N/A | ✅ **Clean** | No conflicts in ship |

---

## Overlap Analysis

### 重度冲突 (⚠️⚠️)

| Skill Domain | Frameworks | Issue | Resolution |
|--------------|-----------|-------|------------|
| TDD | @obra + @addy | Both enforce RED-GREEN-REFACTOR | Use addy pattern + shared test-patterns.md reference |
| Code Review | gsd + @obra + @addy | 3 different approaches | Use addy 5-axis + optional obra checklist |
| Debugging | @obra 4-phase + @addy 5-step | Different process models | Use addy 5-step; obra as optional reference |

### 中度冲突 (⚠️)

| Skill Domain | Frameworks | Issue | Resolution |
|--------------|-----------|-------|------------|
| Brainstorm | @obra + @addy | Similar goals, different structure | Use addy:idea-refine; obra:brainstorming as optional prep |
| Planning | @obra + @addy | Both break down work | Use addy:planning-breakdown; same PLAN.md format |

### 完全互补 (➕)

| Skill Domain | Frameworks | Benefit |
|--------------|-----------|----------|
| Subagent orchestration | gsd + @addy + @obra | Wave dispatch + incremental slices + 2-stage review |
| Simplification | @addy + @ponytail | Chesterton's Fence + YAGNI |
| Verification | gsd + @addy | gsd gate + addy tactics |

### 正交 (✅)

| Framework | Benefit | Why |
|-----------|---------|-----|
| @ponytail | Post-execution cost optimization | Pure filter, no conflict |
| @addy 24 skills | Fills gsd-core gaps completely | Design, security, perf, observability |

---

## Priority Rules for Conflict Resolution

### Rule 1: Framework Priority Order

```
1. GSD-Core (Orchestrator)     ▲▲▲ HIGHEST
2. @addy/agent-skills          ▲▲  HIGH
3. @obra/superpowers           ▲   MEDIUM
4. @ponytail                       LOW
```

### Rule 2: When Two Skills Conflict

**Apply this decision tree:**

```
1. Structural compatibility?
   YES → Use that (fits gsd file format)
   NO → Go to 2

2. One more detailed/complete?
   YES → Use that
   NO → Go to 3

3. One maintained more recently?
   YES → Use that
   NO → Go to 4

4. Make both available via config flag
```

**Examples:**
- TDD: Addy = explicit test-pyramid. Use addy. ✅
- Code Review: Addy = 5-axis. Use addy. ✅
- Debugging: Addy = 5-step vs Obra = 4-phase. Addy wins (more modern). ✅

### Rule 3: When Conflict with GSD-Core

**GSD always wins. Wrap conflicting skills as optional.**

Example: Superpowers' `using-git-worktrees` vs gsd branching.
- GSD decision: Trunk-based + phase branches
- Superpowers enhancement: Optional when `config.workflow.use_worktrees = true`
- Resolution: Load skill conditionally ✅

### Rule 4: Ponytail is Never Forced

**Always offer as config option.**

```javascript
{
  "skill_composition": {
    "ponytail": {
      "enabled": true,
      "mode": "off|lite|full|ultra",
      "apply_after": ["execute-phase", "code-review"]
    }
  }
}
```

---

## Integration Entry Points

### Session Start Hook

```javascript
// gsd-core/hooks/multi-framework-init.js
1. Read config.skill_composition
2. Activate @obra/superpowers (if enabled)
3. Activate @addy/agent-skills (always, context-driven)
4. Activate @ponytail (if enabled, mode from config)
5. Render capability registry with active skills
```

### Per-Phase Hook Points

```
define:post
  └─ [@addy:idea-refine]
  └─ [@addy:spec-driven]
  └─ [ponytail:ultra-filter] (if mode=ultra)

plan:post
  └─ [@addy:planning-breakdown]
  └─ [ponytail:ultra-filter]

execute:pre
  └─ [gsd-dispatch]
  └─ [@addy:incremental-setup]

execute:wave
  └─ [gsd-wave-executor]
  └─ [@addy:tactics]

execute:post
  └─ [@obra:subagent-driven-review]
  └─ [@addy:doubt-driven]

verify:post
  └─ [@addy:browser-testing]
  └─ [@addy:debugging]

code-review:post
  └─ [@addy:code-review-5axis]
  └─ [@addy:personas-specialist]
  └─ [ponytail:ultra-simplify]

ship:pre
  └─ [@addy:git-workflow]
  └─ [@addy:ci-cd]
```

---

## Config Schema

```javascript
// .planning/config.json
{
  "skill_composition": {
    "enabled": true,
    "packs": {
      "ponytail": {
        "enabled": true,
        "mode": "off|lite|full|ultra",  // default: "full"
        "priority": "low",
        "apply_after": [
          "execute-phase",
          "code-review-phase"
        ]
      },
      "superpowers": {
        "enabled": true,
        "priority": "medium",
        "skills": [
          "subagent-driven-development",
          "test-driven-development",
          "brainstorming"  // optional
        ]
      },
      "agent-skills": {
        "enabled": true,
        "priority": "high",
        "profile": "balanced",  // minimal|balanced|comprehensive
        "personas": [
          "code-reviewer",
          "test-engineer",
          "security-auditor"
        ]
      }
    },
    "conflict_resolution": "addy-preferred",
    "overlap_handling": {
      "tdd": "unified",
      "code-review": "addy-5axis",
      "debugging": "addy-5step"
    }
  }
}
```

---

## Summary Table

### By Skill Domain (Winner)

| Domain | Winner | Framework | Reason |
|--------|--------|-----------|--------|
| **Define** | addy:idea-refine | @addy | Structured interview |
| **Spec** | addy:spec-driven | @addy | 24-point checklist |
| **Plan** | addy:planning-breakdown | @addy | Atomic task structure |
| **Build** | [gsd + addy + obra] | COMPOSE | Wave → slices → review |
| **TDD** | addy:TDD | @addy | Unified RED-GREEN pattern |
| **Design** | addy:frontend-ui, api-design | @addy | Comprehensive |
| **Verify** | addy:browser-testing | @addy | DevTools MCP |
| **Debug** | addy:debugging-5step | @addy | Modern triage |
| **Review** | addy:code-review-5axis | @addy | Comprehensive + personas |
| **Simplify** | [addy + ponytail] | COMPOSE | Chesterton + YAGNI |
| **Security** | addy:security-hardening | @addy | OWASP Top 10 |
| **Perf** | addy:performance-opt | @addy | Core Web Vitals |
| **Ship** | addy:git-workflow | @addy | Trunk-based |
| **Cost** | ponytail | @ponytail | YAGNI post-filter |

---

## Known Gaps

- [ ] Addy lacks "Idea refinement" but has "spec-driven-development" → use idea-refine for intake, spec-driven for formalization
- [ ] Ponytail's "debt ledger" (`ponytail:debt`) may be useful; document integration (Future: /gsd:audit-technical-debt)
- [ ] Obra's "plasma plan" (lazy planning) vs addy's "planning-breakdown" → test compatibility (Likely compatible)
- [ ] Security: Ponytail marks shortcuts with `ponytail:` comments; should gsd-core lint these? (Future: YES, optional linter)

---

## Questions Answered

✅ Which frameworks conflict?  
→ TDD, Code Review, Debugging (3 conflicts, all resolvable)

✅ Which are complementary?  
→ All subagent + verification + simplification phases

✅ What about ponytail?  
→ Orthogonal post-filter, never forced

✅ Priority for conflicts?  
→ addy > obra > ponytail (use this order)

---

## Next: Phase 2

**What's coming:**
- User guide (how to enable each framework)
- Architecture & implementation details
- Adapter code (SkillComposer, ConflictResolver)
- Integration tests
- Deployment strategy per runtime (Claude, Cursor, Gemini, etc.)

**Ready?** → See `/docs/02-SKILL-COMPOSITION-GUIDE.md`
