import React, { useState } from "react";
import { getAllUsers, register, emailVerification } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function CreateAccount(props) {
  const navigate = useNavigate();
  const { setCurUser } = props;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [inputtedCode, setInputtedCode] = useState("");

  const [verify, setVerify] = useState("verify");

  const verification = async (e) => {
    e.preventDefault();

    const [jhed, emailSite] = email.split("@");
    if (emailSite !== "jhu.edu" && emailSite !== "jh.edu") {
      toast.error("Email must end in @jhu.edu or @jh.edu");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const signupData = {
      name: name,
      email: email,
      password: password,
    };

    // Check if account already exists
    const userData = await getAllUsers();
    let users = userData.data.data;
    for (const u in users) {
      const user = users[u];
      if (jhed === user["email"].split("@")[0]) {
        toast.error("Email already associated with an account.");
        return;
      }
    }

    // send verification email
    emailVerification({ name: signupData.name, email: signupData.email }).then(
      (data) => {
        if (data.status === 201) {
          setVerificationCode(data.data.data.code);
          setVerify("verifying");
        } else {
          const error = "Could not verify user " + email;
          toast.error(error);
        }
      }
    );
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (verificationCode === inputtedCode) {
      setVerify("verified");
      signup();
    } else {
      toast.error("Verification code is incorrect");
      return;
    }
  };

  const signup = async () => {
    const signupData = {
      name: name,
      email: email,
      password: password,
    };
    // Call register
    register(signupData)
      .then((data) => {
        if (data.status === 200 || data.status === 201) {
          setCurUser(data.data.data);
          navigate("/events");
        } else {
          const error = "Could not register user " + email;
          toast.error(error);
        }
      })
      .catch((err) => {
        console.log(err);
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
              Sign Up
            </h2>
            {verify === "verify" && (
              <form className="mt-8 space-y-6" onSubmit={verification}>
                <div className="rounded-md shadow-sm space-y-3">
                  <div>
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
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="name"
                      autoComplete="name"
                      required
                      className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className={
                        password.length !== 0 && password.length < 6
                          ? "relative block w-full appearance-none rounded border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 border-red-500"
                          : "relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-indigo-500"
                      }
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {password.length !== 0 && password.length < 6 ? (
                      <p className="mb-0 text-red-500 text-xs italic">
                        Password must be at least 6 characters.
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div>
                    <label htmlFor="passwordconfirm" className="sr-only">
                      Confirm password
                    </label>
                    <input
                      id="passwordconfirm"
                      name="passwordconfirm"
                      type="password"
                      autoComplete="current-password"
                      required
                      className={
                        confirmPassword !== password
                          ? "relative block w-full appearance-none rounded border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 border-red-500"
                          : "relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-indigo-500"
                      }
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPassword !== password ? (
                      <p className="mb-0 text-red-500 text-xs italic">
                        Passwords must match.
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}
            {verify === "verifying" && (
              <form onSubmit={verifyCode}>
                <div className="mb-4">
                  <p className="mt-6 text-center text-md font-medium tracking-tight text-gray-900">
                    Please check your JHU email for your verification code
                  </p>
                  <div className="rounded-md shadow-sm space-y-3">
                    <label htmlFor="verificationCode" className="sr-only">
                      Verification code
                    </label>
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      autoComplete="off"
                      required
                      className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-indigo-500"
                      placeholder="Enter your 6-digit verification code"
                      value={inputtedCode}
                      onChange={(e) => setInputtedCode(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
