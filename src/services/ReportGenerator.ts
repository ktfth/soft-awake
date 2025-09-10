import { AnalysisReport } from '../models/AnalysisReport';

export class ReportGenerator {
  private templatesCorrupted = false;

  async generateReport(reports: AnalysisReport[], format: string): Promise<string> {
    // Check for unsupported format
    if (!this.supportsFormat(format)) {
      throw new Error('UnsupportedFormat');
    }

    // Check for template corruption (for testing)
    if (this.templatesCorrupted) {
      throw new Error('TemplateError');
    }

    switch (format.toLowerCase()) {
      case 'json':
        return this.generateJsonReport(reports);
      case 'text':
        return this.generateTextReport(reports);
      case 'html':
        return this.generateHtmlReport(reports);
      default:
        throw new Error('UnsupportedFormat');
    }
  }

  supportsFormat(format: string): boolean {
    const supportedFormats = ['json', 'text', 'html'];
    return supportedFormats.includes(format.toLowerCase());
  }

  // Method to corrupt templates for testing
  corruptTemplates(): void {
    this.templatesCorrupted = true;
  }

  private generateJsonReport(reports: AnalysisReport[]): string {
    const summary = {
      totalPackages: reports.length,
      securityIssues: reports.reduce((sum, report) => sum + report.securityAlerts.length, 0),
      overallRisk: this.calculateOverallRisk(reports),
      analysisTime: reports.reduce((sum, report) => sum + report.executionTime, 0),
    };

    return JSON.stringify({
      summary,
      packages: reports.map(report => ({
        packageName: report.packageName,
        packageVersion: report.packageVersion,
        analysisId: report.analysisId,
        timestamp: report.timestamp.toISOString(),
        overallRiskScore: report.overallRiskScore,
        riskLevel: report.riskLevel,
        securityAlerts: report.securityAlerts.map(alert => ({
          alertId: alert.alertId,
          severity: alert.severity,
          category: alert.category,
          title: alert.title,
          description: alert.description,
          cveId: alert.cveId,
          referenceUrls: alert.referenceUrls,
          detectionMethod: alert.detectionMethod,
          confidence: alert.confidence,
          remediation: alert.remediation,
          affectedVersions: alert.affectedVersions,
          fixedInVersion: alert.fixedInVersion,
        })),
        analysisMetadata: report.analysisMetadata,
        recommendations: report.recommendations?.map(rec => ({
          originalPackage: rec.originalPackage,
          recommendedPackage: rec.recommendedPackage,
          recommendedVersion: rec.recommendedVersion,
          justification: rec.justification,
          securityScore: rec.securityScore,
          popularityScore: rec.popularityScore,
          maintenanceScore: rec.maintenanceScore,
          migrationEffort: rec.migrationEffort,
        })),
        executionTime: report.executionTime,
      })),
    }, null, 2);
  }

  private generateTextReport(reports: AnalysisReport[]): string {
    if (reports.length === 0) {
      return '🔍 No packages analyzed\n';
    }

    let output = '📊 SECURITY REPORT\n';
    output += '='.repeat(50) + '\n\n';

    for (const report of reports) {
      output += `Package: ${report.packageName}@${report.packageVersion}\n`;
      output += `Risk Level: ${report.riskLevel}\n`;
      output += `Overall Score: ${report.overallRiskScore}/100\n`;
      
      if (report.securityAlerts.length > 0) {
        output += `\n⚠️  FINDINGS (${report.securityAlerts.length}):\n`;
        
        for (const alert of report.securityAlerts) {
          const emoji = this.getSeverityEmoji(alert.severity);
          output += `${emoji} [${alert.severity}] ${alert.title}\n`;
          if (alert.cveId) {
            output += `  - CVE: ${alert.cveId}\n`;
          }
          if (alert.remediation) {
            output += `  - Fix: ${alert.remediation}\n`;
          }
          output += `  - Confidence: ${alert.confidence}%\n`;
        }
      }

      if (report.recommendations && report.recommendations.length > 0) {
        output += `\n💡 RECOMMENDATIONS:\n`;
        for (const rec of report.recommendations) {
          output += `• ${rec.recommendedPackage}@${rec.recommendedVersion}\n`;
          output += `  ${rec.justification}\n`;
        }
      }

      const analysisTimeSeconds = (report.executionTime / 1000).toFixed(1);
      output += `\n⏱  Analysis time: ${analysisTimeSeconds}s | Cached: No\n`;
      output += '-'.repeat(50) + '\n\n';
    }

    return output;
  }

  private generateHtmlReport(reports: AnalysisReport[]): string {
    const summary = {
      totalPackages: reports.length,
      securityIssues: reports.reduce((sum, report) => sum + report.securityAlerts.length, 0),
      overallRisk: this.calculateOverallRisk(reports),
    };

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NPM Security Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .package { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .risk-low { border-left: 5px solid #28a745; }
        .risk-medium { border-left: 5px solid #ffc107; }
        .risk-high { border-left: 5px solid #fd7e14; }
        .risk-critical { border-left: 5px solid #dc3545; }
        .alert { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 3px; }
        .tree-placeholder { background: #e9ecef; padding: 20px; text-align: center; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>NPM Package Security Analysis Report</h1>
    
    <div class="summary">
        <h2>Executive Summary</h2>
        <p><strong>Total Packages:</strong> ${summary.totalPackages}</p>
        <p><strong>Security Issues:</strong> ${summary.securityIssues}</p>
        <p><strong>Overall Risk Level:</strong> ${summary.overallRisk}</p>
    </div>`;

    for (const report of reports) {
      const riskClass = `risk-${report.riskLevel.toLowerCase()}`;
      
      html += `
    <div class="package ${riskClass}">
        <h3>${report.packageName}@${report.packageVersion}</h3>
        <p><strong>Risk Level:</strong> ${report.riskLevel}</p>
        <p><strong>Risk Score:</strong> ${report.overallRiskScore}/100</p>
        
        <div class="tree-placeholder">
            <strong>Dependency Tree Visualization</strong><br>
            └─ ${report.packageName}@${report.packageVersion}
        </div>`;

      if (report.securityAlerts.length > 0) {
        html += `
        <h4>Security Alerts (${report.securityAlerts.length})</h4>`;
        
        for (const alert of report.securityAlerts) {
          html += `
        <div class="alert">
            <strong>[${alert.severity}] ${alert.title}</strong><br>
            ${alert.description}<br>
            <small>Confidence: ${alert.confidence}% | Method: ${alert.detectionMethod}</small>`;
          
          if (alert.referenceUrls && alert.referenceUrls.length > 0) {
            html += `<br><a href="${alert.referenceUrls[0]}" target="_blank">Reference</a>`;
          }
          
          html += `
        </div>`;
        }
      }

      html += `
    </div>`;
    }

    html += `
</body>
</html>`;

    return html;
  }

  private calculateOverallRisk(reports: AnalysisReport[]): string {
    if (reports.length === 0) {
      return 'LOW';
    }

    const hasCritical = reports.some(r => r.riskLevel === 'CRITICAL');
    const hasHigh = reports.some(r => r.riskLevel === 'HIGH');
    const hasMedium = reports.some(r => r.riskLevel === 'MEDIUM');

    if (hasCritical) {
      return 'CRITICAL';
    } else if (hasHigh) {
      return 'HIGH';
    } else if (hasMedium) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  private getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'CRITICAL':
        return '🚨';
      case 'HIGH':
        return '🔴';
      case 'MEDIUM':
        return '⚠️';
      case 'LOW':
        return '🟡';
      default:
        return '🔍';
    }
  }
}