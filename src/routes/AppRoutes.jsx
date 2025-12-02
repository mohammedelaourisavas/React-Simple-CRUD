import { Routes, Route, Navigate } from "react-router-dom";
import { routesConfig } from "./routesConfig";

const AppRoutes = () => {
  return (
    <Routes>
      {routesConfig.map((group, idx) => {
        const Layout = group.layout;

        return (
          <Route key={idx} element={<Layout />}>
            {group.children.map((route) => {
              const Page = route.component;
              return (
                <Route key={route.path} path={route.path} element={<Page />} />
              );
            })}
          </Route>
        );
      })}

      <Route path="*" element={<Navigate to="/login" replace/>} />
    </Routes>
  );
};

export default AppRoutes;
