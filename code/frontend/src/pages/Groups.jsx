import CrudPage from "../components/CrudPage.jsx";
import { groupsApi } from "../services/api.js";

export default function Groups() {
  return (
    <CrudPage
      title="Groups"
      subtitle="Active study groups and schedules."
      api={groupsApi}
      searchKeys={["name", "course", "teacher"]}
      addLabel="Add group"
      columns={[
        { key: "name", label: "Group", render: (r) => <span className="badge info">{r.name}</span> },
        { key: "course", label: "Course", render: (r) => <span className="cell-strong">{r.course}</span> },
        { key: "teacher", label: "Teacher", render: (r) => <span className="cell-dim">{r.teacher}</span> },
        { key: "students", label: "Students" },
        { key: "schedule", label: "Schedule", render: (r) => <span className="cell-dim">{r.schedule}</span> },
        { key: "room", label: "Room" },
      ]}
      fields={[
        { key: "name", label: "Group name" },
        { key: "course", label: "Course" },
        { key: "teacher", label: "Teacher" },
        { key: "students", label: "Students", type: "number" },
        { key: "schedule", label: "Schedule" },
        { key: "room", label: "Room" },
      ]}
    />
  );
}