import { MigrationEffort } from './Types';
import * as semver from 'semver';

export class AlternativeRecommendation {
  originalPackage: string;
  recommendedPackage: string;
  recommendedVersion: string;
  justification: string;
  securityScore: number;
  popularityScore: number;
  maintenanceScore: number;
  compatibilityNotes?: string;
  lastUpdated: Date;
  migrationEffort: MigrationEffort;

  constructor(data: {
    originalPackage: string;
    recommendedPackage: string;
    recommendedVersion: string;
    justification: string;
    securityScore: number;
    popularityScore: number;
    maintenanceScore: number;
    migrationEffort: MigrationEffort;
    compatibilityNotes?: string;
    lastUpdated?: Date;
  }) {
    this.validateInput(data);

    this.originalPackage = data.originalPackage;
    this.recommendedPackage = data.recommendedPackage;
    this.recommendedVersion = data.recommendedVersion;
    this.justification = data.justification;
    this.securityScore = data.securityScore;
    this.popularityScore = data.popularityScore;
    this.maintenanceScore = data.maintenanceScore;
    this.migrationEffort = data.migrationEffort;
    this.compatibilityNotes = data.compatibilityNotes;
    this.lastUpdated = data.lastUpdated || new Date();
  }

  private validateInput(data: any): void {
    if (!data.originalPackage || typeof data.originalPackage !== 'string') {
      throw new Error('Original package is required and must be a string');
    }

    if (!data.recommendedPackage || typeof data.recommendedPackage !== 'string') {
      throw new Error('Recommended package is required and must be a string');
    }

    if (data.originalPackage === data.recommendedPackage) {
      throw new Error('Recommended package must be different from original package');
    }

    if (!data.recommendedVersion || typeof data.recommendedVersion !== 'string') {
      throw new Error('Recommended version is required and must be a string');
    }

    if (!semver.validRange(data.recommendedVersion)) {
      throw new Error('Recommended version must be valid semver');
    }

    if (!data.justification || typeof data.justification !== 'string') {
      throw new Error('Justification is required and must be a string');
    }

    // Validate all scores are 0-100 integers
    const scores = ['securityScore', 'popularityScore', 'maintenanceScore'];
    for (const scoreField of scores) {
      const score = data[scoreField];
      if (typeof score !== 'number' || score < 0 || score > 100 || !Number.isInteger(score)) {
        throw new Error(`${scoreField} must be an integer between 0 and 100`);
      }
    }

    // Validate lastUpdated is recent (within 30 days)
    if (data.lastUpdated) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (data.lastUpdated < thirtyDaysAgo) {
        throw new Error('Last updated must be within the last 30 days');
      }
    }
  }

  /**
   * Get overall recommendation score (weighted average)
   */
  getOverallScore(): number {
    // Weight security higher than other factors
    const securityWeight = 0.5;
    const popularityWeight = 0.25;
    const maintenanceWeight = 0.25;

    return Math.round(
      this.securityScore * securityWeight +
      this.popularityScore * popularityWeight +
      this.maintenanceScore * maintenanceWeight
    );
  }

  /**
   * Check if this is a strong recommendation
   */
  isStrongRecommendation(): boolean {
    return this.getOverallScore() >= 80 && this.securityScore >= 85;
  }

  /**
   * Get migration complexity
   */
  getMigrationComplexity(): string {
    switch (this.migrationEffort) {
      case MigrationEffort.LOW:
        return 'Drop-in replacement with minimal changes';
      case MigrationEffort.MEDIUM:
        return 'Some API changes required';
      case MigrationEffort.HIGH:
        return 'Significant refactoring needed';
      default:
        return 'Unknown complexity';
    }
  }

  /**
   * Check if recommendation is still fresh
   */
  isFresh(): boolean {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.lastUpdated > sevenDaysAgo;
  }

  /**
   * Get formatted recommendation summary
   */
  getSummary(): string {
    const overallScore = this.getOverallScore();
    const effort = this.migrationEffort.toLowerCase();
    
    return `Replace ${this.originalPackage} with ${this.recommendedPackage}@${this.recommendedVersion} (${overallScore}/100 score, ${effort} effort): ${this.justification}`;
  }

  /**
   * Get detailed metrics breakdown
   */
  getMetrics() {
    return {
      originalPackage: this.originalPackage,
      recommendedPackage: this.recommendedPackage,
      recommendedVersion: this.recommendedVersion,
      overallScore: this.getOverallScore(),
      scores: {
        security: this.securityScore,
        popularity: this.popularityScore,
        maintenance: this.maintenanceScore,
      },
      migrationEffort: this.migrationEffort,
      isStrongRecommendation: this.isStrongRecommendation(),
      isFresh: this.isFresh(),
      lastUpdated: this.lastUpdated.toISOString(),
    };
  }
}