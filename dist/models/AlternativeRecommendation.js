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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternativeRecommendation = void 0;
const Types_1 = require("./Types");
const semver = __importStar(require("semver"));
class AlternativeRecommendation {
    constructor(data) {
        this.validateInput(data);
        this.originalPackage = data.originalPackage;
        this.recommendedPackage = data.recommendedPackage;
        this.recommendedVersion = data.recommendedVersion;
        this.justification = data.justification;
        this.securityScore = data.securityScore;
        this.popularityScore = data.popularityScore;
        this.maintenanceScore = data.maintenanceScore;
        this.migrationEffort = data.migrationEffort;
        this.compatibilityNotes = data.compatibilityNotes;
        this.lastUpdated = data.lastUpdated || new Date();
    }
    validateInput(data) {
        if (!data.originalPackage || typeof data.originalPackage !== 'string') {
            throw new Error('Original package is required and must be a string');
        }
        if (!data.recommendedPackage || typeof data.recommendedPackage !== 'string') {
            throw new Error('Recommended package is required and must be a string');
        }
        if (data.originalPackage === data.recommendedPackage) {
            throw new Error('Recommended package must be different from original package');
        }
        if (!data.recommendedVersion || typeof data.recommendedVersion !== 'string') {
            throw new Error('Recommended version is required and must be a string');
        }
        if (!semver.validRange(data.recommendedVersion)) {
            throw new Error('Recommended version must be valid semver');
        }
        if (!data.justification || typeof data.justification !== 'string') {
            throw new Error('Justification is required and must be a string');
        }
        const scores = ['securityScore', 'popularityScore', 'maintenanceScore'];
        for (const scoreField of scores) {
            const score = data[scoreField];
            if (typeof score !== 'number' || score < 0 || score > 100 || !Number.isInteger(score)) {
                throw new Error(`${scoreField} must be an integer between 0 and 100`);
            }
        }
        if (data.lastUpdated) {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            if (data.lastUpdated < thirtyDaysAgo) {
                throw new Error('Last updated must be within the last 30 days');
            }
        }
    }
    getOverallScore() {
        const securityWeight = 0.5;
        const popularityWeight = 0.25;
        const maintenanceWeight = 0.25;
        return Math.round(this.securityScore * securityWeight +
            this.popularityScore * popularityWeight +
            this.maintenanceScore * maintenanceWeight);
    }
    isStrongRecommendation() {
        return this.getOverallScore() >= 80 && this.securityScore >= 85;
    }
    getMigrationComplexity() {
        switch (this.migrationEffort) {
            case Types_1.MigrationEffort.LOW:
                return 'Drop-in replacement with minimal changes';
            case Types_1.MigrationEffort.MEDIUM:
                return 'Some API changes required';
            case Types_1.MigrationEffort.HIGH:
                return 'Significant refactoring needed';
            default:
                return 'Unknown complexity';
        }
    }
    isFresh() {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return this.lastUpdated > sevenDaysAgo;
    }
    getSummary() {
        const overallScore = this.getOverallScore();
        const effort = this.migrationEffort.toLowerCase();
        return `Replace ${this.originalPackage} with ${this.recommendedPackage}@${this.recommendedVersion} (${overallScore}/100 score, ${effort} effort): ${this.justification}`;
    }
    getMetrics() {
        return {
            originalPackage: this.originalPackage,
            recommendedPackage: this.recommendedPackage,
            recommendedVersion: this.recommendedVersion,
            overallScore: this.getOverallScore(),
            scores: {
                security: this.securityScore,
                popularity: this.popularityScore,
                maintenance: this.maintenanceScore,
            },
            migrationEffort: this.migrationEffort,
            isStrongRecommendation: this.isStrongRecommendation(),
            isFresh: this.isFresh(),
            lastUpdated: this.lastUpdated.toISOString(),
        };
    }
}
exports.AlternativeRecommendation = AlternativeRecommendation;
//# sourceMappingURL=AlternativeRecommendation.js.map