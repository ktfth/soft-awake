"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityAlert = void 0;
const Types_1 = require("./Types");
class SecurityAlert {
    constructor(data) {
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
    validateInput(data) {
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
        if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 100) {
            throw new Error('Confidence must be an integer between 0 and 100');
        }
        if (data.cveId) {
            const cveRegex = /^CVE-\d{4}-\d+$/;
            if (!cveRegex.test(data.cveId)) {
                throw new Error('CVE ID must match format CVE-YYYY-NNNN');
            }
        }
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
        if (data.severity === Types_1.Severity.CRITICAL && data.confidence <= 90) {
            throw new Error('CRITICAL severity requires confidence > 90%');
        }
    }
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    isHighPriority() {
        return this.severity === Types_1.Severity.HIGH || this.severity === Types_1.Severity.CRITICAL;
    }
    hasCVE() {
        return Boolean(this.cveId);
    }
    getSeverityLevel() {
        switch (this.severity) {
            case Types_1.Severity.LOW:
                return 1;
            case Types_1.Severity.MEDIUM:
                return 2;
            case Types_1.Severity.HIGH:
                return 3;
            case Types_1.Severity.CRITICAL:
                return 4;
            default:
                return 0;
        }
    }
    isActionable() {
        return Boolean(this.remediation || this.fixedInVersion);
    }
    getSummary() {
        return `[${this.severity}] ${this.title} (${this.confidence}% confidence)`;
    }
}
exports.SecurityAlert = SecurityAlert;
//# sourceMappingURL=SecurityAlert.js.map