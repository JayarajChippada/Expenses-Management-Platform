import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DRAWER_WIDTH = 260;

const AppLayout = () => {
  const isMobile = useMediaQuery("(max-width: 992px)");

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar isMobile={isMobile} />
      <Sidebar isMobile={isMobile} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: isMobile ? 0 : `${DRAWER_WIDTH}px`,
        }}
        className="container-fluid"
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
