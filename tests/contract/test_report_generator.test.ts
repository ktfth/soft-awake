import { ReportGenerator } from '../../src/services/ReportGenerator';
import { AnalysisReport } from '../../src/models/AnalysisReport';

describe('ReportGenerator Contract', () => {
  let reportGenerator: ReportGenerator;

  beforeEach(() => {
    reportGenerator = new ReportGenerator();
  });

  describe('generateReport Method', () => {
    it('should accept array of AnalysisReport and format as input', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'express',
        packageVersion: '4.18.2',
        analysisId: 'uuid-123',
        timestamp: new Date(),
        overallRiskScore: 25,
        riskLevel: 'LOW',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'test-analyzer',
          staticAnalysisTools: ['js-x-ray'],
          analysisDepth: 3,
          timeoutReached: false,
        },
        executionTime: 2500,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      const format = 'json';
      
      expect(() => reportGenerator.generateReport(mockReports, format)).not.toThrow();
    });

    it('should return string output', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'lodash',
        packageVersion: '4.17.21',
        analysisId: 'uuid-456',
        timestamp: new Date(),
        overallRiskScore: 15,
        riskLevel: 'LOW',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'test-analyzer',
          staticAnalysisTools: ['js-x-ray', 'NodeSecure'],
          analysisDepth: 2,
          timeoutReached: false,
        },
        executionTime: 1800,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      const result = await reportGenerator.generateReport(mockReports, 'text');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('JSON Format Output', () => {
    it('should generate valid JSON for json format', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'express',
        packageVersion: '4.18.2',
        analysisId: 'uuid-json',
        timestamp: new Date(),
        overallRiskScore: 30,
        riskLevel: 'LOW',
        securityAlerts: [{
          alertId: 'alert-001',
          packageName: 'express',
          packageVersion: '4.18.2',
          severity: 'MEDIUM',
          category: 'VULNERABILITY',
          title: 'Test vulnerability',
          description: 'Test description',
          detectionMethod: 'STATIC_ANALYSIS',
          confidence: 85,
        }],
        analysisMetadata: {
          analyzerId: 'npm-sec-analyzer-v1.0.0',
          staticAnalysisTools: ['js-x-ray'],
          analysisDepth: 3,
          timeoutReached: false,
        },
        recommendations: [{
          originalPackage: 'express',
          recommendedPackage: 'fastify',
          recommendedVersion: '^4.24.3',
          justification: 'Better security and performance',
          securityScore: 95,
          popularityScore: 78,
          maintenanceScore: 92,
          lastUpdated: new Date(),
          migrationEffort: 'MEDIUM',
        }],
        executionTime: 2500,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      const result = await reportGenerator.generateReport(mockReports, 'json');
      
      expect(() => JSON.parse(result)).not.toThrow();
      
      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('summary');
      expect(parsed).toHaveProperty('packages');
      expect(parsed.summary).toHaveProperty('totalPackages');
      expect(parsed.summary).toHaveProperty('securityIssues');
      expect(parsed.summary).toHaveProperty('overallRisk');
      expect(parsed.summary).toHaveProperty('analysisTime');
    });

    it('should include all report data in JSON output', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'vulnerable-pkg',
        packageVersion: '1.0.0',
        analysisId: 'uuid-vuln',
        timestamp: new Date(),
        overallRiskScore: 85,
        riskLevel: 'HIGH',
        securityAlerts: [
          {
            alertId: 'alert-high',
            packageName: 'vulnerable-pkg',
            packageVersion: '1.0.0',
            severity: 'HIGH',
            category: 'MALWARE',
            title: 'Malicious code detected',
            description: 'Package contains suspicious code patterns',
            detectionMethod: 'LLM_ANALYSIS',
            confidence: 92,
            cveId: 'CVE-2024-12345',
            referenceUrls: ['https://example.com/vuln'],
            remediation: 'Remove package immediately',
          }
        ],
        analysisMetadata: {
          analyzerId: 'npm-sec-analyzer-v1.0.0',
          llmModel: 'gpt-4-turbo',
          staticAnalysisTools: ['js-x-ray', 'NodeSecure'],
          analysisDepth: 5,
          timeoutReached: false,
        },
        executionTime: 4500,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      const result = await reportGenerator.generateReport(mockReports, 'json');
      const parsed = JSON.parse(result);
      
      expect(parsed.packages[0]).toHaveProperty('packageName', 'vulnerable-pkg');
      expect(parsed.packages[0]).toHaveProperty('overallRiskScore', 85);
      expect(parsed.packages[0].securityAlerts).toHaveLength(1);
      expect(parsed.packages[0].securityAlerts[0]).toHaveProperty('cveId', 'CVE-2024-12345');
    });
  });

  describe('Text Format Output', () => {
    it('should generate human-readable text for text format', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'test-package',
        packageVersion: '2.1.0',
        analysisId: 'uuid-text',
        timestamp: new Date(),
        overallRiskScore: 45,
        riskLevel: 'MEDIUM',
        securityAlerts: [{
          alertId: 'alert-text',
          packageName: 'test-package',
          packageVersion: '2.1.0',
          severity: 'MEDIUM',
          category: 'OUTDATED',
          title: 'Outdated dependency',
          description: 'Package has not been updated recently',
          detectionMethod: 'STATIC_ANALYSIS',
          confidence: 78,
        }],
        analysisMetadata: {
          analyzerId: 'npm-sec-analyzer-v1.0.0',
          staticAnalysisTools: ['js-x-ray'],
          analysisDepth: 2,
          timeoutReached: false,
        },
        executionTime: 1200,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      const result = await reportGenerator.generateReport(mockReports, 'text');
      
      expect(result).toContain('SECURITY REPORT');
      expect(result).toContain('test-package@2.1.0');
      expect(result).toContain('Risk Level: MEDIUM');
      expect(result).toContain('Outdated dependency');
      expect(result).toContain('Analysis time:');
    });

    it('should include colored output indicators for text format', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'critical-pkg',
        packageVersion: '1.0.0',
        analysisId: 'uuid-critical',
        timestamp: new Date(),
        overallRiskScore: 95,
        riskLevel: 'CRITICAL',
        securityAlerts: [{
          alertId: 'alert-critical',
          packageName: 'critical-pkg',
          packageVersion: '1.0.0',
          severity: 'CRITICAL',
          category: 'MALWARE',
          title: 'Malware detected',
          description: 'Critical security threat identified',
          detectionMethod: 'SIGNATURE_MATCH',
          confidence: 98,
        }],
        analysisMetadata: {
          analyzerId: 'npm-sec-analyzer-v1.0.0',
          staticAnalysisTools: ['js-x-ray', 'NodeSecure'],
          analysisDepth: 3,
          timeoutReached: false,
        },
        executionTime: 3200,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      const result = await reportGenerator.generateReport(mockReports, 'text');
      
      // Should contain severity indicators (emojis or color codes)
      expect(result).toMatch(/🚨|⚠️|🔴|CRITICAL/);
      expect(result).toContain('Malware detected');
    });

    it('should format recommendations as bullets in text format', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'old-package',
        packageVersion: '1.0.0',
        analysisId: 'uuid-recommendations',
        timestamp: new Date(),
        overallRiskScore: 60,
        riskLevel: 'MEDIUM',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'npm-sec-analyzer-v1.0.0',
          staticAnalysisTools: ['js-x-ray'],
          analysisDepth: 2,
          timeoutReached: false,
        },
        recommendations: [
          {
            originalPackage: 'old-package',
            recommendedPackage: 'new-package',
            recommendedVersion: '^2.0.0',
            justification: 'Actively maintained with security updates',
            securityScore: 90,
            popularityScore: 85,
            maintenanceScore: 95,
            lastUpdated: new Date(),
            migrationEffort: 'LOW',
          }
        ],
        executionTime: 1800,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      const result = await reportGenerator.generateReport(mockReports, 'text');
      
      expect(result).toContain('RECOMMENDATIONS');
      expect(result).toMatch(/[•-]\s*.*new-package/);
      expect(result).toContain('security updates');
    });
  });

  describe('HTML Format Output', () => {
    it('should generate valid HTML for html format', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'html-test',
        packageVersion: '1.5.0',
        analysisId: 'uuid-html',
        timestamp: new Date(),
        overallRiskScore: 35,
        riskLevel: 'MEDIUM',
        securityAlerts: [{
          alertId: 'alert-html',
          packageName: 'html-test',
          packageVersion: '1.5.0',
          severity: 'MEDIUM',
          category: 'VULNERABILITY',
          title: 'XSS vulnerability',
          description: 'Potential cross-site scripting issue',
          detectionMethod: 'LLM_ANALYSIS',
          confidence: 82,
          referenceUrls: ['https://nvd.nist.gov/vuln/detail/CVE-2024-56789'],
        }],
        analysisMetadata: {
          analyzerId: 'npm-sec-analyzer-v1.0.0',
          llmModel: 'gpt-4-turbo',
          staticAnalysisTools: ['js-x-ray'],
          analysisDepth: 4,
          timeoutReached: false,
        },
        executionTime: 2800,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      const result = await reportGenerator.generateReport(mockReports, 'html');
      
      expect(result).toMatch(/<!DOCTYPE html>/i);
      expect(result).toContain('<html');
      expect(result).toContain('<head>');
      expect(result).toContain('<body>');
      expect(result).toContain('html-test@1.5.0');
      expect(result).toContain('XSS vulnerability');
    });

    it('should include executive summary section in HTML', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'summary-test',
        packageVersion: '1.0.0',
        analysisId: 'uuid-summary',
        timestamp: new Date(),
        overallRiskScore: 20,
        riskLevel: 'LOW',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'npm-sec-analyzer-v1.0.0',
          staticAnalysisTools: ['js-x-ray'],
          analysisDepth: 1,
          timeoutReached: false,
        },
        executionTime: 900,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      const result = await reportGenerator.generateReport(mockReports, 'html');
      
      expect(result).toMatch(/executive.{0,20}summary/i);
      expect(result).toContain('Total Packages: 1');
      expect(result).toMatch(/Risk Level.*LOW/);
    });

    it('should include interactive dependency tree visualization placeholder', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'tree-test',
        packageVersion: '1.0.0',
        analysisId: 'uuid-tree',
        timestamp: new Date(),
        overallRiskScore: 40,
        riskLevel: 'MEDIUM',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'npm-sec-analyzer-v1.0.0',
          staticAnalysisTools: ['js-x-ray'],
          analysisDepth: 3,
          timeoutReached: false,
        },
        executionTime: 2100,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      const result = await reportGenerator.generateReport(mockReports, 'html');
      
      expect(result).toMatch(/dependency.{0,20}tree/i);
      expect(result).toContain('tree-test@1.0.0');
    });
  });

  describe('Error Handling', () => {
    it('should throw UnsupportedFormat for invalid format', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'test',
        packageVersion: '1.0.0',
        analysisId: 'uuid-error',
        timestamp: new Date(),
        overallRiskScore: 0,
        riskLevel: 'LOW',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'test-analyzer',
          staticAnalysisTools: [],
          analysisDepth: 1,
          timeoutReached: false,
        },
        executionTime: 100,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      await expect(reportGenerator.generateReport(mockReports, 'invalid-format'))
        .rejects.toThrow('UnsupportedFormat');
    });

    it('should throw TemplateError for template issues', async () => {
      const mockReports: AnalysisReport[] = [{
        packageName: 'template-error-test',
        packageVersion: '1.0.0',
        analysisId: 'uuid-template-error',
        timestamp: new Date(),
        overallRiskScore: 0,
        riskLevel: 'LOW',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'broken-analyzer',
          staticAnalysisTools: [],
          analysisDepth: 1,
          timeoutReached: false,
        },
        executionTime: 100,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }];
      
      // Simulate template error by corrupting generator state
      reportGenerator.corruptTemplates();
      
      await expect(reportGenerator.generateReport(mockReports, 'html'))
        .rejects.toThrow('TemplateError');
    });

    it('should handle empty reports array gracefully', async () => {
      const result = await reportGenerator.generateReport([], 'json');
      
      expect(typeof result).toBe('string');
      const parsed = JSON.parse(result);
      expect(parsed.summary.totalPackages).toBe(0);
      expect(parsed.summary.securityIssues).toBe(0);
      expect(parsed.packages).toHaveLength(0);
    });
  });

  describe('Format Support', () => {
    it('should support json format', async () => {
      expect(reportGenerator.supportsFormat('json')).toBe(true);
    });

    it('should support text format', async () => {
      expect(reportGenerator.supportsFormat('text')).toBe(true);
    });

    it('should support html format', async () => {
      expect(reportGenerator.supportsFormat('html')).toBe(true);
    });

    it('should not support unsupported formats', async () => {
      expect(reportGenerator.supportsFormat('pdf')).toBe(false);
      expect(reportGenerator.supportsFormat('xml')).toBe(false);
      expect(reportGenerator.supportsFormat('csv')).toBe(false);
    });
  });
});