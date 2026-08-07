// Single source of truth for eligibility logic — reused by drive listing, applying, and TPO's eligible-students view
const checkEligibility = (drive, profile) => {
  if (!profile) {
    return { eligible: false, reasons: ['Profile not found'] };
  }

  const reasons = [];
  const e = drive.eligibility;

  if (e.minCgpa && (profile.cgpa === undefined || profile.cgpa < e.minCgpa)) {
    reasons.push(`Requires minimum CGPA of ${e.minCgpa}`);
  }
  if (e.maxBacklogs !== undefined && (profile.backlogs ?? 0) > e.maxBacklogs) {
    reasons.push(`Maximum ${e.maxBacklogs} backlogs allowed`);
  }
  if (e.allowedBranches?.length > 0 && !e.allowedBranches.includes(profile.branch)) {
    reasons.push('Branch not eligible');
  }
  if (
    e.minTenthPercentage &&
    (profile.tenthPercentage === undefined || profile.tenthPercentage < e.minTenthPercentage)
  ) {
    reasons.push(`Requires minimum 10th percentage of ${e.minTenthPercentage}`);
  }
  if (
    e.minTwelfthPercentage &&
    (profile.twelfthPercentage === undefined || profile.twelfthPercentage < e.minTwelfthPercentage)
  ) {
    reasons.push(`Requires minimum 12th percentage of ${e.minTwelfthPercentage}`);
  }
  if (e.graduationYears?.length > 0 && !e.graduationYears.includes(profile.graduationYear)) {
    reasons.push('Graduation year not eligible');
  }

  return { eligible: reasons.length === 0, reasons };
};

module.exports = { checkEligibility };