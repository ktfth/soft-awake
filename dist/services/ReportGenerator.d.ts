import { AnalysisReport } from '../models/AnalysisReport';
export declare class ReportGenerator {
    private templatesCorrupted;
    generateReport(reports: AnalysisReport[], format: string): Promise<string>;
    supportsFormat(format: string): boolean;
    corruptTemplates(): void;
    private generateJsonReport;
    private generateTextReport;
    private generateHtmlReport;
    private calculateOverallRisk;
    private getSeverityEmoji;
}
//# sourceMappingURL=ReportGenerator.d.ts.map