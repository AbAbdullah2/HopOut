import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast, { Toaster } from 'react-hot-toast';
import { postLogin, getUser } from '../services/api';

function Login(props) {
  const { curUser, setCurUser } = props
  const navigate = useNavigate();

  useEffect(() => {
    if (curUser) navigate('/events');
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();
    const loginData = {
      email: email,
      password: password
    }

    const loginResponse = postLogin(loginData).then(data => {
        if (data.status === 200) {
          // Fetch user details based on userID
            getUser(data.data.data._id).then(userData => {
                setCurUser(userData.data.data);
                navigate('/events');
            })
        }
    }).catch(err => {
      const error = 'Could not login user ' + loginData.email;
      toast.error(error);
      console.log(err)});

    if (!loginResponse) {
      const error = 'Could not login user ' + loginData.email;
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
              Welcome back!
            </h2>
            <form className="mt-8 space-y-6" onSubmit={login}>
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                    <label htmlFor="email" className="sr-only">
                    Email address
                    </label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
              </div>
              <div className="flex items-center space-x-5">
                <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon icon={solid('lock')} className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                    Login
                </button>
                <button
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={(e) => navigate('/signup')}
                >
                  Sign Up 
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;