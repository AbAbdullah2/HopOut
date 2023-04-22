import React, { useState } from "react";
import { getAllUsers, forgotPassword, updateUser } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header";

function ForgotPassword(props) {
  const [email, setEmail] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleForgot = (e) => {
    e.preventDefault();

    const [jhed, emailSite] = email.split("@");
    if (emailSite !== "jhu.edu" && emailSite !== "jh.edu") {
      toast.error("Email must end in @jhu.edu or @jh.edu");
      return;
    }

    setSubmitted(true);

    // Check if account already exists
    getAllUsers().then((userData) => {
      let users = userData.data.data;
      users.forEach((user) => {
        if (jhed === user["email"].split("@")[0]) {
          const tempPassword = Math.random().toString(36).substring(2,10);

          const updatedUser = {
            _id: user["_id"],
            password: tempPassword,
          };

          updateUser(updatedUser).then((response) => {
            if (response.status === 200) {
              forgotPassword(user, tempPassword).then((response) => {
                if (response.status !== 201) {
                  toast.error("Failed to send email, please try again");
                }
              });
            } else {
              toast.error('Error, please try again');
            }
          });      

        }
      });
    });
  };

  return (
    <div className="bg-stone-100 min-h-screen">
      <Toaster />
      <div className="mx-auto flex flex-col h-full">
        <Header icons={false} />
        <div className="flex items-center justify-center py-6">
          <div className="w-full max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Forgot Password
            </h2>
            {!submitted ? (
              <form className="mt-8 space-y-6" onSubmit={handleForgot}>
                <div className="rounded-md shadow-sm space-y-3">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={
                      email !== "" &&
                      email.split("@")[1] !== "jhu.edu" &&
                      email.split("@")[1] !== "jh.edu"
                        ? "relative block w-full appearance-none rounded border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 border-red-500"
                        : "relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-indigo-500"
                    }
                    placeholder="JHU Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {email !== "" &&
                  email.split("@")[1] !== "jhu.edu" &&
                  email.split("@")[1] !== "jh.edu" ? (
                    <p className="mb-0 text-red-500 text-xs italic">
                      Email must end in @jhu.edu or @jh.edu.
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Confirm Email
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="mt-6 text-center text-md font-medium tracking-tight text-gray-900">
                  If an email is associated with your account, you will receive a temporary password. Please use this password to log in and change your password.
                </p>
                <a className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" href="/login"> Login </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;