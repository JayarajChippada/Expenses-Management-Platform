import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  Receipt,
  AccountBalanceWallet,
  TrendingUp,
  Flag,
  Assessment,
  Settings,
  Logout,
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { closeSidebar } from "../../features/ui/uiSlice";
import { logOut } from "../../features/auth/authSlice";

const DRAWER_WIDTH = 260;

interface SidebarProps {
  isMobile: boolean;
}

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
  { label: "Expenses", path: "/expenses", icon: <Receipt /> },
  { label: "Income", path: "/income", icon: <AccountBalanceWallet /> },
  { label: "Budgets", path: "/budgets", icon: <TrendingUp /> },
  { label: "Goals", path: "/goals", icon: <Flag /> },
  { label: "Reports", path: "/reports", icon: <Assessment /> },
  { label: "Settings", path: "/settings", icon: <Settings /> },
];

const Sidebar = ({ isMobile }: SidebarProps) => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AccountBalanceWallet sx={{ color: "#667eea", fontSize: 32 }} />
          <Typography variant="h6" fontWeight="bold" color="#667eea">
            ExpenseManager
          </Typography>
        </Box>
      </Toolbar>
      <Divider />

      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={isMobile ? () => dispatch(closeSidebar()) : undefined}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.active": {
                bgcolor: "rgba(102, 126, 234, 0.12)",
                color: "#667eea",
                "& .MuiListItemIcon-root": {
                  color: "#667eea",
                },
              },
              "&:hover": {
                bgcolor: "rgba(102, 126, 234, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#ef4444",
            "&:hover": {
              bgcolor: "rgba(239, 68, 68, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "#ef4444" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? sidebarOpen : true}
      onClose={() => dispatch(closeSidebar())}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0,0,0,0.08)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
