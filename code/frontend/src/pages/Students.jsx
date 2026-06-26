import CrudPage from "../components/CrudPage.jsx";
import { studentsApi } from "../services/api.js";
export default function Students() {
  return (
    <CrudPage
      title="Students"
      subtitle="Manage every learner enrolled in your center."
      api={studentsApi}
      searchKeys={["name", "phone", "group"]}
      addLabel="Add student"
      columns={[
        {
          key: "name", label: "Student",
          render: (r) => (
            <div className="avatar-cell">
              <div className="avatar-sm">{r.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</div>
              <div>
                <div className="cell-strong">{r.name}</div>
                <div className="cell-dim" style={{ fontSize: 12 }}>{r.phone}</div>
              </div>
            </div>
          )
        },
        { key: "group", label: "Group", render: (r) => <span className="badge info">{r.group}</span> },
        { key: "balance", label: "Balance", render: (r) => `${r.balance.toLocaleString()} UZS` },
        { key: "status", label: "Status", render: (r) => <span className={`badge ${r.status === "Active" ? "success" : "warn"}`}>{r.status}</span> },
        { key: "joined", label: "Joined", render: (r) => <span className="cell-dim">{r.joined}</span> },
      ]}
      fields={[
        { key: "name", label: "Full name", placeholder: "Ali Karimov" },
        { key: "phone", label: "Phone", placeholder: "+998 90 ..." },
        { key: "group", label: "Group", type: "select", options: ["IT-101", "ENG-204", "MATH-301", "UX-110"] },
        { key: "balance", label: "Balance (UZS)", type: "number" },
        { key: "status", label: "Status", type: "select", options: ["Active", "Pending", "Inactive"] },
        { key: "joined", label: "Joined date", placeholder: "2025-11-01" },
      ]}
    />
  );
}