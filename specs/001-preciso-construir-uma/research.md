# Research Report: NPM Package Malware Analysis System

**Feature**: NPM Package Malware Analysis System  
**Date**: 2025-09-09  
**Status**: Complete

## Technical Decisions

### Performance Requirements
**Decision**: Target <2 seconds for single package analysis, <10 seconds for dependency trees up to 100 packages, process 50 packages/minute with concurrent execution  
**Rationale**: Based on user experience expectations for CLI tools and CI/CD integration requirements where fast feedback is critical  
**Alternatives Considered**: Higher performance targets (sub-second) rejected due to LLM API latency constraints; lower targets rejected due to poor user experience

### Usage Scale & Concurrency
**Decision**: Support 10-20 simultaneous analyses, handle 1,000-5,000 packages per day for enterprise usage  
**Rationale**: Aligns with typical CI/CD pipeline loads and enterprise security scanning requirements  
**Alternatives Considered**: Lower concurrency (5-10) rejected for enterprise scalability; higher concurrency (50+) rejected due to API rate limiting

### CLI Framework Architecture
**Decision**: Use Commander.js for argument parsing, ES Modules with TypeScript native compilation, plugin-based extensible architecture  
**Rationale**: Commander.js is the industry standard, ESM is the modern Node.js approach, plugin architecture supports future extensibility  
**Alternatives Considered**: Yargs rejected due to larger bundle size; CommonJS rejected as legacy approach; monolithic architecture rejected for extensibility

### LLM Integration Strategy  
**Decision**: OpenRouter API with client-side rate limiting (60 requests/minute), request batching, exponential backoff retry logic  
**Rationale**: OpenRouter provides access to multiple models with cost optimization, rate limiting prevents API abuse  
**Alternatives Considered**: Direct OpenAI API rejected for cost; local LLM rejected for resource requirements; no rate limiting rejected for API stability

### NPM Registry Integration
**Decision**: Implement aggressive caching (24-hour TTL), request queuing/throttling, multiple data sources (npm + GitHub API + security databases)  
**Rationale**: NPM registry has undocumented rate limits, caching reduces API calls, multiple sources improve analysis quality  
**Alternatives Considered**: No caching rejected for performance; single data source rejected for incomplete analysis; shorter TTL rejected for API efficiency

### Dependency Tree Analysis
**Decision**: Breadth-first traversal with 15-level depth limit, parallel processing of independent branches, early termination on critical vulnerabilities  
**Rationale**: BFS provides comprehensive coverage, depth limits prevent infinite recursion, parallelization improves performance  
**Alternatives Considered**: Depth-first rejected for memory usage; unlimited depth rejected for performance; sequential processing rejected for speed

### Security Scanning Approach
**Decision**: Combined approach using js-x-ray + NodeSecure + Semgrep + custom LLM analysis with confidence scoring  
**Rationale**: Multiple scanning engines provide comprehensive coverage, confidence scoring helps prioritize findings  
**Alternatives Considered**: Single-tool approach rejected for coverage gaps; signature-only detection rejected for zero-day threats; LLM-only rejected for accuracy

### Caching Strategy
**Decision**: Two-tier caching (Memory L1 + SQLite L2) with LRU eviction, 1 hour memory TTL, 24 hour metadata TTL, 7 day analysis results TTL  
**Rationale**: Balances performance with data freshness, SQLite provides persistent storage without external dependencies  
**Alternatives Considered**: No caching rejected for performance; Redis rejected for deployment complexity; longer TTLs rejected for data staleness

### Testing Framework
**Decision**: Jest for unit/integration tests with 80%+ coverage, Nock for API mocking, cli-testing-library for E2E tests  
**Rationale**: Jest is TypeScript-native, Nock provides reliable HTTP mocking, cli-testing-library enables real CLI testing  
**Alternatives Considered**: Mocha rejected for TypeScript integration complexity; manual mocking rejected for maintenance overhead; no E2E testing rejected for quality assurance

### Project Structure Pattern
**Decision**: Modular architecture with commands/, services/, plugins/, utils/, types/ directories following Domain-Driven Design principles  
**Rationale**: Clear separation of concerns, supports plugin architecture, aligns with Node.js CLI best practices  
**Alternatives Considered**: Flat structure rejected for maintainability; feature-based structure rejected for CLI tools; framework-specific structure rejected for flexibility

## Resolved Clarifications

### Output Format (FR-009)
**Decision**: Support JSON, human-readable text, and HTML report formats with --format flag  
**Rationale**: JSON for CI/CD integration, text for human reading, HTML for detailed reports  

### Data Retention (FR-010)
**Decision**: Cache analysis results for 7 days, configurable via CLI option --cache-ttl  
**Rationale**: Balances performance with data freshness, user control over caching behavior

### Performance Requirements (FR-011)
**Decision**: <2 seconds single package, <10 seconds dependency tree (up to 100 packages)  
**Rationale**: Based on user experience research for CLI tools and CI/CD integration needs

### Package Registry Support (FR-012)  
**Decision**: Start with NPM, design for extensibility to support PyPI, RubyGems via plugin system  
**Rationale**: NPM is primary requirement, plugin architecture enables future expansion

## Architecture Summary

The system will be built as a Node.js TypeScript CLI tool with:
- Modular plugin-based architecture for extensibility
- Multi-tier caching for performance optimization  
- Combined static analysis + LLM-powered security scanning
- Comprehensive testing strategy with external API mocking
- Enterprise-ready scalability and error handling

This research resolves all technical unknowns and provides concrete implementation guidance for the development phases.