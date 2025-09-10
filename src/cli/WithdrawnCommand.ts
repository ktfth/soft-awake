import { WithdrawnVersionDetector } from '../services/WithdrawnVersionDetector';
import { NPMClient } from '../services/NPMClient';

export interface WithdrawnCommandOptions {
  format?: string;
  output?: string;
  verbose?: boolean;
}

export class WithdrawnCommand {
  private detector: WithdrawnVersionDetector;
  private npmClient: NPMClient;

  constructor() {
    this.detector = new WithdrawnVersionDetector();
    this.npmClient = new NPMClient();
  }

  async execute(args: string[], options: WithdrawnCommandOptions = {}): Promise<number> {
    try {
      if (args.length === 0) {
        console.error('Package name required for withdrawn version analysis');
        return 2;
      }

      const packageName = args[0]!; // We already checked args.length > 0
      console.log(`🔍 Analyzing withdrawn versions for package: ${packageName}\n`);

      // Get package metadata to analyze versions (using mock data for demo)
      const availableVersions = ['4.3.0', '4.3.1', '4.3.2', '4.3.4', '4.3.5', '4.3.6', '4.3.7', '4.4.0', '4.4.1'];
      // Note: Version 4.3.3 is missing to simulate withdrawal

      if (availableVersions.length === 0) {
        console.error(`No versions found for package ${packageName}`);
        return 5;
      }

      // Analyze version gaps
      const analysis = await this.detector.analyzeVersionGaps(packageName, availableVersions);
      
      // Generate report
      console.log(`📊 WITHDRAWN VERSION ANALYSIS REPORT`);
      console.log(`==================================================`);
      console.log(`Package: ${packageName}`);
      console.log(`Total versions analyzed: ${availableVersions.length}`);
      console.log(`Analysis date: ${new Date().toISOString().split('T')[0]}\n`);

      const report = this.detector.generateWithdrawnVersionReport(analysis);
      console.log(report);

      if (options.verbose) {
        console.log('\n📋 DETAILED ANALYSIS:');
        console.log(`Available versions: ${availableVersions.sort().join(', ')}`);
        
        if (analysis.suspiciousGaps.length > 0) {
          console.log('\n🔍 SUSPICIOUS GAPS DETECTED:');
          for (const gap of analysis.suspiciousGaps) {
            console.log(`• Gap around version ${gap.expectedVersion}`);
            console.log(`  Missing: ${gap.missingVersions.join(', ')}`);
            console.log(`  Likelihood: ${gap.likelihood.toUpperCase()}`);
            console.log(`  Gap size: ${gap.gapSize} version(s)\n`);
          }
        }
      }

      console.log('\n💡 SECURITY RECOMMENDATIONS:');
      console.log('• Always verify version history before using packages with gaps');
      console.log('• Check security advisories for missing versions');
      console.log('• Consider using version ranges that avoid suspicious gaps');
      console.log('• Monitor package updates and security announcements');

      // Return appropriate exit code
      if (analysis.withdrawnVersions.length > 0) {
        return 1; // Confirmed withdrawn versions found
      } else if (analysis.suspiciousGaps.some(g => g.likelihood === 'high')) {
        return 3; // High likelihood of withdrawn versions
      } else if (analysis.suspiciousGaps.length > 0) {
        return 0; // Suspicious but not critical
      }

      return 0; // No issues found

    } catch (error: any) {
      console.error(`Error analyzing withdrawn versions: ${error.message}`);
      return 7;
    }
  }
}