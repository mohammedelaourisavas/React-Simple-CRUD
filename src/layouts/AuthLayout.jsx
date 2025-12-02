import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      {/* auth wrapper UI */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
