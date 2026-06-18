/**
 * Conflict Resolution Tests
 * 
 * Phase 3 deliverable: Full test suite with 100% coverage of conflicts.
 */

const assert = require('assert');
const ConflictResolver = require('../../adapters/conflict-resolver');

describe('ConflictResolver', () => {
  describe('detectConflicts', () => {
    it('detects TDD conflict', () => {
      const skills = [
        'obra:test-driven-development',
        'addy:test-driven-development'
      ];

      const conflicts = ConflictResolver.detectConflicts(skills);

      assert.strictEqual(conflicts.length, 1);
      assert.strictEqual(conflicts[0].id, 'tdd');
      assert.deepStrictEqual(conflicts[0].active, skills);
    });

    it('detects code-review conflict', () => {
      const skills = [
        'obra:requesting-code-review',
        'addy:code-review-and-quality'
      ];

      const conflicts = ConflictResolver.detectConflicts(skills);

      assert.strictEqual(conflicts.length, 1);
      assert.strictEqual(conflicts[0].id, 'code-review');
    });

    it('detects debugging conflict', () => {
      const skills = [
        'obra:systematic-debugging',
        'addy:debugging-and-error-recovery'
      ];

      const conflicts = ConflictResolver.detectConflicts(skills);

      assert.strictEqual(conflicts.length, 1);
      assert.strictEqual(conflicts[0].id, 'debugging');
    });

    it('detects no conflicts when only one skill present', () => {
      const skills = ['addy:test-driven-development'];

      const conflicts = ConflictResolver.detectConflicts(skills);

      assert.strictEqual(conflicts.length, 0);
    });

    it('detects multiple conflicts simultaneously', () => {
      const skills = [
        'obra:test-driven-development',
        'addy:test-driven-development',
        'obra:requesting-code-review',
        'addy:code-review-and-quality',
        'obra:systematic-debugging',
        'addy:debugging-and-error-recovery'
      ];

      const conflicts = ConflictResolver.detectConflicts(skills);

      assert.strictEqual(conflicts.length, 3);
      assert(conflicts.some(c => c.id === 'tdd'));
      assert(conflicts.some(c => c.id === 'code-review'));
      assert(conflicts.some(c => c.id === 'debugging'));
    });
  });

  describe('resolve', () => {
    it('resolves TDD conflict: addy wins (higher priority)', () => {
      const conflict = {
        id: 'tdd',
        active: [
          'obra:test-driven-development',
          'addy:test-driven-development'
        ]
      };

      const resolution = ConflictResolver.resolve(conflict);

      assert.strictEqual(resolution.winner, 'addy:test-driven-development');
      assert.deepStrictEqual(resolution.losers, ['obra:test-driven-development']);
      assert(resolution.reason.includes('addy'));
      assert(resolution.reason.includes('Priority'));
    });

    it('resolves code-review conflict: addy wins', () => {
      const conflict = {
        id: 'code-review',
        active: [
          'obra:requesting-code-review',
          'addy:code-review-and-quality'
        ]
      };

      const resolution = ConflictResolver.resolve(conflict);

      assert.strictEqual(resolution.winner, 'addy:code-review-and-quality');
    });

    it('resolves debugging conflict: addy wins', () => {
      const conflict = {
        id: 'debugging',
        active: [
          'obra:systematic-debugging',
          'addy:debugging-and-error-recovery'
        ]
      };

      const resolution = ConflictResolver.resolve(conflict);

      assert.strictEqual(resolution.winner, 'addy:debugging-and-error-recovery');
    });

    it('includes resolution reason', () => {
      const conflict = {
        id: 'tdd',
        active: ['obra:test-driven-development', 'addy:test-driven-development']
      };

      const resolution = ConflictResolver.resolve(conflict);

      assert(resolution.reason.includes('Priority'));
      assert(resolution.reason.includes('addy'));
      assert(resolution.reason.includes('obra'));
    });
  });

  describe('resolveAll', () => {
    it('resolves all conflicts in skill set', () => {
      const skills = [
        'addy:idea-refine',
        'obra:test-driven-development',
        'addy:test-driven-development',
        'ponytail:filter'
      ];

      const result = ConflictResolver.resolveAll(skills);

      assert.strictEqual(result.conflictCount, 1);
      assert.strictEqual(result.resolvedConflictCount, 1);
      assert(result.activeSkills.includes('addy:test-driven-development'));
      assert(!result.activeSkills.includes('obra:test-driven-development'));
      assert(result.activeSkills.includes('addy:idea-refine'));
      assert(result.activeSkills.includes('ponytail:filter'));
    });

    it('returns resolutions with details', () => {
      const skills = [
        'obra:test-driven-development',
        'addy:test-driven-development',
        'obra:systematic-debugging',
        'addy:debugging-and-error-recovery'
      ];

      const result = ConflictResolver.resolveAll(skills);

      assert.strictEqual(result.conflicts.length, 2);
      assert.strictEqual(result.resolutions.length, 2);
      assert(result.resolutions.every(r => r.winner && r.losers && r.reason));
    });
  });

  describe('getPriority', () => {
    it('returns correct priority for each framework', () => {
      assert.strictEqual(ConflictResolver.getPriority('gsd:core'), 4);
      assert.strictEqual(ConflictResolver.getPriority('addy:skill'), 3);
      assert.strictEqual(ConflictResolver.getPriority('obra:skill'), 2);
      assert.strictEqual(ConflictResolver.getPriority('ponytail:filter'), 1);
      assert.strictEqual(ConflictResolver.getPriority('unknown:skill'), 0);
    });
  });
});
