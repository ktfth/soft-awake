import { Severity, AlertCategory, DetectionMethod } from './Types';
export declare class SecurityAlert {
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
    });
    private validateInput;
    private isValidUrl;
    isHighPriority(): boolean;
    hasCVE(): boolean;
    getSeverityLevel(): number;
    isActionable(): boolean;
    getSummary(): string;
}
//# sourceMappingURL=SecurityAlert.d.ts.map