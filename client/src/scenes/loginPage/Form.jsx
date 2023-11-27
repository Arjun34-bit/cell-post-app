import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLinearLoading, setLogin } from "states";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email ").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValueRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValueLogin = {
  email: "",
  password: "",
};

const Form = ({ url }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [mode, setMode] = useState("dark");
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();

    for (let value in values) {
      formData.append(value, values[value]);
    }

    formData.append("picturePath", values.picture.name);

    try {
      dispatch(setLinearLoading(true));
      if (!formData.get("picturePath")) {
        throw new Error("Upload Image");
      }
      const saveUserResponse = await fetch(`/auth/register`, {
        method: "POST",
        body: formData,
      });

      if (saveUserResponse.status === 400) {
        throw new Error("Email Already Registered");
      }

      if (saveUserResponse.status === 500) {
        throw new Error("Server Error");
      }

      const saveUser = await saveUserResponse.json();
      onSubmitProps.resetForm();
      dispatch(setLinearLoading(false));
      if (saveUser) {
        setPageType("login");
        showSuccessToast("Registeration Successfull");
      }
    } catch (error) {
      dispatch(setLinearLoading(false));
      showErrorToast(error.message);
    }
  };

  const showErrorToast = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: mode,
    });
  };
  const showSuccessToast = (msg) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: mode,
    });
  };

  const login = async (values, onSubmitProps) => {
    try {
      dispatch(setLinearLoading(true));
      const loggedInResponse = await fetch(`/auth/login `, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (loggedInResponse.status === 404) {
        setErrorMessage("Account not Found");
        throw new Error("Account not Found");
      }

      if (loggedInResponse.status === 400) {
        // setErrorMessage("User Name or Password is Incorrect")
        throw new Error("User Name or Password is Incorrect");
      }

      if (loggedInResponse.status === 503) {
        setErrorMessage("Internet Connection Required");
        throw new Error("Internet Connection Required");
      }

      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      dispatch(setLinearLoading(false));
      navigate("/home");
    } catch (error) {
      dispatch(setLinearLoading(false));
      showErrorToast(error.message);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValueLogin : initialValueRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4,minmax(0,1fr))"
            sx={{
              "&>div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="firstName"
                  value={values.firstName}
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="occupation"
                  value={values.occupation}
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  name="location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 2" }}
                />

                <Box
                  gridColumn={"Span 4"}
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius={"5px"}
                  p="1rem"
                >
                  <Dropzone
                    acceptFiles=".jpes,.jps,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          {/* Buttons  */}

          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": {
                  color: palette.primary.main,
                },
              }}
            >
              {isLogin ? "Login" : "Register"}
            </Button>
            <Typography
              display="flex"
              justifyContent={"center "}
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up Here."
                : "Already have an account? Login Here"}
            </Typography>
          </Box>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={mode}
          />
        </form>
      )}
    </Formik>
  );
};

export default Form;
