/**
 * Skill Composition Orchestration Tests
 * 
 * Phase 3 deliverable: Test complete composition pipeline.
 */

const assert = require('assert');
const SkillComposer = require('../../adapters/skill-composition');
const { tmpdir } = require('os');
const { mkdtempSync, writeFileSync } = require('fs');
const { join } = require('path');

describe('SkillComposer', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'gsd-test-'));
  });

  describe('loadConfig', () => {
    it('loads default config when no file exists', async () => {
      const composer = new SkillComposer();
      const config = await composer.loadConfig(tempDir);

      assert.strictEqual(config.enabled, true);
      assert.strictEqual(config.packs['agent-skills'].enabled, true);
      assert.strictEqual(config.packs.superpowers.enabled, true);
      assert.strictEqual(config.packs.ponytail.enabled, true);
    });

    it('loads config from .planning/config.json', async () => {
      const configPath = join(tempDir, '.planning', 'config.json');
      const dir = require('path').dirname(configPath);
      require('fs').mkdirSync(dir, { recursive: true });
      writeFileSync(configPath, JSON.stringify({
        skill_composition: {
          enabled: true,
          packs: {
            ponytail: { enabled: false }
          }
        }
      }));

      const composer = new SkillComposer();
      const config = await composer.loadConfig(tempDir);

      assert.strictEqual(config.packs.ponytail.enabled, false);
    });

    it('respects environment variable override', async () => {
      process.env.GSD_SKILL_COMPOSITION = JSON.stringify({
        enabled: false
      });

      const composer = new SkillComposer();
      const config = await composer.loadConfig(tempDir);

      assert.strictEqual(config.enabled, false);
      delete process.env.GSD_SKILL_COMPOSITION;
    });
  });

  describe('resolveConflicts', () => {
    it('resolves TDD conflict', () => {
      const composer = new SkillComposer();
      const skills = {
        obra: ['obra:test-driven-development'],
        addy: ['addy:test-driven-development'],
        ponytail: [],
        gsd: []
      };
      const config = { conflict_resolution: 'addy-preferred' };

      const resolved = composer.resolveConflicts(skills, config);

      assert(resolved.activeSkills.includes('addy:test-driven-development'));
      assert(!resolved.activeSkills.includes('obra:test-driven-development'));
    });

    it('keeps non-conflicting skills', () => {
      const composer = new SkillComposer();
      const skills = {
        obra: [],
        addy: ['addy:idea-refine', 'addy:code-review-and-quality'],
        ponytail: ['ponytail:filter'],
        gsd: []
      };

      const resolved = composer.resolveConflicts(skills, {});

      assert(resolved.activeSkills.includes('addy:idea-refine'));
      assert(resolved.activeSkills.includes('addy:code-review-and-quality'));
      assert(resolved.activeSkills.includes('ponytail:filter'));
    });
  });

  describe('executePhase', () => {
    it('executes phase with composition enabled', async () => {
      const composer = new SkillComposer();
      const context = {
        cwd: tempDir,
        phase: 'execute',
        args: []
      };

      const result = await composer.executePhase('execute', context);

      assert.strictEqual(result.status, 'success');
      assert(result.activeSkills.length > 0);
    });

    it('falls back to vanilla gsd on error', async () => {
      // Simulate config that disables composition
      const configPath = join(tempDir, '.planning', 'config.json');
      require('fs').mkdirSync(require('path').dirname(configPath), { recursive: true });
      writeFileSync(configPath, JSON.stringify({
        skill_composition: { enabled: false }
      }));

      const composer = new SkillComposer();
      const context = { cwd: tempDir, phase: 'execute', args: [] };

      const result = await composer.executePhase('execute', context);

      assert.strictEqual(result.status, 'success');
      assert(result.activeSkills.includes('gsd:core'));
    });
  });
});
