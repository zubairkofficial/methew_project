import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../Components/common/PageLoader/PageLoader";






PageLoader






const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSignUp = (values) => {
    // Handle sign-up logic here (e.g., API call)
    console.log("Sign-up values:", values);

    // Simulating loading with timeout
    setTimeout(() => {
      setLoading(true);




    //api call for registering and then re routing to the verify email

    // removal of the tokedn from the local storafe



      // Show success toast and navigate to dashboard
      toast.success("Sign-up successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate("/dashboard");
    }, 2000);
  };

  useEffect(() => {
    // Simulating initial loading state
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        // Show loader while loading
        <div className="h-screen flex items-center justify-center">
          <PageLoader />
        </div>
      ) : (
        // Show sign-up form when not loading
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
          <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
            <h1 className="font-bold text-center text-2xl mb-5">Sign Up</h1>
            <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
              <div className="px-5 py-7">
                <Formik
                  initialValues={{
                    email: "",
                    firstName: "",
                    lastName: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSignUp(values);
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-4">
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">
                          Email
                        </label>
                        <Field
                          type="text"
                          name="email"
                          className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <label className="font-semibold text-sm text-gray-600 pb-1 block">
                            First Name
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-sm text-gray-600 pb-1 block">
                            Last Name
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">
                          Password
                        </label>
                        <Field
                          type="password"
                          name="password"
                          className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">
                          Confirm Password
                        </label>
                        <Field
                          type="password"
                          name="confirmPassword"
                          className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <button
                        type="submit"
                        className="transition duration-200 bg-primary-light hover:bg-primary-light text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="flex flex-col justify-content item-center">
              
                  <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                    Forgot Password?
                  </button>
                
                  <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                    Already have an account? Login
                  </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
