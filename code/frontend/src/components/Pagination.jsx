import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong style={{ color: "var(--text)" }}>{from}–{to}</strong> of {total}
      </div>
      <div className="pagination-controls">
        <button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={14} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === page ? "active" : ""}`}
            onClick={() => onChange(p)}
          >{p}</button>
        ))}
        <button className="page-btn" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}