"use client";

import { AlternateEmail, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  inputLabelClasses,
  styled,
} from "@mui/material";
import { useState } from "react";

const ToggleButtonStyled = styled(ToggleButton)({
  width: 250,
  color: "white",
  background: "rgb(255, 255, 255, 0.01)",
  fontSize: "1.3rem",
  textTransform: "none",
  borderEndEndRadius: 0,
  borderEndStartRadius: 0,
  "&:hover": {
    background: "rgb(255, 255, 255, 0.03)",
  },
  transition: "150ms",
  flexGrow: 1,
});

const TextFieldStyled = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },

    "&:hover fieldset": {
      borderColor: "white",
    },

    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },

  "& .MuiInputBase-input": {
    width: "100%",
    color: "white",
    fontWeight: 600,
  },

  "& label": {
    color: "white",
    fontWeight: 600,
  },

  "& input": {
    color: "white",
    fontSize: "1rem",
  },

  "& input:-webkit-autofill": {
    background: "transparent",
  },

  "& .MuiInput-underline:before": { borderBottomColor: "white" },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "white",
  },
  "& .MuiInput-underline:hover:after": {
    borderBottomColor: "white",
  },
  "& .MuiInput-underline:after": { borderBottomColor: "white" },

  width: "95%",
  marginBottom: 30,
  alignSelf: "center",
});

const ButtonContent = styled(Button)({
  color: "white",
  marginTop: 20,
  textTransform: "none",
  width: "100%",
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  padding: 10,
});

export default function LitestoreContentAuth() {
  const [type, setType] = useState("register");
  const [visibility, setVisibility] = useState(false);

  function handleType(ev: React.MouseEvent<HTMLElement>, val: string) {
    if (!val) return;

    setType(val);
  }

  function handleVisibility() {
    setVisibility(!visibility);
  }

  function register() {}

  function login() {}

  function forgot() {
    // TODO: Check email inserted already or make modal to input email
  }

  return (
    <div className="mobile:w-[90%]  bg-[#ffffff0d] rounded w-[500px] fixed flex flex-col items-center justify-center top-0 right-0 left-0 bottom-0 w-max m-auto h-max select-none">
      <ToggleButtonGroup
        className="w-full"
        color="primary"
        exclusive
        value={type}
        onChange={handleType}
      >
        <ToggleButtonStyled
          sx={{
            fontSize: {
              xs: "1.1rem",
              sm: "1.1rem",
              md: "1.3rem",
            },
          }}
          value="register"
        >
          Register
        </ToggleButtonStyled>
        <ToggleButtonStyled
          sx={{
            fontSize: {
              xs: "1.1rem",
              sm: "1.1rem",
              md: "1.3rem",
            },
          }}
          value="login"
        >
          Login
        </ToggleButtonStyled>
      </ToggleButtonGroup>

      <div className="flex flex-col mt-4 w-full h-[400px] p-6">
        {type == "register" && (
          <TextFieldStyled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmail htmlColor="white" />
                </InputAdornment>
              ),

              sx: {
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.8rem",
                  md: "1rem",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                // set the color of the label when not shrinked
                color: "white",
                [`&.${inputLabelClasses.shrink}`]: {
                  // set the color of the label when shrinked (usually when the TextField is focused)
                  color: "white",
                },

                fontSize: {
                  xs: "0.8rem",
                  sm: "0.8rem",
                  md: "1rem",
                },
              },
            }}
            variant="outlined"
            label="Identifier"
          />
        )}

        <TextFieldStyled
          InputLabelProps={{
            sx: {
              // set the color of the label when not shrinked
              color: "white",
              [`&.${inputLabelClasses.shrink}`]: {
                // set the color of the label when shrinked (usually when the TextField is focused)
                color: "white",
              },
            },
          }}
          variant="outlined"
          label="Email address"
        />

        <TextFieldStyled
          type={visibility ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onMouseDown={handleVisibility}>
                  {visibility ? (
                    <Visibility htmlColor="white" />
                  ) : (
                    <VisibilityOff htmlColor="white" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            sx: {
              // set the color of the label when not shrinked
              color: "white",
              [`&.${inputLabelClasses.shrink}`]: {
                // set the color of the label when shrinked (usually when the TextField is focused)
                color: "white",
              },
            },
          }}
          variant="outlined"
          label="Password"
        />

        {type == "login" && (
          <Button
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.75rem",
                md: "0.85rem",
              },
            }}
            className="w-max decoration-none translate-x-2"
          >
            Forgot password
          </Button>
        )}
      </div>

      <ButtonContent
        sx={{
          fontSize: {
            xs: "1rem",
            sm: "1rem",
            md: "1.2rem",
          },
        }}
        variant="contained"
      >
        Authenticate
      </ButtonContent>
    </div>
  );
}
