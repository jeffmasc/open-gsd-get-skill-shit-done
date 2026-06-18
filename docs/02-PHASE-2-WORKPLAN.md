# Phase 2: Architecture & Implementation Plan

**Status:** 📋 Planning  
**Timeline:** Week 3-4  
**Output:** Code skeleton + integration tests  

---

## Phase 2 Objectives

1. ✅ Generate Phase 1 Conflict Matrix (DONE)
2. 📍 **Phase 2 HERE**: User guide + detailed architecture
3. Code implementation (Phase 3)
4. Testing & validation (Phase 4)
5. Runtime support (Phase 5+)

---

## Phase 2 Deliverables

### Document: SKILL-COMPOSITION-GUIDE.md

**Purpose:** End-user facing guide ("how do I enable ponytail? how do I use addy personas?")

**Sections:**
1. Quick start (install each framework)
2. Config reference (.planning/config.json)
3. Per-phase examples
4. Troubleshooting
5. FAQ

### Document: ARCHITECTURE.md

**Purpose:** Developer guide ("how does the composition engine work?")

**Sections:**
1. Overall flow diagram
2. Module responsibilities
3. Hook system integration
4. State management
5. Error handling

### Code Skeleton

```
adapters/
├─ skill-composition.js          # Main orchestrator
├─ conflict-resolver.js          # Conflict detection
├─ ponytail-bridge.js            # Ponytail integration
├─ superpowers-bridge.js         # Obra integration
└─ agent-skills-loader.js        # Addy skill loader

tests/integration/
├─ skill-composition.test.js     # Orchestration tests
├─ conflict-resolution.test.js   # Conflict logic tests
├─ e2e-multi-framework.test.js   # End-to-end workflow
└─ fixtures/                     # Test configs
```

---

## Phase 2 Work Breakdown

### Week 3: Documentation + Design

**Day 1-2: SKILL-COMPOSITION-GUIDE.md**

- [ ] Write "Quick Start" section
  - How to install @obra/superpowers
  - How to install @addy/agent-skills
  - How to enable @ponytail
  - How to verify installation

- [ ] Write "Config Reference" section
  - Full `.planning/config.json` schema
  - Per-framework config options
  - Default values
  - Examples

- [ ] Write "Per-Phase Guide" section
  - Examples for each lifecycle phase
  - How to enable/disable skills per phase
  - How to override defaults

**Day 3-4: ARCHITECTURE.md**

- [ ] Create flow diagrams
  - Session start → skill loading
  - Phase execution → hook dispatch
  - Conflict resolution process

- [ ] Document module interfaces
  - `SkillComposer.executePhase()`
  - `ConflictResolver.resolve()`
  - Hook registration

- [ ] Document state management
  - Config loading precedence
  - Skill registry format
  - Per-phase state

**Day 5: Design Review**

- [ ] Review with stakeholders
- [ ] Incorporate feedback
- [ ] Finalize both docs

---

### Week 4: Code Skeleton + Tests

**Day 1-2: Adapter Skeleton**

- [ ] `skill-composition.js`
  ```javascript
  class SkillComposer {
    async executePhase(phase, context) {
      // 1. Load config
      // 2. Resolve active skills
      // 3. Compose workflow
      // 4. Execute with hooks
      return result;
    }
  }
  ```

- [ ] `conflict-resolver.js`
  ```javascript
  class ConflictResolver {
    detectConflicts(skillList) {
      // 1. Identify overlapping skills
      // 2. Apply priority rules
      // 3. Return winner + rationale
      return resolvedSkills;
    }
  }
  ```

- [ ] `ponytail-bridge.js`, `superpowers-bridge.js`, `agent-skills-loader.js`
  - Loader functions
  - Config adapters
  - Hook registration

**Day 3-4: Integration Tests**

- [ ] `skill-composition.test.js`
  ```javascript
  test('phase execution with addy + obra + ponytail', async () => {
    config.skill_composition.packs = {
      addy: { enabled: true },
      superpowers: { enabled: true },
      ponytail: { enabled: true, mode: 'full' }
    };
    
    const result = await composer.executePhase('execute', context);
    assert(result.hooks.includes('addy:incremental'));
    assert(result.hooks.includes('obra:subagent-review'));
    assert(result.hooks.includes('ponytail:filter'));
  });
  ```

- [ ] `conflict-resolution.test.js`
  ```javascript
  test('TDD conflict: obra vs addy', () => {
    const conflicts = resolver.detectConflicts([
      'obra:test-driven-development',
      'addy:test-driven-development'
    ]);
    
    assert.strictEqual(conflicts[0].winner, 'addy:test-driven-development');
    assert.strictEqual(conflicts[0].reason, 'unified pattern');
  });
  ```

- [ ] `e2e-multi-framework.test.js`
  - Full workflow simulation
  - All frameworks enabled
  - Verify hook ordering
  - Check output artifacts

**Day 5: CI Integration**

- [ ] Add tests to GitHub Actions
- [ ] Code coverage gates
- [ ] Linting checks

---

## Output Checklist (Phase 2)

### Documentation

- [ ] `/docs/02-SKILL-COMPOSITION-GUIDE.md` (5-8 pages)
  - Quick start
  - Config reference
  - Per-phase examples
  - FAQ

- [ ] `/docs/03-ARCHITECTURE.md` (6-10 pages)
  - Flow diagrams
  - Module interfaces
  - State management
  - Error handling

### Code

- [ ] `/adapters/skill-composition.js` (~200 lines)
- [ ] `/adapters/conflict-resolver.js` (~150 lines)
- [ ] `/adapters/ponytail-bridge.js` (~100 lines)
- [ ] `/adapters/superpowers-bridge.js` (~100 lines)
- [ ] `/adapters/agent-skills-loader.js` (~100 lines)

### Tests

- [ ] `/tests/integration/skill-composition.test.js` (~300 lines)
- [ ] `/tests/integration/conflict-resolution.test.js` (~250 lines)
- [ ] `/tests/integration/e2e-multi-framework.test.js` (~400 lines)
- [ ] `/tests/fixtures/config-*.json` (5+ configs)

### CI/CD

- [ ] GitHub Actions workflow updated
- [ ] Code coverage gates: >80%
- [ ] Linting: eslint + typescript

---

## Success Criteria (Phase 2)

✅ Documentation
- User can enable all 3 frameworks from config alone
- Architect can understand module flow from ARCHITECTURE.md
- Every conflict decision is documented with rationale

✅ Code
- All adapters load without errors
- Conflict resolver identifies all 3 conflicts correctly
- CI tests pass on Node 18, 20, 22

✅ Integration
- Phase 1 conflict matrix is 100% encoded in tests
- No hardcoded assumptions; everything is config-driven

---

## Blockers & Dependencies

### None identified

All three frameworks (@obra, @addy, @ponytail) are:
- ✅ Publicly available
- ✅ MIT licensed
- ✅ Well-documented
- ✅ Actively maintained

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Framework API changes | HIGH | Pin versions; add deprecation tracking |
| Token budget overflow | MEDIUM | Implement skill caching + lazy loading |
| Hook system conflicts | MEDIUM | Test hook ordering extensively |
| User config mistakes | LOW | Validate schema + provide error messages |

---

## Next Phase (Phase 3)

**When Phase 2 is complete:**
- Implement all adapters (real code, not skeleton)
- Add runtime hooks (.claude, Gemini, Cursor, etc.)
- Test each runtime separately
- Generate per-runtime install scripts

**Estimated:** Week 5-6

---

## Quick Reference

| Artifact | Owner | Timeline | Status |
|----------|-------|----------|--------|
| Phase 1 Conflict Matrix | You | Week 1-2 | ✅ DONE |
| SKILL-COMPOSITION-GUIDE | You | Week 3 Day 1-2 | 📍 NEXT |
| ARCHITECTURE | You | Week 3 Day 3-4 | 📍 NEXT |
| Code Skeleton | You | Week 4 Day 1-2 | 📍 NEXT |
| Integration Tests | You | Week 4 Day 3-4 | 📍 NEXT |
| CI Integration | You | Week 4 Day 5 | 📍 NEXT |

---

**Ready to start Phase 2?** → Create branch `feature/phase-2-architecture` and begin with SKILL-COMPOSITION-GUIDE.md
