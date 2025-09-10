"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawnVersionDetector = void 0;
const axios_1 = __importDefault(require("axios"));
const semver = __importStar(require("semver"));
class WithdrawnVersionDetector {
    constructor() {
        this.githubApiUrl = 'https://api.github.com';
        this.npmSecurityUrl = 'https://www.npmjs.com/advisories';
    }
    async analyzeVersionGaps(packageName, availableVersions) {
        const sortedVersions = availableVersions
            .filter(v => semver.valid(v))
            .sort(semver.compare);
        const suspiciousGaps = this.detectSuspiciousGaps(sortedVersions);
        const withdrawnVersions = await this.checkWithdrawnVersions(packageName, suspiciousGaps);
        return {
            suspiciousGaps,
            withdrawnVersions
        };
    }
    detectSuspiciousGaps(versions) {
        const gaps = [];
        for (let i = 0; i < versions.length - 1; i++) {
            const current = versions[i];
            const next = versions[i + 1];
            try {
                const currentParsed = semver.parse(current);
                const nextParsed = semver.parse(next);
                if (currentParsed && nextParsed &&
                    currentParsed.major === nextParsed.major &&
                    currentParsed.minor === nextParsed.minor) {
                    const patchGap = nextParsed.patch - currentParsed.patch;
                    if (patchGap > 1) {
                        const missingVersions = [];
                        for (let p = currentParsed.patch + 1; p < nextParsed.patch; p++) {
                            missingVersions.push(`${currentParsed.major}.${currentParsed.minor}.${p}`);
                        }
                        let likelihood = 'low';
                        if (patchGap === 2)
                            likelihood = 'high';
                        else if (patchGap > 3)
                            likelihood = 'medium';
                        gaps.push({
                            expectedVersion: `${currentParsed.major}.${currentParsed.minor}.${currentParsed.patch + 1}`,
                            missingVersions,
                            gapSize: missingVersions.length,
                            likelihood
                        });
                    }
                }
            }
            catch (error) {
                continue;
            }
        }
        return gaps;
    }
    async checkWithdrawnVersions(packageName, suspiciousGaps) {
        const withdrawnVersions = [];
        for (const gap of suspiciousGaps) {
            if (gap.likelihood === 'high') {
                for (const missingVersion of gap.missingVersions) {
                    try {
                        const info = await this.checkVersionHistory(packageName, missingVersion);
                        if (info) {
                            withdrawnVersions.push(info);
                        }
                    }
                    catch (error) {
                    }
                }
            }
        }
        return withdrawnVersions;
    }
    async checkVersionHistory(packageName, version) {
        try {
            const securityInfo = await this.checkGitHubSecurityAdvisory(packageName, version);
            if (securityInfo) {
                return securityInfo;
            }
            const npmInfo = await this.checkNPMWithdrawalIndicators(packageName, version);
            if (npmInfo) {
                return npmInfo;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async checkGitHubSecurityAdvisory(packageName, version) {
        try {
            const response = await axios_1.default.get(`${this.githubApiUrl}/advisories`, {
                params: {
                    ecosystem: 'npm',
                    package: packageName,
                    per_page: 100
                },
                timeout: 5000
            });
            const advisories = response.data;
            for (const advisory of advisories) {
                if (advisory.vulnerable_versions &&
                    semver.satisfies(version, advisory.vulnerable_versions)) {
                    return {
                        version,
                        reason: 'security',
                        advisory: advisory.ghsa_id,
                        description: advisory.summary,
                        withdrawnDate: new Date(advisory.published_at)
                    };
                }
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async checkNPMWithdrawalIndicators(packageName, version) {
        try {
            return {
                version,
                reason: 'unknown',
                description: `Version ${version} appears to be missing from the registry despite sequential versioning patterns, which may indicate withdrawal due to security or policy issues.`
            };
        }
        catch (error) {
            return null;
        }
    }
    generateWithdrawnVersionReport(analysis) {
        const { suspiciousGaps, withdrawnVersions } = analysis;
        if (suspiciousGaps.length === 0 && withdrawnVersions.length === 0) {
            return '✅ No suspicious version gaps detected.';
        }
        let report = '';
        if (withdrawnVersions.length > 0) {
            report += '🚨 POTENTIALLY WITHDRAWN VERSIONS DETECTED:\n';
            for (const withdrawn of withdrawnVersions) {
                report += `• Version ${withdrawn.version} - ${withdrawn.reason.toUpperCase()}`;
                if (withdrawn.advisory) {
                    report += ` (Advisory: ${withdrawn.advisory})`;
                }
                if (withdrawn.description) {
                    report += `\n  ${withdrawn.description}`;
                }
                report += '\n';
            }
            report += '\n';
        }
        if (suspiciousGaps.length > 0) {
            report += '⚠️  SUSPICIOUS VERSION GAPS:\n';
            for (const gap of suspiciousGaps) {
                if (gap.likelihood === 'high') {
                    report += `• High likelihood: Missing versions ${gap.missingVersions.join(', ')}\n`;
                    report += `  These versions may have been withdrawn due to security issues.\n`;
                }
                else if (gap.likelihood === 'medium') {
                    report += `• Medium likelihood: Gap of ${gap.gapSize} versions around ${gap.expectedVersion}\n`;
                }
            }
            report += '\n';
        }
        report += '💡 RECOMMENDATION: Verify these versions were not withdrawn due to vulnerabilities before using similar version ranges.';
        return report;
    }
}
exports.WithdrawnVersionDetector = WithdrawnVersionDetector;
//# sourceMappingURL=WithdrawnVersionDetector.js.map