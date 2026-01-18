import ProfileSettings from "./components/ProfileSettings";

const Settings = () => {
  return (
    <div className="container-fluid p-0">
      <h4 className="fw-bold text-dark mb-4">Profile</h4>

      <div className="mt-2">
        <ProfileSettings />
      </div>
    </div>
  );
};

export default Settings;
