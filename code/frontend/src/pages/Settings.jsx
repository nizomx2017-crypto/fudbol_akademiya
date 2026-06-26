import { useState } from "react";
import { Save } from "lucide-react";

export default function Settings() {
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

  const toggle = (k) => setPrefs({ ...prefs, [k]: !prefs[k] });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Manage your center profile and preferences.</p>
        </div>
        <button className="btn btn-primary"><Save /> Save changes</button>
      </div>

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
    </div>
  );
}