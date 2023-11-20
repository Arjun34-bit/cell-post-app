import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  LinearProgress,
} from "@mui/material";
import Form from "./Form";
import { useState } from "react";
import { setLinearLoading } from "states";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const url = process.env.API_URL;
  const theme = useTheme();
  const linearLoading = useSelector((state) => state.linearLoading);
  console.log(linearLoading);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign={"center "}
      >
        <Typography fontWeight={"bold"} fontSize={"32px"} color="primary">
          Cell-Post
        </Typography>
      </Box>
      {linearLoading ? <LinearProgress color="success" /> : ""}

      <Box
        width={isNonMobileScreens ? "50%" : "30%"}
        p="2rem"
        m="2rem auto"
        borderRadius={"1.5rem"}
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight={"500"} variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Cell-Post, from Team Cell
        </Typography>
        <Form url={url} />
      </Box>
    </Box>
  );
};

export default LoginPage;
