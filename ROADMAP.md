# @jeffmasc/open-gsd-get-skill-shit-done - Roadmap

## Project Overview

Integrate three external skill frameworks into gsd-core:
- @obra/superpowers (behavioral strategies)
- @addyosmani/agent-skills (quality gates + tactics)
- @DietrichGebert/ponytail (cost optimizer)

**Goal:** Enable gsd-core to leverage 50+ combined skills while maintaining clean architecture and user control.

---

## Milestone 1: Analysis & Planning

**Status:** ✅ Complete  
**Dates:** Week 1-2 (June 11-22)  

### Deliverables

- ✅ Phase 1: SKILL-CONFLICT-MATRIX.md
  - Identified 3 conflicts (TDD, Code Review, Debugging)
  - Provided resolution for each
  - Mapped all 50+ skills to gsd phases
  - Established priority rules

### Key Decisions

- Priority order: gsd-core > addy > obra > ponytail
- Use @addy/agent-skills as primary quality framework
- Make @ponytail optional post-filter
- Compose @obra subagent-review with gsd wave dispatch

---

## Milestone 2: Architecture & User Docs

**Status:** 📋 In Progress  
**Dates:** Week 3-4 (June 23 - July 6)  
**Owner:** @jeffmasc  

### Tasks

- [ ] **Week 3 Day 1-2:** SKILL-COMPOSITION-GUIDE.md
  - Quick start (install each framework)
  - Config reference (.planning/config.json schema)
  - Per-phase examples
  - FAQ & troubleshooting

- [ ] **Week 3 Day 3-4:** ARCHITECTURE.md
  - Flow diagrams (session init → phase execution → output)
  - Module interfaces (SkillComposer, ConflictResolver, etc.)
  - Hook system integration points
  - State management & config precedence

- [ ] **Week 3 Day 5:** Design Review
  - Stakeholder feedback
  - Finalize both docs
  - Update this roadmap

### Deliverables

- [ ] `/docs/02-SKILL-COMPOSITION-GUIDE.md`
- [ ] `/docs/03-ARCHITECTURE.md`
- [ ] Updated roadmap

---

## Milestone 3: Implementation

**Status:** 📋 Planning  
**Dates:** Week 4-6 (July 7 - July 20)  
**Owner:** @jeffmasc  

### Core Adapters

- [ ] `adapters/skill-composition.js`
  - Main orchestrator
  - Phase execution pipeline
  - Hook dispatch

- [ ] `adapters/conflict-resolver.js`
  - Conflict detection engine
  - Priority rule application
  - Rationale generation

- [ ] `adapters/ponytail-bridge.js`
  - Load @DietrichGebert/ponytail
  - Mode selection (off|lite|full|ultra)
  - Post-execution filtering

- [ ] `adapters/superpowers-bridge.js`
  - Load @obra/superpowers
  - Skill filtering by gsd phase
  - Subagent review integration

- [ ] `adapters/agent-skills-loader.js`
  - Load @addyosmani/agent-skills (24 skills)
  - Context-driven skill activation
  - Persona selection

### Integration Tests

- [ ] `tests/integration/skill-composition.test.js`
  - Single framework scenarios
  - Multi-framework scenarios
  - Hook ordering verification

- [ ] `tests/integration/conflict-resolution.test.js`
  - TDD conflict resolution
  - Code review conflict resolution
  - Debugging conflict resolution

- [ ] `tests/integration/e2e-multi-framework.test.js`
  - Full workflow simulation
  - All frameworks enabled
  - Output artifact verification

### Deliverables

- [ ] 5 adapter modules (~650 LOC total)
- [ ] 3 test suites (~950 LOC total)
- [ ] 5+ test fixtures (config examples)
- [ ] CI/CD integration

---

## Milestone 4: Runtime Support

**Status:** 📋 Planning  
**Dates:** Week 7-10 (July 21 - August 17)  
**Owner:** @jeffmasc  

### Per-Runtime Integration

- [ ] Claude Code Plugin
  - `.claude-plugin/plugin.json` updates
  - Hook registration
  - Install scripts

- [ ] Gemini CLI Extension
  - `.gemini/extension.json` updates
  - Skill projection
  - Install scripts

- [ ] Cursor Rules
  - `.cursor/rules/` integration
  - Skill copying
  - Install scripts

- [ ] Other Runtimes (Windsurf, Codex, etc.)
  - As needed

### Deliverables

- [ ] Per-runtime install automation
- [ ] Per-runtime test suite
- [ ] Runtime compatibility matrix

---

## Milestone 5: User Documentation & Release

**Status:** 📋 Planning  
**Dates:** Week 11+ (August 18+)  
**Owner:** @jeffmasc  

### Documentation

- [ ] Getting started guide
- [ ] Troubleshooting matrix
- [ ] Video walkthrough (optional)
- [ ] Blog post: "Why 3 frameworks + 50 skills are better than 1"

### Release Prep

- [ ] Version bump
- [ ] CHANGELOG entry
- [ ] Release notes
- [ ] Announcement

### Deliverables

- [ ] Complete user documentation
- [ ] v1.0.0 release tag
- [ ] Public announcement

---

## Metrics & Success Criteria

### Code Quality

- ✅ Test coverage: >80%
- ✅ All lints pass (eslint, typescript)
- ✅ No circular dependencies
- ✅ All adapters are pure (no side effects outside of config)

### User Experience

- ✅ Single config file enables all 3 frameworks
- ✅ No breaking changes to gsd-core
- ✅ Conflict resolution is automatic + documented
- ✅ Optional frameworks are truly optional

### Coverage

- ✅ All Phase 1 conflicts are tested
- ✅ All per-phase compositions are tested
- ✅ All hook points are tested
- ✅ All runtimes tested

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Framework version conflicts | HIGH | LOW | Pin versions, test matrix |
| Token budget overflow | MEDIUM | MEDIUM | Skill caching, lazy loading |
| Hook system incompatibilities | MEDIUM | LOW | Extensive hook ordering tests |
| User config mistakes | LOW | MEDIUM | Schema validation + error messages |

---

## Decision Log

### Decision 1: Use @addy/agent-skills as Primary Framework

**Date:** June 18, 2026  
**Context:** 3-way conflict on TDD, Code Review, Debugging  
**Decision:** Adopt @addy/agent-skills as the primary quality framework  
**Rationale:**
- 24 comprehensive skills
- More recent & actively maintained
- Better structured (5-axis review, test pyramid, etc.)
- Better documented

**Alternatives considered:**
- Use @obra/superpowers as primary: ✗ (fewer skills, less detail)
- Use gsd-core alone: ✗ (incomplete, no specialized skills)

### Decision 2: Make @ponytail Optional Post-Filter

**Date:** June 18, 2026  
**Context:** Ponytail enforces YAGNI but gsd-core doesn't always need it  
**Decision:** Offer @ponytail as optional post-execution filter (mode: off|lite|full|ultra)  
**Rationale:**
- Ponytail is orthogonal to other frameworks
- Users should choose their own simplification level
- No conflicts with other skills

**Alternatives considered:**
- Always enabled: ✗ (not everyone wants minimal code)
- Never use it: ✗ (misses cost optimization opportunity)

### Decision 3: Compose Execution, Don't Override

**Date:** June 18, 2026  
**Context:** Multiple frameworks have subagent/execution strategies  
**Decision:** Compose them together: gsd wave dispatch → addy incremental tactics → obra 2-stage review  
**Rationale:**
- Each framework optimizes different aspects
- Composition is stronger than any single approach
- No conflicts in this composition

**Alternatives considered:**
- Pick one (gsd-only): ✗ (less comprehensive)
- Pick one (@addy only): ✗ (loses obra review rigor)

---

## Open Questions

- [ ] Should all 4 @addy personas run by default, or config-selectable?
  - **Answer (TBD):** Config-selectable seems better

- [ ] Should ponytail's debt ledger be integrated into gsd audit commands?
  - **Answer (TBD):** Yes, add `/gsd:audit-technical-debt` in Phase 5

- [ ] Should each skill be toggleable, or only per-framework?
  - **Answer (TBD):** Per-framework for simplicity; individual toggles in v2

---

## Contact & Questions

**Project Owner:** @jeffmasc  
**Repo:** github.com/jeffmasc/open-gsd-get-skill-shit-done  
**Related:**
- gsd-core: github.com/open-gsd/gsd-core
- @obra/superpowers: github.com/obra/superpowers
- @addy/agent-skills: github.com/addyosmani/agent-skills
- @ponytail: github.com/DietrichGebert/ponytail

---

**Last Updated:** 2026-06-18  
**Next Review:** After Phase 2 complete (June 30, 2026)
