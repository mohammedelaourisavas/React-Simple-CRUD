import { Routes, Route, Navigate } from "react-router-dom";
import { routesConfig } from "./routesConfig";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {routesConfig.map((group, idx) => {
        const Layout = group.layout;

        return (
          <Route key={idx} element={<Layout />}>
            {group.children.map((route) => {
              const Page = route.component;

              const element = route.authRequired ? (
                <ProtectedRoute>
                  <Page />
                </ProtectedRoute>
              ) : (
                <Page />
              );

              return (
                <Route key={route.path} path={route.path} element={element} />
              );
            })}
          </Route>
        );
      })}

      {/* fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
