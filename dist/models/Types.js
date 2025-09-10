"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisStatus = exports.MigrationEffort = exports.DetectionMethod = exports.AlertCategory = exports.Severity = exports.RiskLevel = void 0;
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["CRITICAL"] = "CRITICAL";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var Severity;
(function (Severity) {
    Severity["LOW"] = "LOW";
    Severity["MEDIUM"] = "MEDIUM";
    Severity["HIGH"] = "HIGH";
    Severity["CRITICAL"] = "CRITICAL";
})(Severity || (exports.Severity = Severity = {}));
var AlertCategory;
(function (AlertCategory) {
    AlertCategory["MALWARE"] = "MALWARE";
    AlertCategory["VULNERABILITY"] = "VULNERABILITY";
    AlertCategory["SUSPICIOUS_CODE"] = "SUSPICIOUS_CODE";
    AlertCategory["OUTDATED"] = "OUTDATED";
    AlertCategory["TYPOSQUATTING"] = "TYPOSQUATTING";
})(AlertCategory || (exports.AlertCategory = AlertCategory = {}));
var DetectionMethod;
(function (DetectionMethod) {
    DetectionMethod["STATIC_ANALYSIS"] = "STATIC_ANALYSIS";
    DetectionMethod["LLM_ANALYSIS"] = "LLM_ANALYSIS";
    DetectionMethod["SIGNATURE_MATCH"] = "SIGNATURE_MATCH";
    DetectionMethod["BEHAVIORAL_ANALYSIS"] = "BEHAVIORAL_ANALYSIS";
})(DetectionMethod || (exports.DetectionMethod = DetectionMethod = {}));
var MigrationEffort;
(function (MigrationEffort) {
    MigrationEffort["LOW"] = "LOW";
    MigrationEffort["MEDIUM"] = "MEDIUM";
    MigrationEffort["HIGH"] = "HIGH";
})(MigrationEffort || (exports.MigrationEffort = MigrationEffort = {}));
var AnalysisStatus;
(function (AnalysisStatus) {
    AnalysisStatus["PENDING"] = "PENDING";
    AnalysisStatus["ANALYZING"] = "ANALYZING";
    AnalysisStatus["COMPLETED"] = "COMPLETED";
    AnalysisStatus["FAILED"] = "FAILED";
    AnalysisStatus["SKIPPED"] = "SKIPPED";
})(AnalysisStatus || (exports.AnalysisStatus = AnalysisStatus = {}));
//# sourceMappingURL=Types.js.map