"use client";

import Swal from "sweetalert2";
import { Formik, Form, Field, FormikProps } from "formik";
import axios from "axios";
import { useAppDispatch } from "@/lib/redux/hook";
import { login } from "@/lib/redux/features/authSlice";
import { useSetCookie } from "cookies-next";
import { LoginSchema } from "./schema";
import { Ilogin } from "./type";

export default function Login() {
  const setCookie = useSetCookie();
  const dispatch = useAppDispatch();
  const initialValues: Ilogin = { email: "", password: "" };

  const onLogin = async (values: Ilogin) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
        {
          ...values,
        }
      );

      dispatch(login({ user: data.user }));

      setCookie("access_token", data.token);

      Swal.fire({
        title: data.message,
        icon: "success",
        confirmButtonText: "Cool",
        timer: 2000,
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center justify-items-center items-center gap-5">
      <p className="text-4xl">LOGIN FORM</p>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          onLogin(values);
        }}
      >
        {(props: FormikProps<Ilogin>) => {
          const { values, handleChange, touched, errors } = props;

          return (
            <Form>
              <div className="flex flex-col gap-4">
                <label>Email :</label>
                <Field
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                />
                {touched.email && errors.email ? (
                  <div className="text-red-500">*{errors.email}</div>
                ) : null}
              </div>
              <div className="flex flex-col gap-4">
                <label>Password :</label>
                <Field
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                />
                {touched.password && errors.password ? (
                  <div className="text-red-500">*{errors.password}</div>
                ) : null}
              </div>
              <button className="standard-button" type="submit">
                Submit
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
