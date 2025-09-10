import { SecurityAlert } from './SecurityAlert';
import { AlternativeRecommendation } from './AlternativeRecommendation';
import { RiskLevel, AnalysisMetadata } from './Types';
import { v4 as uuidv4 } from 'uuid';

export class AnalysisReport {
  packageName: string;
  packageVersion: string;
  analysisId: string;
  timestamp: Date;
  overallRiskScore: number;
  riskLevel: RiskLevel;
  securityAlerts: SecurityAlert[];
  analysisMetadata: AnalysisMetadata;
  recommendations?: AlternativeRecommendation[];
  executionTime: number;
  cacheExpiry: Date;

  constructor(data: {
    packageName: string;
    packageVersion: string;
    overallRiskScore: number;
    riskLevel: RiskLevel;
    securityAlerts: SecurityAlert[];
    analysisMetadata: AnalysisMetadata;
    executionTime: number;
    recommendations?: AlternativeRecommendation[];
    analysisId?: string;
    timestamp?: Date;
    cacheExpiry?: Date;
  }) {
    this.validateInput(data);

    this.packageName = data.packageName;
    this.packageVersion = data.packageVersion;
    this.analysisId = data.analysisId || uuidv4();
    this.timestamp = data.timestamp || new Date();
    this.overallRiskScore = data.overallRiskScore;
    this.riskLevel = data.riskLevel;
    this.securityAlerts = data.securityAlerts;
    this.analysisMetadata = data.analysisMetadata;
    this.recommendations = data.recommendations;
    this.executionTime = data.executionTime;
    this.cacheExpiry = data.cacheExpiry || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days default
  }

  private validateInput(data: any): void {
    if (!data.packageName || typeof data.packageName !== 'string') {
      throw new Error('Package name is required and must be a string');
    }

    if (!data.packageVersion || typeof data.packageVersion !== 'string') {
      throw new Error('Package version is required and must be a string');
    }

    if (typeof data.overallRiskScore !== 'number' || data.overallRiskScore < 0 || data.overallRiskScore > 100) {
      throw new Error('Overall risk score must be between 0 and 100');
    }

    if (typeof data.executionTime !== 'number' || data.executionTime <= 0) {
      throw new Error('Execution time must be a positive number');
    }

    if (!Array.isArray(data.securityAlerts)) {
      throw new Error('Security alerts must be an array');
    }

    // Validate timestamp is recent (within last 24 hours for valid analysis)
    if (data.timestamp) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (data.timestamp < twentyFourHoursAgo) {
        throw new Error('Timestamp must be within last 24 hours for valid analysis');
      }
    }

    // Validate cache expiry is after timestamp
    if (data.cacheExpiry && data.timestamp) {
      if (data.cacheExpiry <= data.timestamp) {
        throw new Error('Cache expiry must be after timestamp');
      }
    }
  }

  /**
   * Get unique identifier for this report
   */
  getIdentifier(): string {
    return `${this.packageName}@${this.packageVersion}`;
  }

  /**
   * Check if the analysis found any security issues
   */
  hasSecurityIssues(): boolean {
    return this.securityAlerts.length > 0;
  }

  /**
   * Get high-priority alerts only
   */
  getHighPriorityAlerts(): SecurityAlert[] {
    return this.securityAlerts.filter(alert => alert.isHighPriority());
  }

  /**
   * Check if the report has expired
   */
  isExpired(): boolean {
    return new Date() > this.cacheExpiry;
  }

  /**
   * Get the total number of security issues
   */
  getTotalSecurityIssues(): number {
    return this.securityAlerts.length;
  }

  /**
   * Calculate risk level based on alerts
   */
  static calculateRiskLevel(alerts: SecurityAlert[]): RiskLevel {
    if (alerts.length === 0) {
      return RiskLevel.LOW;
    }

    const hasCritical = alerts.some(alert => alert.severity === 'CRITICAL');
    const hasHigh = alerts.some(alert => alert.severity === 'HIGH');
    const hasMedium = alerts.some(alert => alert.severity === 'MEDIUM');

    if (hasCritical) {
      return RiskLevel.CRITICAL;
    } else if (hasHigh) {
      return RiskLevel.HIGH;
    } else if (hasMedium) {
      return RiskLevel.MEDIUM;
    } else {
      return RiskLevel.LOW;
    }
  }

  /**
   * Get formatted summary of the analysis
   */
  getSummary(): string {
    const issueCount = this.getTotalSecurityIssues();
    const executionTimeSeconds = (this.executionTime / 1000).toFixed(1);
    
    return `Analysis of ${this.getIdentifier()}: ${this.riskLevel} risk (${this.overallRiskScore}/100), ${issueCount} security issues found. Analysis took ${executionTimeSeconds}s.`;
  }

  /**
   * Get analysis statistics
   */
  getStats() {
    return {
      packageName: this.packageName,
      packageVersion: this.packageVersion,
      riskLevel: this.riskLevel,
      overallRiskScore: this.overallRiskScore,
      totalAlerts: this.securityAlerts.length,
      highPriorityAlerts: this.getHighPriorityAlerts().length,
      hasRecommendations: Boolean(this.recommendations && this.recommendations.length > 0),
      executionTimeMs: this.executionTime,
      analysisDate: this.timestamp.toISOString(),
      expired: this.isExpired(),
    };
  }
}