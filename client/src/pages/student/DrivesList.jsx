import { useEffect, useState } from "react";
import api from "../../lib/api";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

export default function DrivesList() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState(null);
  const [applyMessage, setApplyMessage] = useState({
    driveId: null,
    text: "",
    type: "",
  });

  const fetchDrives = async () => {
    try {
      const res = await api.get("/drives");
      setDrives(res.data.drives);
    } catch (err) {
      setError("Failed to load drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleApply = async (driveId) => {
    setApplyingId(driveId);
    setApplyMessage({ driveId: null, text: "", type: "" });
    try {
      await api.post(`/drives/${driveId}/apply`);
      setApplyMessage({
        driveId,
        text: "Applied successfully",
        type: "success",
      });
      await fetchDrives();
    } catch (err) {
      setApplyMessage({
        driveId,
        text: err.response?.data?.message || "Failed to apply",
        type: "error",
      });
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) return <LoadingState label="Loading drives..." />;
  if (error) return <p className="text-professional text-sm">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-6">Drives</h1>

      {drives.length === 0 ? (
        <EmptyState message="No drives posted yet. Check back soon." />
      ) : (
        <div className="space-y-4">
          {drives.map((drive) => (
            <div
              key={drive._id}
              className="border border-line rounded-lg p-5 flex justify-between items-start gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-display text-xl text-ink">
                    {drive.company}
                  </h2>
                  {drive.eligible ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-signal/10 text-signal font-mono">
                      Eligible
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-professional/10 text-professional font-mono">
                      Not eligible
                    </span>
                  )}
                </div>
                <p className="text-slate text-sm mb-2">
                  {drive.role} {drive.package && `· ${drive.package}`}
                </p>
                {drive.description && (
                  <p className="text-slate text-sm mb-3 max-w-lg">
                    {drive.description}
                  </p>
                )}
                <p className="text-xs text-slate font-mono">
                  Apply by{" "}
                  {new Date(drive.applicationDeadline).toLocaleDateString()}
                </p>
                {!drive.eligible && drive.eligibilityReasons?.length > 0 && (
                  <ul className="mt-2 text-xs text-professional space-y-0.5">
                    {drive.eligibilityReasons.map((reason, i) => (
                      <li key={i}>· {reason}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <button
                  onClick={() => handleApply(drive._id)}
                  disabled={!drive.eligible || applyingId === drive._id}
                  className="px-4 py-2 rounded-md bg-ink text-paper text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {applyingId === drive._id ? "Applying..." : "Apply"}
                </button>
                {applyMessage.driveId === drive._id && (
                  <p
                    className={`text-xs ${applyMessage.type === "success" ? "text-signal" : "text-professional"}`}
                  >
                    {applyMessage.text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
