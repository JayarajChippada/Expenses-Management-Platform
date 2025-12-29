import { useState } from "react";
import ProfileSettings from "./components/ProfileSettings";
import PreferencesSettings from "./components/PreferencesSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Profile Information", icon: "bi-person-badge" },
    { label: "App Preferences", icon: "bi-gear-wide-connected" },
  ];

  return (
    <div className="container-fluid p-0">
      <h4 className="fw-bold text-dark mb-4">Account Settings</h4>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-4 shadow-sm d-inline-flex mb-4 border border-light">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`btn border-0 fw-bold px-4 py-2 d-flex align-items-center gap-2 transition-all rounded-3 ${activeTab === index ? 'bg-primary-light text-primary-custom' : 'text-muted'}`}
            onClick={() => setActiveTab(index)}
          >
            <i className={`bi ${tab.icon}`}></i>
            <span className="small">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {activeTab === 0 && <ProfileSettings />}
        {activeTab === 1 && <PreferencesSettings />}
      </div>
    </div>
  );
};

export default Settings;
