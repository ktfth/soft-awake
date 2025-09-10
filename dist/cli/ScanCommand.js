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
exports.ScanCommand = void 0;
const fs = __importStar(require("fs"));
class ScanCommand {
    async execute(args, options = {}) {
        try {
            const packageJsonPath = args[0] || options.file || './package.json';
            if (!fs.existsSync(packageJsonPath)) {
                throw new Error('Package.json file not found');
            }
            const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const packages = await this.parsePackageJson(packageJsonContent, options);
            console.log(`Found ${packages.length} packages to analyze`);
            return 0;
        }
        catch (error) {
            if (error.message.includes('not found')) {
                throw new Error('Package.json file not found');
            }
            if (error instanceof SyntaxError) {
                throw new Error('Invalid package.json format');
            }
            throw error;
        }
    }
    async parsePackageJson(packageJson, options) {
        const packages = [];
        if (packageJson.dependencies) {
            packages.push(...Object.keys(packageJson.dependencies));
        }
        if (options.includeDev && packageJson.devDependencies) {
            packages.push(...Object.keys(packageJson.devDependencies));
        }
        if (options.exclude) {
            return packages.filter(pkg => {
                return !options.exclude.some(pattern => {
                    if (pattern.includes('*')) {
                        const prefix = pattern.replace('*', '');
                        return pkg.startsWith(prefix);
                    }
                    return pkg === pattern;
                });
            });
        }
        return packages;
    }
}
exports.ScanCommand = ScanCommand;
//# sourceMappingURL=ScanCommand.js.map