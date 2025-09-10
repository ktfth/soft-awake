import { Package } from '../models/Package';
import { DependencyTree } from '../models/DependencyTree';
export declare class NPMClient {
    private registryUrl;
    private cache;
    constructor(options?: {
        registryUrl?: string;
    });
    getPackageInfo(name: string, version: string): Promise<Package>;
    getDependencyTree(packageInfo: Package, maxDepth: number): Promise<DependencyTree>;
    private buildDependencyNodes;
    private parseDependencies;
    private generateMockDependencies;
}
//# sourceMappingURL=NPMClient.d.ts.map