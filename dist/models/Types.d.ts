export declare enum RiskLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare enum Severity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare enum AlertCategory {
    MALWARE = "MALWARE",
    VULNERABILITY = "VULNERABILITY",
    SUSPICIOUS_CODE = "SUSPICIOUS_CODE",
    OUTDATED = "OUTDATED",
    TYPOSQUATTING = "TYPOSQUATTING"
}
export declare enum DetectionMethod {
    STATIC_ANALYSIS = "STATIC_ANALYSIS",
    LLM_ANALYSIS = "LLM_ANALYSIS",
    SIGNATURE_MATCH = "SIGNATURE_MATCH",
    BEHAVIORAL_ANALYSIS = "BEHAVIORAL_ANALYSIS"
}
export declare enum MigrationEffort {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export declare enum AnalysisStatus {
    PENDING = "PENDING",
    ANALYZING = "ANALYZING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED"
}
export interface PackageMaintainer {
    name: string;
    email?: string;
    url?: string;
}
export interface PackageDependency {
    name: string;
    version: string;
    optional: boolean;
}
export interface AnalysisMetadata {
    analyzerId: string;
    llmModel?: string;
    staticAnalysisTools: string[];
    analysisDepth: number;
    timeoutReached: boolean;
}
export interface AnalysisOptions {
    depth?: number;
    timeout?: number;
    llmModel?: string;
    useCache?: boolean;
    severity?: string;
}
export interface CacheStats {
    totalEntries: number;
    sizeInMB: number;
    hitRate: number;
    oldestEntry?: Date;
}
//# sourceMappingURL=Types.d.ts.map