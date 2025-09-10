"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyTree = void 0;
class DependencyTree {
    constructor(data) {
        this.validateInput(data);
        this.rootPackage = data.rootPackage;
        this.nodes = data.nodes;
        this.maxDepth = data.maxDepth;
        this.totalNodes = data.totalNodes;
        this.analysisComplete = data.analysisComplete;
        this.buildTimestamp = data.buildTimestamp;
        this.criticalPath = data.criticalPath;
    }
    validateInput(data) {
        if (!data.rootPackage) {
            throw new Error('Root package is required');
        }
        if (!Array.isArray(data.nodes)) {
            throw new Error('Nodes must be an array');
        }
        if (typeof data.maxDepth !== 'number' || data.maxDepth < 1 || data.maxDepth > 15) {
            throw new Error('Max depth must be between 1 and 15');
        }
        if (typeof data.totalNodes !== 'number' || data.totalNodes !== data.nodes.length) {
            throw new Error('Total nodes must match nodes array length');
        }
        if (data.criticalPath && !Array.isArray(data.criticalPath)) {
            throw new Error('Critical path must be an array');
        }
        if (data.criticalPath) {
            const nodeNames = new Set(data.nodes.map((node) => node.package.name));
            for (const pathElement of data.criticalPath) {
                if (!nodeNames.has(pathElement)) {
                    throw new Error('All critical path elements must exist in nodes');
                }
            }
        }
    }
    getDirectDependencies() {
        return this.nodes.filter((node) => node.isDirect);
    }
    getNodesAtDepth(depth) {
        return this.nodes.filter((node) => node.depth === depth);
    }
    findNode(packageName) {
        return this.nodes.find(node => node.package.name === packageName);
    }
    getPackageNames() {
        return [...new Set(this.nodes.map(node => node.package.name))];
    }
    hasCircularDependencies() {
        const visited = new Set();
        const recursionStack = new Set();
        const hasCircle = (nodeName) => {
            if (recursionStack.has(nodeName)) {
                return true;
            }
            if (visited.has(nodeName)) {
                return false;
            }
            visited.add(nodeName);
            recursionStack.add(nodeName);
            const node = this.findNode(nodeName);
            if (node && node.package.dependencies) {
                for (const dep of node.package.dependencies) {
                    if (this.findNode(dep.name) && hasCircle(dep.name)) {
                        return true;
                    }
                }
            }
            recursionStack.delete(nodeName);
            return false;
        };
        return hasCircle(this.rootPackage.name);
    }
    getStats() {
        return {
            totalNodes: this.totalNodes,
            maxDepth: this.maxDepth,
            directDependencies: this.getDirectDependencies().length,
            analysisComplete: this.analysisComplete,
            hasCircularDependencies: this.hasCircularDependencies(),
            buildTime: this.buildTimestamp.toISOString(),
        };
    }
}
exports.DependencyTree = DependencyTree;
//# sourceMappingURL=DependencyTree.js.map