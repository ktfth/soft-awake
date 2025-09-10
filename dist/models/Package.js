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
exports.Package = void 0;
const semver = __importStar(require("semver"));
class Package {
    constructor(data) {
        this.validateInput(data);
        this.name = data.name;
        this.version = data.version;
        this.publishedDate = data.publishedDate;
        this.description = data.description;
        this.maintainers = data.maintainers;
        this.downloadCount = data.downloadCount;
        this.repositoryUrl = data.repositoryUrl;
        this.homepage = data.homepage;
        this.license = data.license;
        this.dependencies = data.dependencies;
        this.devDependencies = data.devDependencies;
    }
    validateInput(data) {
        if (!data.name || typeof data.name !== 'string') {
            throw new Error('Package name is required and must be a string');
        }
        const nameRegex = /^[a-z0-9][a-z0-9-._]*$/;
        if (!nameRegex.test(data.name)) {
            throw new Error('Package name must follow npm naming rules (lowercase, hyphens, no spaces)');
        }
        if (!data.version || typeof data.version !== 'string') {
            throw new Error('Package version is required and must be a string');
        }
        if (!semver.valid(data.version)) {
            throw new Error('Package version must be valid semver format');
        }
        if (!data.publishedDate || !(data.publishedDate instanceof Date)) {
            throw new Error('Published date is required and must be a valid Date');
        }
        if (data.downloadCount !== undefined) {
            if (typeof data.downloadCount !== 'number' || data.downloadCount < 0) {
                throw new Error('Download count must be a non-negative integer');
            }
        }
        if (data.repositoryUrl && !this.isValidUrl(data.repositoryUrl)) {
            throw new Error('Repository URL must be a valid URL');
        }
        if (data.homepage && !this.isValidUrl(data.homepage)) {
            throw new Error('Homepage URL must be a valid URL');
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
    getIdentifier() {
        return `${this.name}@${this.version}`;
    }
    hasDependencies() {
        return Boolean(this.dependencies && this.dependencies.length > 0);
    }
    getAllDependencies() {
        const deps = [];
        if (this.dependencies) {
            deps.push(...this.dependencies);
        }
        if (this.devDependencies) {
            deps.push(...this.devDependencies);
        }
        return deps;
    }
    isLikelyAbandoned() {
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        return this.publishedDate < twoYearsAgo;
    }
}
exports.Package = Package;
//# sourceMappingURL=Package.js.map