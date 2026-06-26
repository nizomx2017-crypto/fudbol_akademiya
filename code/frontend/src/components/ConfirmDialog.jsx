import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({ open, title = "Delete item", message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(244,63,94,0.15)", display: "grid", placeItems: "center", color: "#fca5b1" }}>
              <AlertTriangle size={16} />
            </span>
            {title}
          </h3>
          <button className="icon-btn" onClick={onCancel}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <p style={{ color: "var(--text-dim)", lineHeight: 1.6 }}>
            {message || "This action cannot be undone. Are you sure you want to continue?"}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}