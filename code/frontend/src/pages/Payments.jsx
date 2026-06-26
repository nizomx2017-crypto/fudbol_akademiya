import CrudPage from "../components/CrudPage.jsx";
import { paymentsApi } from "../services/api.js";

export default function Payments() {
  return (
    <CrudPage
      title="Payments"
      subtitle="Tuition payments and transaction history."
      api={paymentsApi}
      searchKeys={["student", "method", "status"]}
      addLabel="Record payment"
      columns={[
        { key: "student", label: "Student", render: (r) => <span className="cell-strong">{r.student}</span> },
        { key: "amount", label: "Amount", render: (r) => `${Number(r.amount || 0).toLocaleString()} UZS` },
        { key: "method", label: "Method", render: (r) => <span className="badge info">{r.method}</span> },
        { key: "date", label: "Date", render: (r) => <span className="cell-dim">{r.date}</span> },
        { key: "status", label: "Status", render: (r) => <span className={`badge ${r.status === "Paid" ? "success" : "warn"}`}>{r.status}</span> },
      ]}
      fields={[
        { key: "student", label: "Student name" },
        { key: "amount", label: "Amount (UZS)", type: "number" },
        { key: "method", label: "Method", type: "select", options: ["Cash", "Click", "Payme", "Card"] },
        { key: "date", label: "Date" },
        { key: "status", label: "Status", type: "select", options: ["Paid", "Pending"] },
      ]}
    />
  );
}