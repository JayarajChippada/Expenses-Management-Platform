import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

const ProfileSettings = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "John Doe",
    email: user?.email || "john@example.com",
    phone: "+91 98765 43210",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError("");
  };

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    alert("Password changed successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box>
      {/* Profile Info */}
      <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Profile Information
          </Typography>

          {profileSaved && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Profile updated successfully!
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 36,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {getInitials(profileData.fullName)}
              </Avatar>
              <Button size="small" startIcon={<Edit />} sx={{ textTransform: "none" }}>
                Change Photo
              </Button>
            </Box>

            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Box className="row g-3">
                <Box className="col-md-6">
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                  />
                </Box>
                <Box className="col-md-6">
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled
                    helperText="Email cannot be changed"
                  />
                </Box>
                <Box className="col-md-6">
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={handleSaveProfile}
            sx={{
              textTransform: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Change Password
          </Typography>

          {passwordError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {passwordError}
            </Alert>
          )}

          <Box className="row g-3" sx={{ maxWidth: 500 }}>
            <Box className="col-12">
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box className="col-12">
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box className="col-12">
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={handleChangePassword}
            sx={{
              mt: 3,
              textTransform: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileSettings;
