"use client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, FormikProps } from "formik";
import axios from "axios";
import { useAppDispatch } from "@/lib/redux/hook";
import { login } from "@/lib/redux/features/authSlice";
import { setCookie } from "cookies-next";
import { LoginSchema } from "./schema";
import { Ilogin } from "./type";

export default function Login() {
  const dispatch = useAppDispatch();
  const initialValues: Ilogin = { email: "", password: "" };

  const onLogin = async (values: Ilogin) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
        values
      );

      dispatch(login({ user: data.user }));
      setCookie("access_token", data.token);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col justify-center justify-items-center items-center gap-5 p-4">
      <p className="text-4xl font-bold mb-6">LOGIN FORM</p>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={onLogin}
      >
        {(props: FormikProps<Ilogin>) => (
          <Form className="w-full max-w-md">
            <div className="flex flex-col gap-4 mb-4">
              <label className="font-medium">Email:</label>
              <Field
                type="email"
                name="email"
                className="p-2 border rounded"
                onChange={props.handleChange}
                value={props.values.email}
              />
              {props.touched.email && props.errors.email && (
                <div className="text-red-500 text-sm">
                  *{props.errors.email}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 mb-6">
              <label className="font-medium">Password:</label>
              <Field
                type="password"
                name="password"
                className="p-2 border rounded"
                onChange={props.handleChange}
                value={props.values.password}
              />
              {props.touched.password && props.errors.password && (
                <div className="text-red-500 text-sm">
                  *{props.errors.password}
                </div>
              )}
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              type="submit"
              disabled={props.isSubmitting}
            >
              {props.isSubmitting ? "Logging in..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
