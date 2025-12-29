import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAppSelector } from "../../app/hooks";

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const { theme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar isMobile={isMobile} />

      <div 
        className="flex-grow-1" 
        style={{ 
          marginLeft: isMobile ? 0 : '260px',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <Topbar isMobile={isMobile} />
        
        <main 
          className="p-3 p-md-4" 
          style={{ 
            marginTop: '70px',
            minHeight: 'calc(100vh - 70px)'
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
