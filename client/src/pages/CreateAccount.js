import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function CreateAccount(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [success, setSuccess] = useState(false);
    const [toast, setToast] = useState(false);

    const create = (e) => {
        console.log("create:", e);
        if (email.substring(email.length - 8) !== "@jhu.edu" || password !== confirmPassword || password.length < 6) {
            setSuccess(false); 
            return;
        }
        else setSuccess(true);
        setToast(true);
    }

    return (
        <>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Create a new HopOut account
                </h2>
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST">
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="-space-y-px rounded-md shadow-sm">
                <div className="mb-3">
                    <label htmlFor="email-address" className="sr-only">
                    Email address
                    </label>
                    <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address (must end in @jhu.edu)"
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
                    className={password.length != 0 && password.length < 6 ? 
                    "relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border-red-500" :
                    "relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    {password.length != 0 && password.length < 6 ? <p class="mb-0 text-red-500 text-xs italic">Password must at least 6 characters.</p> : <></>}

                </div>
                <div>
                    <label htmlFor="password" className="sr-only">
                    Confirm password
                    </label>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-3 relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                </div>

                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    value={remember}
                    onChange={() => setRemember(!remember)}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                    </label>
                </div>
                </div>

                <div>
                <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={(e) => create(e)}
                >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon icon={solid('lock')} className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                    </span>
                    Create account
                </button>
                </div>
            </form>
            {toast ?  (
            <div id="toast-default" className="flex justify-center items-center w-full max-w-md p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-600" role="alert">
                <div className="ml-3 text-sm font-normal">{success ? "Account created successfuly!" : "Something went wrong. Please try again. Can only create account with email ending in \".jhu.edu\"."}</div>
                <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-600 dark:hover:text-white dark:bg-gray-500 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close" onClick={()=> setToast(false)}>
                    <span className="sr-only">Close</span>
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>            
            ): <></>}
            </div>
        </div>
        </>
    );
}

export default CreateAccount;