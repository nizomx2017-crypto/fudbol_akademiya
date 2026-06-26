import CrudPage from "../components/CrudPage.jsx";
import { teachersApi } from "../services/api.js";

export default function Teachers() {
  return (
    <CrudPage
      title="Teachers"
      subtitle="Your team of instructors and mentors."
      api={teachersApi}
      searchKeys={["fullname", "subject", "phone"]}
      addLabel="Add teacher"
      columns={[
        {
          key: "fullname",
          label: "Teacher",
          render: (r) => (
            <div className="avatar-cell">
              <div className="avatar-sm">
                {r.fullname?.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="cell-strong">{r.fullname}</div>
                <div className="cell-dim" style={{ fontSize: 12 }}>{r.phone}</div>
              </div>
            </div>
          )
        },
        { key: "subject", label: "Subject", render: (r) => <span className="badge info">{r.subject}</span> },
        { key: "salary", label: "Salary" },
      ]}
      fields={[
        { key: "fullname", label: "Full name" },
        { key: "subject", label: "Subject" },
        { key: "phone", label: "Phone" },
        { key: "salary", label: "Salary", type: "number" },
      ]}
    />
  );
}