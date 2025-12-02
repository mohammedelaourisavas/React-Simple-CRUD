import { Outlet } from "react-router-dom";
import { Container, Box } from "@mui/material";

const MainLayout = () => {
  return (
    <Container
      maxWidth="sm" // adjust width as needed
      sx={{
        height: "100vh", // full viewport height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: 2,
        }}
      >
        <Outlet />
      </Box>
    </Container>
  );
};

export default MainLayout;
