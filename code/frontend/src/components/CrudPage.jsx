import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Inbox } from "lucide-react";
import Pagination from "./Pagination.jsx";
import Modal from "./Modal.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function CrudPage({
  resource,
  title,
  subtitle,
  initialData = [],
  api,
  columns,
  fields,
  searchKeys = ["name"],
  addLabel = "Add new",
}) {
  const { can } = useAuth();
  const [rows, setRows] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [toDelete, setToDelete] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!api) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        const result = await api.list();
        setRows(result.data || result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [api]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;

    const q = query.toLowerCase();

    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const canCreate = can(resource, "create");
  const canUpdate = can(resource, "update");
  const canDelete = can(resource, "delete");

  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 8000);
  }

  function openAdd() {
    const empty = {};

    fields.forEach((f) => {
      empty[f.key] = f.type === "number" ? 0 : "";
    });

    setForm(empty);
    setEditing("new");
  }

  function openEdit(row) {
    setForm({ ...row });
    setEditing(row);
  }

  async function submit() {
    try {
      if (editing === "new") {
        const created = await api.create(form);
        setRows([created, ...rows]);
        showMessage("Created successfully");
      } else {
        await api.update(editing.id, form);
        setRows(rows.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
        showMessage("Updated successfully");
      }

      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function confirmDelete() {
    try {
      await api.remove(toDelete.id);
      setRows(rows.filter((r) => r.id !== toDelete.id));
      setToDelete(null);
      showMessage("Deleted successfully");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-box">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {message && <div className="toast">{message}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-sub">{subtitle}</p>}
        </div>

        {canCreate ? (
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus /> {addLabel}
          </button>
        ) : null}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search">
            <Search />
            <input
              placeholder={`Search ${title.toLowerCase()}...`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <span className="badge neutral">{filtered.length} total</span>
        </div>

        {paginated.length === 0 ? (
          <div className="empty">
            <Inbox />
            <div>No results found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                  {(canUpdate || canDelete) ? <th style={{ textAlign: "right" }}>Actions</th> : null}
                </tr>
              </thead>

              <tbody>
                {paginated.map((row) => (
                  <tr key={row.id}>
                    {columns.map((c) => (
                      <td key={c.key}>
                        {c.render ? c.render(row) : row[c.key]}
                      </td>
                    ))}

                    {(canUpdate || canDelete) ? (
                      <td>
                        <div className="cell-actions">
                          {canUpdate ? (
                            <button
                              className="btn-icon"
                              onClick={() => openEdit(row)}
                              aria-label="Edit"
                            >
                              <Pencil />
                            </button>
                          ) : null}

                          {canDelete ? (
                            <button
                              className="btn-icon danger"
                              onClick={() => setToDelete(row)}
                              aria-label="Delete"
                            >
                              <Trash2 />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onChange={setPage}
        />
      </div>

      <Modal
        open={editing !== null}
        title={
          editing === "new"
            ? `Add ${title.slice(0, -1)}`
            : `Edit ${title.slice(0, -1)}`
        }
        onClose={() => setEditing(null)}
        onSubmit={submit}
        submitLabel={editing === "new" ? "Create" : "Save changes"}
      >
        <div className="grid-2">
          {fields.map((f) => (
            <div
              key={f.key}
              className="field"
              style={f.full ? { gridColumn: "1 / -1" } : {}}
            >
              <label>{f.label}</label>

              {f.type === "select" ? (
                <select
                  value={form[f.key] ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  placeholder={f.placeholder || ""}
                  value={form[f.key] ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [f.key]:
                        f.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              )}
            </div>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title={`Delete ${title.slice(0, -1).toLowerCase()}?`}
        message={
          toDelete
            ? `"${toDelete.name || toDelete.fullname || toDelete.student || `#${toDelete.id}`}" will be permanently removed.`
            : ""
        }
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
