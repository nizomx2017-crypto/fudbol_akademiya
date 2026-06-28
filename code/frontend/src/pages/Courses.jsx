import CrudPage from "../components/CrudPage.jsx";
import { coursesApi } from "../services/api.js";

export default function Courses() {
  return (
    <CrudPage
      resource="courses"
      title="Courses"
      subtitle="Manage available courses and pricing."
      api={coursesApi}
      searchKeys={["name", "duration"]}
      addLabel="Add course"
      columns={[
        { key: "name", label: "Course name" },
        { key: "price", label: "Price" },
        { key: "duration", label: "Duration" },
      ]}
      fields={[
        { key: "name", label: "Course name" },
        { key: "price", label: "Price", type: "number" },
        { key: "duration", label: "Duration" },
      ]}
    />
  );
}
