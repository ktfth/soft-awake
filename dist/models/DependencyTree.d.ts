import { Package } from './Package';
import { AnalysisStatus } from './Types';
export interface DependencyNode {
    package: Package;
    parent?: string;
    depth: number;
    isDirect: boolean;
    analysisStatus: AnalysisStatus;
}
export declare class DependencyTree {
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
    });
    private validateInput;
    getDirectDependencies(): DependencyNode[];
    getNodesAtDepth(depth: number): DependencyNode[];
    findNode(packageName: string): DependencyNode | undefined;
    getPackageNames(): string[];
    hasCircularDependencies(): boolean;
    getStats(): {
        totalNodes: number;
        maxDepth: number;
        directDependencies: number;
        analysisComplete: boolean;
        hasCircularDependencies: boolean;
        buildTime: string;
    };
}
//# sourceMappingURL=DependencyTree.d.ts.map