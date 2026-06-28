import { useEffect, useState } from "react";
import { KeyRound, Pencil, Plus, Save, Trash2, Users } from "lucide-react";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { authUsersApi } from "../services/api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const ACCESS_ROLES = ["MANAGER", "TEACHER", "STUDENT"];
const ROLE_ACCESS_LABELS = {
  MANAGER: "Manager accesslari",
  TEACHER: "Teacher accesslari",
  STUDENT: "Student accesslari",
};
const DEFAULT_ROLE_ACCESSES = {
  MANAGER: [],
  TEACHER: [
    "dashboard:view",
    "courses:view",
    "groups:view",
    "students:view",
    "teachers:view",
  ],
  STUDENT: ["dashboard:view", "courses:view", "groups:view"],
};

export default function Settings() {
  const { hasFullAccess } = useAuth();
  const [prefs, setPrefs] = useState({
    notifications: true,
    sms: false,
    autoBackup: true,
    darkMode: true,
    twoFactor: false,
  });
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@educenter.uz",
    center: "EduCenter Tashkent",
    phone: "+998 90 123-45-67",
  });
  const [authUsers, setAuthUsers] = useState([]);
  const [accessCatalog, setAccessCatalog] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    login: "",
    password: "",
    role: "MANAGER",
    status: "active",
    accesses: [],
  });
  const [userToDelete, setUserToDelete] = useState(null);
  const [message, setMessage] = useState("");

  const toggle = (k) => setPrefs({ ...prefs, [k]: !prefs[k] });

  useEffect(() => {
    if (hasFullAccess) {
      loadAuthUsers();
      loadAccessCatalog();
    } else {
      setAuthLoading(false);
    }
  }, [hasFullAccess]);

  async function loadAuthUsers() {
    try {
      setAuthLoading(true);
      setAuthError("");
      const users = await authUsersApi.list();
      setAuthUsers(users);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function loadAccessCatalog() {
    try {
      const accesses = await authUsersApi.accesses();
      setAccessCatalog(accesses);
    } catch (error) {
      setAuthError(error.message);
    }
  }

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 5000);
  }

  function openAddUser() {
    setUserForm({
      login: "",
      password: "",
      role: "MANAGER",
      status: "active",
      accesses: DEFAULT_ROLE_ACCESSES.MANAGER,
    });
    setEditingUser("new");
  }

  function openEditUser(user) {
    setUserForm({
      login: user.login,
      password: "",
      role: user.role,
      status: user.status,
      accesses: user.accesses || [],
    });
    setEditingUser(user);
  }

  async function submitUser() {
    try {
      const payload = {
        login: userForm.login,
        role: userForm.role,
        status: userForm.status,
        accesses: ACCESS_ROLES.includes(userForm.role) ? userForm.accesses : [],
      };

      if (userForm.password) {
        payload.password = userForm.password;
      }

      if (editingUser === "new") {
        const created = await authUsersApi.create({ ...payload, password: userForm.password });
        setAuthUsers([created, ...authUsers]);
        showMessage("Login qo'shildi");
      } else {
        const updated = await authUsersApi.update(editingUser.id, payload);
        setAuthUsers(authUsers.map((user) => (user.id === updated.id ? updated : user)));
        showMessage("Login yangilandi");
      }

      setEditingUser(null);
    } catch (error) {
      setAuthError(error.message);
    }
  }

  function toggleAccess(accessName) {
    const exists = userForm.accesses.includes(accessName);
    setUserForm({
      ...userForm,
      accesses: exists
        ? userForm.accesses.filter((name) => name !== accessName)
        : [...userForm.accesses, accessName],
    });
  }

  async function confirmDeleteUser() {
    try {
      await authUsersApi.remove(userToDelete.id);
      setAuthUsers(authUsers.filter((user) => user.id !== userToDelete.id));
      setUserToDelete(null);
      showMessage("Login o'chirildi");
    } catch (error) {
      setAuthError(error.message);
    }
  }

  return (
    <div className="page">
      {message && <div className="toast">{message}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Manage your center profile and preferences.</p>
        </div>
        <button className="btn btn-primary"><Save /> Save changes</button>
      </div>

      {hasFullAccess ? (
        <div className="card settings-section" style={{ marginBottom: 18 }}>
          <div className="card-header" style={{ padding: 0, borderBottom: 0, marginBottom: 16 }}>
            <div>
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={18} /> Login va access boshqaruvi
              </div>
              <p className="page-sub">DIRECTOR managerga page va action accesslarini shu yerdan beradi.</p>
            </div>

            <button className="btn btn-primary" onClick={openAddUser}>
              <Plus /> Login qo'shish
            </button>
          </div>

          {authError ? <p className="auth-error" style={{ marginBottom: 12 }}>{authError}</p> : null}

          {authLoading ? (
            <div className="loading-box" style={{ height: 180 }}>
              <div className="loader"></div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Login</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Accesslar</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {authUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="avatar-cell">
                          <span className="avatar-sm"><KeyRound size={14} /></span>
                          <span className="cell-strong">{user.login}</span>
                        </div>
                      </td>
                      <td><span className="badge info">{user.role}</span></td>
                      <td>
                        <span className={`badge ${user.status === "active" ? "success" : "neutral"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="cell-dim">
                        {ACCESS_ROLES.includes(user.role) ? `${user.accesses?.length || 0} ta` : "Full access"}
                      </td>
                      <td>
                        <div className="cell-actions">
                          <button className="btn-icon" onClick={() => openEditUser(user)} aria-label="Edit login">
                            <Pencil />
                          </button>
                          <button className="btn-icon danger" onClick={() => setUserToDelete(user)} aria-label="Delete login">
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      <div className="settings-grid">
        <div className="card settings-section">
          <div className="card-title" style={{ marginBottom: 16 }}>Center Profile</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["name", "Admin name"],
              ["email", "Email address"],
              ["center", "Center name"],
              ["phone", "Phone"],
            ].map(([k, label]) => (
              <div className="field" key={k}>
                <label>{label}</label>
                <input value={profile[k]} onChange={(e) => setProfile({ ...profile, [k]: e.target.value })} />
              </div>
            ))}
          </div>
        </div>

        <div className="card settings-section">
          <div className="card-title" style={{ marginBottom: 16 }}>Preferences</div>
          {[
            ["notifications", "Email notifications", "Daily summary of student activity"],
            ["sms", "SMS reminders", "Send class reminders to students"],
            ["autoBackup", "Automatic backups", "Backup data every 24 hours"],
            ["darkMode", "Dark mode", "Premium dark theme (recommended)"],
            ["twoFactor", "Two-factor auth", "Extra security on admin login"],
          ].map(([k, t, sub]) => (
            <div className="settings-row" key={k}>
              <div>
                <h5>{t}</h5>
                <p>{sub}</p>
              </div>
              <button className={`switch ${prefs[k] ? "on" : ""}`} onClick={() => toggle(k)} aria-label={t} />
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={editingUser !== null}
        title={editingUser === "new" ? "Login qo'shish" : "Loginni tahrirlash"}
        onClose={() => setEditingUser(null)}
        onSubmit={submitUser}
        submitLabel={editingUser === "new" ? "Qo'shish" : "Saqlash"}
      >
        <div className="grid-2">
          <div className="field">
            <label>Login</label>
            <input
              value={userForm.login}
              onChange={(event) => setUserForm({ ...userForm, login: event.target.value })}
            />
          </div>

          <div className="field">
            <label>Role</label>
            <select
              value={userForm.role}
              onChange={(event) =>
                setUserForm({
                  ...userForm,
                  role: event.target.value,
                  accesses: DEFAULT_ROLE_ACCESSES[event.target.value] || [],
                })
              }
            >
              <option value="ADMIN">ADMIN</option>
              <option value="DIRECTOR">DIRECTOR</option>
              <option value="MANAGER">MANAGER</option>
              <option value="TEACHER">TEACHER</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </div>

          <div className="field">
            <label>Status</label>
            <select
              value={userForm.status}
              onChange={(event) => setUserForm({ ...userForm, status: event.target.value })}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>{editingUser === "new" ? "Parol" : "Yangi parol"}</label>
            <input
              type="password"
              value={userForm.password}
              placeholder={editingUser === "new" ? "" : "Bo'sh qoldirilsa parol o'zgarmaydi"}
              onChange={(event) => setUserForm({ ...userForm, password: event.target.value })}
            />
          </div>

          {ACCESS_ROLES.includes(userForm.role) ? (
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>{ROLE_ACCESS_LABELS[userForm.role]}</label>
              <div className="access-grid">
                {accessCatalog.map((access) => (
                  <label className="access-check" key={access.name}>
                    <input
                      type="checkbox"
                      checked={userForm.accesses.includes(access.name)}
                      onChange={() => toggleAccess(access.name)}
                    />
                    <span>{access.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Modal>

      <ConfirmDialog
        open={userToDelete !== null}
        title="Login o'chirilsinmi?"
        message={userToDelete ? `"${userToDelete.login}" tizimga kira olmaydi.` : ""}
        onCancel={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
}
