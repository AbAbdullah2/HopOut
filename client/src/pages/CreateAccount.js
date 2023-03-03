import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function CreateAccount(props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signup = (e) => {
    e.preventDefault();

    if (email.split('@')[1] !== "jhu.edu" && email.split('@')[1] !== "jh.edu") {
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
      password: password
    }

    const signupResponse = null;
    if (signupResponse) {
      navigate('/events');
    } else {
      const error = 'Could not create user ' + signupData.email;
      toast.error(error);
    }
  }

    return (
      <div className='bg-stone-100 min-h-screen'>
        <Toaster />
        <div className='mx-auto flex flex-col h-full'>
          <Header icons={false} />
          <div className="flex items-center justify-center py-6">
            <div className="w-full max-w-md">
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign Up
              </h2>
              <form className="mt-8 space-y-6" onSubmit={signup}>
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
                    className={email !== '' && (email.split('@')[1] !== "jhu.edu" && email.split('@')[1] !== "jh.edu") ?
                      "relative block w-full appearance-none rounded border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 border-red-500" :
                      "relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-indigo-500"}
                    placeholder="JHU Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    {email !== '' && (email.split('@')[1] !== "jhu.edu" && email.split('@')[1] !== "jh.edu") ? <p className="mb-0 text-red-500 text-xs italic">Email must end in @jhu.edu or @jh.edu.</p> : <></>}
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
                    className={password.length !== 0 && password.length < 6 ? 
                    "relative block w-full appearance-none rounded border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 border-red-500" :
                    "relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-indigo-500"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    {password.length !== 0 && password.length < 6 ? <p className="mb-0 text-red-500 text-xs italic">Password must be at least 6 characters.</p> : <></>}
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
                    className={confirmPassword !== password ?
                      "relative block w-full appearance-none rounded border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 border-red-500" :
                      "relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-indigo-500"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPassword !== password ? <p className="mb-0 text-red-500 text-xs italic">Passwords must match.</p> : <></>}
                  </div>
                </div>

                  <div>
                  <button
                      type="submit"
                      className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                      Create account
                  </button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CreateAccount;