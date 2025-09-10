export interface WithdrawnVersionInfo {
    version: string;
    withdrawnDate?: Date;
    reason: 'security' | 'malware' | 'policy' | 'unknown';
    advisory?: string;
    description?: string;
}
export interface VersionGapAnalysis {
    suspiciousGaps: Array<{
        expectedVersion: string;
        missingVersions: string[];
        gapSize: number;
        likelihood: 'low' | 'medium' | 'high';
    }>;
    withdrawnVersions: WithdrawnVersionInfo[];
}
export declare class WithdrawnVersionDetector {
    private githubApiUrl;
    private npmSecurityUrl;
    analyzeVersionGaps(packageName: string, availableVersions: string[]): Promise<VersionGapAnalysis>;
    private detectSuspiciousGaps;
    private checkWithdrawnVersions;
    private checkVersionHistory;
    private checkGitHubSecurityAdvisory;
    private checkNPMWithdrawalIndicators;
    generateWithdrawnVersionReport(analysis: VersionGapAnalysis): string;
}
//# sourceMappingURL=WithdrawnVersionDetector.d.ts.map