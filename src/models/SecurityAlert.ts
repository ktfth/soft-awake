import { Severity, AlertCategory, DetectionMethod } from './Types';

export class SecurityAlert {
  alertId: string;
  packageName: string;
  packageVersion: string;
  severity: Severity;
  category: AlertCategory;
  title: string;
  description: string;
  cveId?: string;
  referenceUrls?: string[];
  detectionMethod: DetectionMethod;
  confidence: number;
  remediation?: string;
  affectedVersions?: string;
  fixedInVersion?: string;

  constructor(data: {
    alertId: string;
    packageName: string;
    packageVersion: string;
    severity: Severity;
    category: AlertCategory;
    title: string;
    description: string;
    detectionMethod: DetectionMethod;
    confidence: number;
    cveId?: string;
    referenceUrls?: string[];
    remediation?: string;
    affectedVersions?: string;
    fixedInVersion?: string;
  }) {
    this.validateInput(data);

    this.alertId = data.alertId;
    this.packageName = data.packageName;
    this.packageVersion = data.packageVersion;
    this.severity = data.severity;
    this.category = data.category;
    this.title = data.title;
    this.description = data.description;
    this.detectionMethod = data.detectionMethod;
    this.confidence = data.confidence;
    this.cveId = data.cveId;
    this.referenceUrls = data.referenceUrls;
    this.remediation = data.remediation;
    this.affectedVersions = data.affectedVersions;
    this.fixedInVersion = data.fixedInVersion;
  }

  private validateInput(data: any): void {
    // Validate required fields
    if (!data.alertId || typeof data.alertId !== 'string') {
      throw new Error('Alert ID is required and must be a string');
    }

    if (!data.packageName || typeof data.packageName !== 'string') {
      throw new Error('Package name is required and must be a string');
    }

    if (!data.packageVersion || typeof data.packageVersion !== 'string') {
      throw new Error('Package version is required and must be a string');
    }

    if (!data.title || typeof data.title !== 'string') {
      throw new Error('Alert title is required and must be a string');
    }

    if (!data.description || typeof data.description !== 'string') {
      throw new Error('Alert description is required and must be a string');
    }

    // Validate confidence is 0-100
    if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 100) {
      throw new Error('Confidence must be an integer between 0 and 100');
    }

    // Validate CVE ID format if provided
    if (data.cveId) {
      const cveRegex = /^CVE-\d{4}-\d+$/;
      if (!cveRegex.test(data.cveId)) {
        throw new Error('CVE ID must match format CVE-YYYY-NNNN');
      }
    }

    // Validate reference URLs if provided
    if (data.referenceUrls) {
      if (!Array.isArray(data.referenceUrls)) {
        throw new Error('Reference URLs must be an array');
      }
      
      for (const url of data.referenceUrls) {
        if (!this.isValidUrl(url)) {
          throw new Error('All reference URLs must be valid URLs');
        }
      }
    }

    // Validate severity and confidence alignment
    if (data.severity === Severity.CRITICAL && data.confidence <= 90) {
      throw new Error('CRITICAL severity requires confidence > 90%');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if this is a high-priority alert
   */
  isHighPriority(): boolean {
    return this.severity === Severity.HIGH || this.severity === Severity.CRITICAL;
  }

  /**
   * Check if this alert has a CVE assigned
   */
  hasCVE(): boolean {
    return Boolean(this.cveId);
  }

  /**
   * Get severity level as numeric value for sorting
   */
  getSeverityLevel(): number {
    switch (this.severity) {
      case Severity.LOW:
        return 1;
      case Severity.MEDIUM:
        return 2;
      case Severity.HIGH:
        return 3;
      case Severity.CRITICAL:
        return 4;
      default:
        return 0;
    }
  }

  /**
   * Check if alert is actionable (has remediation info)
   */
  isActionable(): boolean {
    return Boolean(this.remediation || this.fixedInVersion);
  }

  /**
   * Get formatted alert summary
   */
  getSummary(): string {
    return `[${this.severity}] ${this.title} (${this.confidence}% confidence)`;
  }
}