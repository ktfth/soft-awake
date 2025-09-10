import { NPMClient } from '../../src/services/NPMClient';
import { Package } from '../../src/models/Package';
import { DependencyTree } from '../../src/models/DependencyTree';

describe('NPMClient Contract', () => {
  let client: NPMClient;

  beforeEach(() => {
    client = new NPMClient();
  });

  describe('getPackageInfo Method', () => {
    it('should accept name and version as input', async () => {
      const name = 'express';
      const version = '4.18.2';
      
      expect(() => client.getPackageInfo(name, version)).not.toThrow();
    });

    it('should return Package object', async () => {
      const result = await client.getPackageInfo('express', '4.18.2');
      expect(result).toBeInstanceOf(Package);
      expect(result.name).toBe('express');
      expect(result.version).toBe('4.18.2');
    });

    it('should include package metadata', async () => {
      const result = await client.getPackageInfo('lodash', '4.17.21');
      expect(result.description).toBeDefined();
      expect(result.publishedDate).toBeInstanceOf(Date);
      expect(result.license).toBeDefined();
    });

    it('should include maintainers information', async () => {
      const result = await client.getPackageInfo('express', '4.18.2');
      expect(result.maintainers).toBeInstanceOf(Array);
      if (result.maintainers && result.maintainers.length > 0) {
        expect(result.maintainers[0]).toHaveProperty('name');
      }
    });

    it('should include download statistics', async () => {
      const result = await client.getPackageInfo('express', 'latest');
      expect(typeof result.downloadCount).toBe('number');
      expect(result.downloadCount).toBeGreaterThan(0);
    });

    it('should include repository URL when available', async () => {
      const result = await client.getPackageInfo('express', 'latest');
      if (result.repositoryUrl) {
        expect(result.repositoryUrl).toMatch(/^https?:\/\//);
      }
    });

    it('should parse dependencies correctly', async () => {
      const result = await client.getPackageInfo('express', '4.18.2');
      expect(result.dependencies).toBeInstanceOf(Array);
      if (result.dependencies && result.dependencies.length > 0) {
        expect(result.dependencies[0]).toHaveProperty('name');
        expect(result.dependencies[0]).toHaveProperty('version');
        expect(result.dependencies[0]).toHaveProperty('optional');
      }
    });
  });

  describe('getDependencyTree Method', () => {
    it('should accept Package and maxDepth as input', async () => {
      const mockPackage: Package = {
        name: 'express',
        version: '4.18.2',
        publishedDate: new Date(),
      };
      const maxDepth = 5;
      
      expect(() => client.getDependencyTree(mockPackage, maxDepth)).not.toThrow();
    });

    it('should return DependencyTree object', async () => {
      const mockPackage: Package = {
        name: 'express',
        version: '4.18.2',
        publishedDate: new Date(),
      };
      
      const result = await client.getDependencyTree(mockPackage, 3);
      expect(result).toBeInstanceOf(DependencyTree);
      expect(result.rootPackage).toBe(mockPackage);
      expect(result.nodes).toBeInstanceOf(Array);
    });

    it('should respect maxDepth parameter', async () => {
      const mockPackage: Package = {
        name: 'express',
        version: '4.18.2',
        publishedDate: new Date(),
      };
      const maxDepth = 2;
      
      const result = await client.getDependencyTree(mockPackage, maxDepth);
      expect(result.maxDepth).toBeLessThanOrEqual(maxDepth);
      
      const maxNodeDepth = Math.max(...result.nodes.map(node => node.depth));
      expect(maxNodeDepth).toBeLessThanOrEqual(maxDepth);
    });

    it('should mark direct vs transitive dependencies', async () => {
      const mockPackage: Package = {
        name: 'express',
        version: '4.18.2',
        publishedDate: new Date(),
      };
      
      const result = await client.getDependencyTree(mockPackage, 3);
      
      const directDeps = result.nodes.filter(node => node.isDirect);
      const transitiveDeps = result.nodes.filter(node => !node.isDirect);
      
      expect(directDeps.length).toBeGreaterThan(0);
      expect(transitiveDeps.length).toBeGreaterThanOrEqual(0);
    });

    it('should set correct node depths', async () => {
      const mockPackage: Package = {
        name: 'express',
        version: '4.18.2',
        publishedDate: new Date(),
      };
      
      const result = await client.getDependencyTree(mockPackage, 3);
      
      // Root package should be at depth 0
      const rootNodes = result.nodes.filter(node => node.depth === 0);
      expect(rootNodes.length).toBe(1);
      
      // All nodes should have valid depth
      result.nodes.forEach(node => {
        expect(node.depth).toBeGreaterThanOrEqual(0);
        expect(node.depth).toBeLessThanOrEqual(result.maxDepth);
      });
    });

    it('should track total node count', async () => {
      const mockPackage: Package = {
        name: 'lodash',
        version: '4.17.21',
        publishedDate: new Date(),
      };
      
      const result = await client.getDependencyTree(mockPackage, 2);
      expect(result.totalNodes).toBe(result.nodes.length);
      expect(result.totalNodes).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should throw PackageNotFound for non-existent packages', async () => {
      await expect(client.getPackageInfo('non-existent-package-xyz', '1.0.0'))
        .rejects.toThrow('PackageNotFound');
    });

    it('should throw NetworkError on connection issues', async () => {
      // Simulate network error by using invalid registry URL
      const offlineClient = new NPMClient({ registryUrl: 'http://invalid-registry.local' });
      
      await expect(offlineClient.getPackageInfo('express', '4.18.2'))
        .rejects.toThrow('NetworkError');
    });

    it('should throw TooManyDependencies for packages with excessive deps', async () => {
      const packageWithManyDeps: Package = {
        name: 'package-with-1000-deps',
        version: '1.0.0',
        publishedDate: new Date(),
      };
      
      await expect(client.getDependencyTree(packageWithManyDeps, 10))
        .rejects.toThrow('TooManyDependencies');
    });

    it('should throw CircularDependency when detected', async () => {
      const circularPackage: Package = {
        name: 'circular-dep-package',
        version: '1.0.0',
        publishedDate: new Date(),
      };
      
      await expect(client.getDependencyTree(circularPackage, 15))
        .rejects.toThrow('CircularDependency');
    });
  });

  describe('Caching and Performance', () => {
    it('should cache package info requests', async () => {
      const startTime1 = Date.now();
      await client.getPackageInfo('express', '4.18.2');
      const duration1 = Date.now() - startTime1;
      
      const startTime2 = Date.now();
      await client.getPackageInfo('express', '4.18.2');
      const duration2 = Date.now() - startTime2;
      
      expect(duration2).toBeLessThan(duration1 / 2); // Cached should be much faster
    });

    it('should respect rate limiting', async () => {
      const requests = Array(10).fill(null).map((_, i) => 
        client.getPackageInfo(`test-package-${i}`, '1.0.0')
      );
      
      // Should not throw rate limit error for reasonable number of requests
      expect(() => Promise.allSettled(requests)).not.toThrow();
    });
  });
});