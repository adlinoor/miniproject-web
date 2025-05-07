import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/,
      "Password must contain at least one letter and one number"
    )
    .required("Password is required"),
  firstName: Yup.string()
    .required("First name is required")
    .matches(/^[A-Za-z]+$/, "First name should only contain letters"),
  lastName: Yup.string()
    .required("Last name is required")
    .matches(/^[A-Za-z]+$/, "Last name should only contain letters"),
});
