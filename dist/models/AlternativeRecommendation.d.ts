import { MigrationEffort } from './Types';
export declare class AlternativeRecommendation {
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
    });
    private validateInput;
    getOverallScore(): number;
    isStrongRecommendation(): boolean;
    getMigrationComplexity(): string;
    isFresh(): boolean;
    getSummary(): string;
    getMetrics(): {
        originalPackage: string;
        recommendedPackage: string;
        recommendedVersion: string;
        overallScore: number;
        scores: {
            security: number;
            popularity: number;
            maintenance: number;
        };
        migrationEffort: MigrationEffort;
        isStrongRecommendation: boolean;
        isFresh: boolean;
        lastUpdated: string;
    };
}
//# sourceMappingURL=AlternativeRecommendation.d.ts.map