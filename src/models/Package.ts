import { PackageMaintainer, PackageDependency } from './Types';
import * as semver from 'semver';

export class Package {
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
  }) {
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

  private validateInput(data: any): void {
    // Validate package name follows npm naming rules
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Package name is required and must be a string');
    }
    
    const nameRegex = /^[a-z0-9][a-z0-9-._]*$/;
    if (!nameRegex.test(data.name)) {
      throw new Error('Package name must follow npm naming rules (lowercase, hyphens, no spaces)');
    }

    // Validate version is valid semver
    if (!data.version || typeof data.version !== 'string') {
      throw new Error('Package version is required and must be a string');
    }

    if (!semver.valid(data.version)) {
      throw new Error('Package version must be valid semver format');
    }

    // Validate publishedDate
    if (!data.publishedDate || !(data.publishedDate instanceof Date)) {
      throw new Error('Published date is required and must be a valid Date');
    }

    // Validate downloadCount if provided
    if (data.downloadCount !== undefined) {
      if (typeof data.downloadCount !== 'number' || data.downloadCount < 0) {
        throw new Error('Download count must be a non-negative integer');
      }
    }

    // Validate URLs if provided
    if (data.repositoryUrl && !this.isValidUrl(data.repositoryUrl)) {
      throw new Error('Repository URL must be a valid URL');
    }

    if (data.homepage && !this.isValidUrl(data.homepage)) {
      throw new Error('Homepage URL must be a valid URL');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get a unique identifier for this package
   */
  getIdentifier(): string {
    return `${this.name}@${this.version}`;
  }

  /**
   * Check if this package has dependencies
   */
  hasDependencies(): boolean {
    return Boolean(this.dependencies && this.dependencies.length > 0);
  }

  /**
   * Get all dependencies (production + dev)
   */
  getAllDependencies(): PackageDependency[] {
    const deps: PackageDependency[] = [];
    
    if (this.dependencies) {
      deps.push(...this.dependencies);
    }
    
    if (this.devDependencies) {
      deps.push(...this.devDependencies);
    }
    
    return deps;
  }

  /**
   * Check if package is likely abandoned (no updates in 2+ years)
   */
  isLikelyAbandoned(): boolean {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    return this.publishedDate < twoYearsAgo;
  }
}