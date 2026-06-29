import CrudPage from "../components/crudpage.jsx";
import { roomsApi } from "../services/api.js";

export default function Rooms() {
  return (
    <CrudPage
      resource="rooms"
      title="Rooms"
      subtitle="Classrooms, capacities and equipment."
      api={roomsApi}
      searchKeys={["name", "equipment", "status"]}
      addLabel="Add room"
      columns={[
        { key: "name", label: "Room", render: (r) => <span className="cell-strong">{r.name}</span> },
        { key: "floor", label: "Floor" },
        { key: "capacity", label: "Capacity", render: (r) => `${r.capacity} seats` },
        { key: "equipment", label: "Equipment", render: (r) => <span className="cell-dim">{r.equipment}</span> },
        { key: "status", label: "Status", render: (r) => <span className={`badge ${r.status === "Available" ? "success" : "warn"}`}>{r.status}</span> },
      ]}
      fields={[
        { key: "name", label: "Room name" },
        { key: "floor", label: "Floor", type: "number" },
        { key: "capacity", label: "Capacity", type: "number" },
        { key: "equipment", label: "Equipment", full: true },
        { key: "status", label: "Status", type: "select", options: ["Available", "Maintenance"] },
      ]}
    />
  );
}
