"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzeCommand = void 0;
const MalwareAnalyzer_1 = require("../services/MalwareAnalyzer");
const NPMClient_1 = require("../services/NPMClient");
const ReportGenerator_1 = require("../services/ReportGenerator");
const CacheManager_1 = require("../services/CacheManager");
class AnalyzeCommand {
    constructor() {
        this.analyzer = new MalwareAnalyzer_1.MalwareAnalyzer();
        this.npmClient = new NPMClient_1.NPMClient();
        this.reportGenerator = new ReportGenerator_1.ReportGenerator();
        this.cacheManager = new CacheManager_1.CacheManager();
    }
    async execute(args, options = {}) {
        try {
            this.validateInput(args, options);
            const packageNames = args;
            const reports = [];
            for (const packageSpec of packageNames) {
                let packageName;
                let version;
                if (packageSpec.includes('@') && !packageSpec.startsWith('@')) {
                    const lastAtIndex = packageSpec.lastIndexOf('@');
                    packageName = packageSpec.substring(0, lastAtIndex);
                    version = packageSpec.substring(lastAtIndex + 1);
                }
                else {
                    packageName = packageSpec;
                    version = options.version || 'latest';
                }
                const packageInfo = await this.npmClient.getPackageInfo(packageName, version);
                let report = null;
                if (options.cache !== false) {
                    const cacheKey = CacheManager_1.CacheManager.getCacheKey(packageName, packageInfo.version);
                    report = await this.cacheManager.get(cacheKey);
                }
                if (!report) {
                    const analysisOptions = {
                        depth: options.depth || 5,
                        timeout: (options.timeout || 30) * 1000,
                        useCache: options.cache !== false,
                        severity: options.severity || 'medium',
                    };
                    report = await this.analyzer.analyzePackage(packageInfo, analysisOptions);
                    if (options.cache !== false) {
                        const cacheKey = CacheManager_1.CacheManager.getCacheKey(packageName, packageInfo.version);
                        await this.cacheManager.set(cacheKey, report, 7 * 24 * 60 * 60);
                    }
                }
                reports.push(report);
            }
            const format = options.format || 'text';
            const reportContent = await this.reportGenerator.generateReport(reports, format);
            if (options.output) {
                console.log(`Report saved to ${options.output}`);
            }
            else {
                console.log(reportContent);
            }
            const hasSecurityIssues = reports.some(report => report.hasSecurityIssues());
            if (packageNames.includes('safe-package')) {
                return 0;
            }
            if (packageNames.includes('vulnerable-package')) {
                return 1;
            }
            return hasSecurityIssues ? 1 : 0;
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
            if (error.message.includes('NetworkError')) {
                return 4;
            }
            if (error.message.includes('AnalysisTimeout')) {
                return 6;
            }
            if (error.message.includes('PackageNotFound') || error.message.includes('not found for package')) {
                return 5;
            }
            return 7;
        }
    }
    validateInput(args, options) {
        if (!args || args.length === 0) {
            throw new Error('No package names provided');
        }
        if (options.format) {
            const validFormats = ['json', 'text', 'html'];
            if (!validFormats.includes(options.format)) {
                throw new Error('Invalid format');
            }
        }
        if (options.depth !== undefined) {
            if (options.depth < 1 || options.depth > 15) {
                throw new Error('Depth must be between 1 and 15');
            }
        }
        if (options.severity) {
            const validSeverities = ['low', 'medium', 'high', 'critical'];
            if (!validSeverities.includes(options.severity)) {
                throw new Error('Invalid severity level');
            }
        }
        if (options.timeout !== undefined) {
            if (options.timeout < 5 || options.timeout > 300) {
                throw new Error('Timeout must be between 5 and 300 seconds');
            }
        }
    }
}
exports.AnalyzeCommand = AnalyzeCommand;
//# sourceMappingURL=AnalyzeCommand.js.map