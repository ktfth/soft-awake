import { PackageMaintainer, PackageDependency } from './Types';
export declare class Package {
    name: string;
    version: string;
    description?: string;
    maintainers?: PackageMaintainer[];
    downloadCount?: number;
    repositoryUrl?: string;
    homepage?: string;
    license?: string;
    publishedDate: Date;
    dependencies?: PackageDependency[];
    devDependencies?: PackageDependency[];
    constructor(data: {
        name: string;
        version: string;
        publishedDate: Date;
        description?: string;
        maintainers?: PackageMaintainer[];
        downloadCount?: number;
        repositoryUrl?: string;
        homepage?: string;
        license?: string;
        dependencies?: PackageDependency[];
        devDependencies?: PackageDependency[];
    });
    private validateInput;
    private isValidUrl;
    getIdentifier(): string;
    hasDependencies(): boolean;
    getAllDependencies(): PackageDependency[];
    isLikelyAbandoned(): boolean;
}
//# sourceMappingURL=Package.d.ts.map