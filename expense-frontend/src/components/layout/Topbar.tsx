import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications,
  Person,
  Settings,
  Logout,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleSidebar } from "../../features/ui/uiSlice";
import { logOut } from "../../features/auth/authSlice";

interface TopbarProps {
  isMobile: boolean;
}

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/expenses": "Expenses",
    "/income": "Income",
    "/budgets": "Budgets",
    "/goals": "Goals",
    "/reports": "Reports",
    "/settings": "Settings",
  };
  return routes[pathname] || "Dashboard";
};

const Topbar = ({ isMobile }: TopbarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logOut());
    navigate("/login");
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate("/settings");
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "white",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar className="d-flex justify-content-between">
        <Box className="d-flex align-items-center">
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => dispatch(toggleSidebar())}
              sx={{ mr: 1, color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            {getPageTitle(location.pathname)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton sx={{ color: "text.secondary" }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {getInitials(user?.fullName)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.fullName || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || "user@example.com"}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: "#ef4444" }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: "#ef4444" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
