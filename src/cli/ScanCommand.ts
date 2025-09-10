import * as fs from 'fs';
import * as path from 'path';

export interface ScanCommandOptions {
  file?: string;
  includeDev?: boolean;
  exclude?: string[];
  format?: string;
  output?: string;
}

export class ScanCommand {
  async execute(args: string[], options: ScanCommandOptions = {}): Promise<number> {
    try {
      const packageJsonPath = args[0] || options.file || './package.json';
      
      // Validate file exists
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error('Package.json file not found');
      }

      // Parse package.json
      const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const packages = await this.parsePackageJson(packageJsonContent, options);

      console.log(`Found ${packages.length} packages to analyze`);
      return 0;

    } catch (error: any) {
      if (error.message.includes('not found')) {
        throw new Error('Package.json file not found');
      }
      if (error instanceof SyntaxError) {
        throw new Error('Invalid package.json format');
      }
      throw error;
    }
  }

  async parsePackageJson(packageJson: any, options: ScanCommandOptions): Promise<string[]> {
    const packages: string[] = [];

    // Add production dependencies
    if (packageJson.dependencies) {
      packages.push(...Object.keys(packageJson.dependencies));
    }

    // Add dev dependencies if requested
    if (options.includeDev && packageJson.devDependencies) {
      packages.push(...Object.keys(packageJson.devDependencies));
    }

    // Apply exclusions
    if (options.exclude) {
      return packages.filter(pkg => {
        return !options.exclude!.some(pattern => {
          // Simple pattern matching for testing
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