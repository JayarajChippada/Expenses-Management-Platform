import { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import ProfileSettings from "./components/ProfileSettings";
import PreferencesSettings from "./components/PreferencesSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{
          mb: 3,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
        }}
      >
        <Tab label="Profile" />
        <Tab label="Preferences" />
      </Tabs>

      <Box>
        {activeTab === 0 && <ProfileSettings />}
        {activeTab === 1 && <PreferencesSettings />}
      </Box>
    </Box>
  );
};

export default Settings;
