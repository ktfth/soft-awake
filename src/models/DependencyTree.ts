import { Package } from './Package';
import { AnalysisStatus } from './Types';

export interface DependencyNode {
  package: Package;
  parent?: string;
  depth: number;
  isDirect: boolean;
  analysisStatus: AnalysisStatus;
}

export class DependencyTree {
  rootPackage: Package;
  nodes: DependencyNode[];
  maxDepth: number;
  totalNodes: number;
  analysisComplete: boolean;
  criticalPath?: string[];
  buildTimestamp: Date;

  constructor(data: {
    rootPackage: Package;
    nodes: DependencyNode[];
    maxDepth: number;
    totalNodes: number;
    analysisComplete: boolean;
    buildTimestamp: Date;
    criticalPath?: string[];
  }) {
    this.validateInput(data);

    this.rootPackage = data.rootPackage;
    this.nodes = data.nodes;
    this.maxDepth = data.maxDepth;
    this.totalNodes = data.totalNodes;
    this.analysisComplete = data.analysisComplete;
    this.buildTimestamp = data.buildTimestamp;
    this.criticalPath = data.criticalPath;
  }

  private validateInput(data: any): void {
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

    // Validate all critical path elements exist in nodes
    if (data.criticalPath) {
      const nodeNames = new Set(data.nodes.map((node: DependencyNode) => node.package.name));
      for (const pathElement of data.criticalPath) {
        if (!nodeNames.has(pathElement)) {
          throw new Error('All critical path elements must exist in nodes');
        }
      }
    }
  }

  /**
   * Get direct dependencies (depth 1)
   */
  getDirectDependencies(): DependencyNode[] {
    return this.nodes.filter((node: DependencyNode) => node.isDirect);
  }

  /**
   * Get nodes at specific depth
   */
  getNodesAtDepth(depth: number): DependencyNode[] {
    return this.nodes.filter((node: DependencyNode) => node.depth === depth);
  }

  /**
   * Find node by package name
   */
  findNode(packageName: string): DependencyNode | undefined {
    return this.nodes.find(node => node.package.name === packageName);
  }

  /**
   * Get all unique package names in the tree
   */
  getPackageNames(): string[] {
    return [...new Set(this.nodes.map(node => node.package.name))];
  }

  /**
   * Check if tree contains circular dependencies
   */
  hasCircularDependencies(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCircle = (nodeName: string): boolean => {
      if (recursionStack.has(nodeName)) {
        return true;
      }
      if (visited.has(nodeName)) {
        return false;
      }

      visited.add(nodeName);
      recursionStack.add(nodeName);

      // Check children
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

  /**
   * Get statistics about the dependency tree
   */
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