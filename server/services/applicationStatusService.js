// Defines which status transitions are allowed. Key = current status, value = array of statuses it can move to.
const ALLOWED_TRANSITIONS = {
  applied: ['shortlisted', 'rejected'],
  shortlisted: ['interview', 'rejected'],
  interview: ['selected', 'rejected'],
  selected: [], // final state — no further transitions allowed
  rejected: [], // final state — no further transitions allowed
};

// Checks if moving from currentStatus to newStatus is a valid transition
const isValidTransition = (currentStatus, newStatus) => {
  const allowedNextStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowedNextStatuses.includes(newStatus);
};

// Builds a new statusHistory entry for a transition
const buildStatusHistoryEntry = (newStatus, changedBy, note) => {
  return {
    status: newStatus,
    changedAt: new Date(),
    changedBy,
    note: note || '',
  };
};

module.exports = { ALLOWED_TRANSITIONS, isValidTransition, buildStatusHistoryEntry };