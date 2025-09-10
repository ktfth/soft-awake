"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisReport = void 0;
const Types_1 = require("./Types");
const uuid_1 = require("uuid");
class AnalysisReport {
    constructor(data) {
        this.validateInput(data);
        this.packageName = data.packageName;
        this.packageVersion = data.packageVersion;
        this.analysisId = data.analysisId || (0, uuid_1.v4)();
        this.timestamp = data.timestamp || new Date();
        this.overallRiskScore = data.overallRiskScore;
        this.riskLevel = data.riskLevel;
        this.securityAlerts = data.securityAlerts;
        this.analysisMetadata = data.analysisMetadata;
        this.recommendations = data.recommendations;
        this.executionTime = data.executionTime;
        this.cacheExpiry = data.cacheExpiry || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    validateInput(data) {
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
        if (data.timestamp) {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            if (data.timestamp < twentyFourHoursAgo) {
                throw new Error('Timestamp must be within last 24 hours for valid analysis');
            }
        }
        if (data.cacheExpiry && data.timestamp) {
            if (data.cacheExpiry <= data.timestamp) {
                throw new Error('Cache expiry must be after timestamp');
            }
        }
    }
    getIdentifier() {
        return `${this.packageName}@${this.packageVersion}`;
    }
    hasSecurityIssues() {
        return this.securityAlerts.length > 0;
    }
    getHighPriorityAlerts() {
        return this.securityAlerts.filter(alert => alert.isHighPriority());
    }
    isExpired() {
        return new Date() > this.cacheExpiry;
    }
    getTotalSecurityIssues() {
        return this.securityAlerts.length;
    }
    static calculateRiskLevel(alerts) {
        if (alerts.length === 0) {
            return Types_1.RiskLevel.LOW;
        }
        const hasCritical = alerts.some(alert => alert.severity === 'CRITICAL');
        const hasHigh = alerts.some(alert => alert.severity === 'HIGH');
        const hasMedium = alerts.some(alert => alert.severity === 'MEDIUM');
        if (hasCritical) {
            return Types_1.RiskLevel.CRITICAL;
        }
        else if (hasHigh) {
            return Types_1.RiskLevel.HIGH;
        }
        else if (hasMedium) {
            return Types_1.RiskLevel.MEDIUM;
        }
        else {
            return Types_1.RiskLevel.LOW;
        }
    }
    getSummary() {
        const issueCount = this.getTotalSecurityIssues();
        const executionTimeSeconds = (this.executionTime / 1000).toFixed(1);
        return `Analysis of ${this.getIdentifier()}: ${this.riskLevel} risk (${this.overallRiskScore}/100), ${issueCount} security issues found. Analysis took ${executionTimeSeconds}s.`;
    }
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
exports.AnalysisReport = AnalysisReport;
//# sourceMappingURL=AnalysisReport.js.map