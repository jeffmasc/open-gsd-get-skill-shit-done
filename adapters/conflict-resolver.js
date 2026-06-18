/**
 * Conflict Resolution Engine
 * 
 * Detects and resolves skill conflicts using priority rules.
 * Phase 3 deliverable: Full implementation.
 */

class ConflictResolver {
  // Known conflicts from Phase 1 matrix
  static CONFLICTS = {
    'tdd': {
      skills: ['obra:test-driven-development', 'addy:test-driven-development'],
      domain: 'Test-Driven Development',
      description: 'Both enforce RED-GREEN-REFACTOR pattern'
    },
    'code-review': {
      skills: ['obra:requesting-code-review', 'addy:code-review-and-quality'],
      domain: 'Code Review',
      description: 'Obra: 1 approach vs Addy: 5-axis + personas'
    },
    'debugging': {
      skills: ['obra:systematic-debugging', 'addy:debugging-and-error-recovery'],
      domain: 'Debugging',
      description: 'Obra: 4-phase vs Addy: 5-step triage'
    }
  };

  // Priority order: gsd-core > addy > obra > ponytail
  static PRIORITY = {
    'gsd': 4,
    'addy': 3,
    'obra': 2,
    'ponytail': 1
  };

  /**
   * Detect conflicts between active skills
   */
  static detectConflicts(skills) {
    const active = new Set(skills);
    const conflicts = [];

    for (const [id, conflict] of Object.entries(this.CONFLICTS)) {
      const activeInConflict = conflict.skills.filter(s => active.has(s));
      if (activeInConflict.length > 1) {
        conflicts.push({
          id,
          ...conflict,
          active: activeInConflict
        });
      }
    }

    return conflicts;
  }

  /**
   * Apply priority rules to resolve a single conflict
   */
  static resolve(conflict, config = {}) {
    const strategy = config.conflict_resolution || 'addy-preferred';

    // Sort by priority (highest first)
    const sorted = conflict.active.sort((a, b) => {
      const aPriority = this.getPriority(a);
      const bPriority = this.getPriority(b);
      return bPriority - aPriority;  // Higher priority first
    });

    const winner = sorted[0];
    const losers = sorted.slice(1);

    return {
      conflict: conflict.id,
      domain: conflict.domain,
      winner,
      losers,
      reason: this.getResolutionReason(winner, losers, conflict),
      strategy
    };
  }

  /**
   * Get priority value for a skill
   */
  static getPriority(skill) {
    const framework = skill.split(':')[0];
    return this.PRIORITY[framework] || 0;
  }

  /**
   * Generate human-readable resolution reason
   */
  static getResolutionReason(winner, losers, conflict) {
    const winnerFramework = winner.split(':')[0];
    const loserFrameworks = losers.map(s => s.split(':')[0]).join(', ');

    return `Priority: ${winnerFramework} (${this.PRIORITY[winnerFramework]}) > ${loserFrameworks}`;
  }

  /**
   * Resolve all conflicts in a skill set
   */
  static resolveAll(skills, config = {}) {
    const conflicts = this.detectConflicts(skills);
    const resolutions = [];
    const activeSkills = new Set(skills);

    for (const conflict of conflicts) {
      const resolution = this.resolve(conflict, config);
      resolutions.push(resolution);

      // Remove losers from active skills
      resolution.losers.forEach(skill => activeSkills.delete(skill));
    }

    return {
      originalSkills: Array.from(skills),
      conflicts: conflicts.map(c => c.id),
      resolutions,
      activeSkills: Array.from(activeSkills),
      conflictCount: conflicts.length,
      resolvedConflictCount: resolutions.length
    };
  }
}

module.exports = ConflictResolver;
