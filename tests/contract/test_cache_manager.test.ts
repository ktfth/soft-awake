import { CacheManager } from '../../src/services/CacheManager';
import { AnalysisReport } from '../../src/models/AnalysisReport';

describe('CacheManager Contract', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    cacheManager = new CacheManager();
  });

  describe('get Method', () => {
    it('should accept key as string input', async () => {
      const key = 'express@4.18.2';
      
      expect(() => cacheManager.get(key)).not.toThrow();
    });

    it('should return AnalysisReport or null', async () => {
      const key = 'express@4.18.2';
      const result = await cacheManager.get(key);
      
      expect(result === null || result instanceof AnalysisReport).toBe(true);
    });

    it('should return null for non-existent keys', async () => {
      const key = 'non-existent-package@1.0.0';
      const result = await cacheManager.get(key);
      
      expect(result).toBeNull();
    });
  });

  describe('set Method', () => {
    it('should accept key, value, and ttl as input', async () => {
      const key = 'test@1.0.0';
      const mockReport: AnalysisReport = {
        packageName: 'test',
        packageVersion: '1.0.0',
        analysisId: 'uuid-123',
        timestamp: new Date(),
        overallRiskScore: 50,
        riskLevel: 'MEDIUM',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'test-analyzer',
          staticAnalysisTools: [],
          analysisDepth: 1,
          timeoutReached: false,
        },
        executionTime: 1000,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      const ttl = 3600; // 1 hour in seconds
      
      expect(() => cacheManager.set(key, mockReport, ttl)).not.toThrow();
    });

    it('should return boolean indicating success', async () => {
      const key = 'test@1.0.0';
      const mockReport: AnalysisReport = {
        packageName: 'test',
        packageVersion: '1.0.0',
        analysisId: 'uuid-123',
        timestamp: new Date(),
        overallRiskScore: 30,
        riskLevel: 'LOW',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'test-analyzer',
          staticAnalysisTools: [],
          analysisDepth: 1,
          timeoutReached: false,
        },
        executionTime: 1000,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      const ttl = 3600;
      
      const result = await cacheManager.set(key, mockReport, ttl);
      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });

    it('should store and retrieve values correctly', async () => {
      const key = 'lodash@4.17.21';
      const mockReport: AnalysisReport = {
        packageName: 'lodash',
        packageVersion: '4.17.21',
        analysisId: 'uuid-456',
        timestamp: new Date(),
        overallRiskScore: 20,
        riskLevel: 'LOW',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'test-analyzer',
          staticAnalysisTools: ['js-x-ray'],
          analysisDepth: 2,
          timeoutReached: false,
        },
        executionTime: 1500,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      const ttl = 7200;
      
      await cacheManager.set(key, mockReport, ttl);
      const retrieved = await cacheManager.get(key);
      
      expect(retrieved).toEqual(mockReport);
    });
  });

  describe('clear Method', () => {
    it('should clear all cache entries', async () => {
      // First add some entries
      const mockReport: AnalysisReport = {
        packageName: 'test',
        packageVersion: '1.0.0',
        analysisId: 'uuid-789',
        timestamp: new Date(),
        overallRiskScore: 40,
        riskLevel: 'MEDIUM',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'test-analyzer',
          staticAnalysisTools: [],
          analysisDepth: 1,
          timeoutReached: false,
        },
        executionTime: 1000,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      
      await cacheManager.set('test1@1.0.0', mockReport, 3600);
      await cacheManager.set('test2@1.0.0', mockReport, 3600);
      
      const clearedCount = await cacheManager.clear();
      
      expect(typeof clearedCount).toBe('number');
      expect(clearedCount).toBeGreaterThan(0);
      
      // Verify entries are cleared
      const result1 = await cacheManager.get('test1@1.0.0');
      const result2 = await cacheManager.get('test2@1.0.0');
      
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });

    it('should return number of cleared entries', async () => {
      const result = await cacheManager.clear();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('TTL and Expiration', () => {
    it('should respect TTL settings', async () => {
      const key = 'short-lived@1.0.0';
      const mockReport: AnalysisReport = {
        packageName: 'short-lived',
        packageVersion: '1.0.0',
        analysisId: 'uuid-999',
        timestamp: new Date(),
        overallRiskScore: 10,
        riskLevel: 'LOW',
        securityAlerts: [],
        analysisMetadata: {
          analyzerId: 'test-analyzer',
          staticAnalysisTools: [],
          analysisDepth: 1,
          timeoutReached: false,
        },
        executionTime: 500,
        cacheExpiry: new Date(Date.now() + 1000), // 1 second
      };
      const ttl = 1; // 1 second
      
      await cacheManager.set(key, mockReport, ttl);
      
      // Should be available immediately
      const result1 = await cacheManager.get(key);
      expect(result1).not.toBeNull();
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      // Should be expired now
      const result2 = await cacheManager.get(key);
      expect(result2).toBeNull();
    });

    it('should clean expired entries', async () => {
      const key = 'expired@1.0.0';
      const mockReport: AnalysisReport = {
        packageName: 'expired',
        packageVersion: '1.0.0',
        analysisId: 'uuid-expired',
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
        cacheExpiry: new Date(Date.now() - 1000), // Already expired
      };
      const ttl = 1;
      
      await cacheManager.set(key, mockReport, ttl);
      
      const cleanedCount = await cacheManager.cleanExpired();
      expect(typeof cleanedCount).toBe('number');
      expect(cleanedCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Performance and Storage', () => {
    it('should provide cache statistics', async () => {
      const stats = await cacheManager.getStats();
      
      expect(stats).toHaveProperty('totalEntries');
      expect(stats).toHaveProperty('sizeInMB');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('oldestEntry');
      
      expect(typeof stats.totalEntries).toBe('number');
      expect(typeof stats.sizeInMB).toBe('number');
      expect(typeof stats.hitRate).toBe('number');
    });

    it('should enforce size limits', async () => {
      // Try to add entries exceeding the limit
      const largeMockReport: AnalysisReport = {
        packageName: 'large-package',
        packageVersion: '1.0.0',
        analysisId: 'uuid-large',
        timestamp: new Date(),
        overallRiskScore: 50,
        riskLevel: 'MEDIUM',
        securityAlerts: new Array(1000).fill({
          alertId: 'large-alert',
          packageName: 'large-package',
          packageVersion: '1.0.0',
          severity: 'MEDIUM',
          category: 'VULNERABILITY',
          title: 'Large vulnerability',
          description: 'A'.repeat(1000), // Large description
          detectionMethod: 'STATIC_ANALYSIS',
          confidence: 80,
        }),
        analysisMetadata: {
          analyzerId: 'test-analyzer',
          staticAnalysisTools: ['js-x-ray'],
          analysisDepth: 5,
          timeoutReached: false,
        },
        executionTime: 5000,
        cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      
      const result = await cacheManager.set('large@1.0.0', largeMockReport, 3600);
      expect(typeof result).toBe('boolean');
    });

    it('should handle concurrent access', async () => {
      const concurrentOperations = Array(10).fill(null).map(async (_, i) => {
        const key = `concurrent${i}@1.0.0`;
        const mockReport: AnalysisReport = {
          packageName: `concurrent${i}`,
          packageVersion: '1.0.0',
          analysisId: `uuid-${i}`,
          timestamp: new Date(),
          overallRiskScore: i * 10,
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
        };
        
        await cacheManager.set(key, mockReport, 3600);
        return cacheManager.get(key);
      });
      
      const results = await Promise.all(concurrentOperations);
      results.forEach((result, i) => {
        expect(result).not.toBeNull();
        if (result) {
          expect(result.packageName).toBe(`concurrent${i}`);
        }
      });
    });
  });
});