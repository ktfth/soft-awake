import { SecurityAlert } from './SecurityAlert';
import { AlternativeRecommendation } from './AlternativeRecommendation';
import { RiskLevel, AnalysisMetadata } from './Types';
export declare class AnalysisReport {
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
    });
    private validateInput;
    getIdentifier(): string;
    hasSecurityIssues(): boolean;
    getHighPriorityAlerts(): SecurityAlert[];
    isExpired(): boolean;
    getTotalSecurityIssues(): number;
    static calculateRiskLevel(alerts: SecurityAlert[]): RiskLevel;
    getSummary(): string;
    getStats(): {
        packageName: string;
        packageVersion: string;
        riskLevel: RiskLevel;
        overallRiskScore: number;
        totalAlerts: number;
        highPriorityAlerts: number;
        hasRecommendations: boolean;
        executionTimeMs: number;
        analysisDate: string;
        expired: boolean;
    };
}
//# sourceMappingURL=AnalysisReport.d.ts.map