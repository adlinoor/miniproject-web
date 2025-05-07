"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, FormikProps } from "formik";
import axios from "axios";
import { RegisterSchema } from "./schema";
import { IRegister } from "./type";

export default function Register() {
  const initialValues: IRegister = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  };

  const onRegister = async (values: IRegister) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        {
          email: values.email,
          password: values.password,
          first_name: values.firstName,
          last_name: values.lastName,
        }
      );

      toast.success(data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center justify-items-center items-center gap-5">
      <ToastContainer />
      <p className="text-4xl">REGISTER FORM</p>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          onRegister(values);
        }}
      >
        {(props: FormikProps<IRegister>) => {
          const { values, handleChange, touched, errors } = props;

          return (
            <Form className="w-full max-w-md">
              <div className="flex flex-col gap-4 mb-4">
                <label className="block text-gray-700">Email:</label>
                <Field
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  className="w-full p-2 border rounded"
                />
                {touched.email && errors.email ? (
                  <div className="text-red-500 text-sm">*{errors.email}</div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 mb-4">
                <label className="block text-gray-700">Password:</label>
                <Field
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                  className="w-full p-2 border rounded"
                />
                {touched.password && errors.password ? (
                  <div className="text-red-500 text-sm">*{errors.password}</div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 mb-4">
                <label className="block text-gray-700">First Name:</label>
                <Field
                  type="text"
                  name="firstName"
                  onChange={handleChange}
                  value={values.firstName}
                  className="w-full p-2 border rounded"
                />
                {touched.firstName && errors.firstName ? (
                  <div className="text-red-500 text-sm">
                    *{errors.firstName}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <label className="block text-gray-700">Last Name:</label>
                <Field
                  type="text"
                  name="lastName"
                  onChange={handleChange}
                  value={values.lastName}
                  className="w-full p-2 border rounded"
                />
                {touched.lastName && errors.lastName ? (
                  <div className="text-red-500 text-sm">*{errors.lastName}</div>
                ) : null}
              </div>

              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
