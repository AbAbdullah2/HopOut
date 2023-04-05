import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import { getAllUsers, sendFriendReq } from "../services/api.js";

function AddFriends(props) {
    
    const {curUser, setCurUser} = props
    const [results, setResults] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    useEffect(() => {
        getAllUsers().then((res) => {
          setUsers(res.data.data.filter((u) => {return u._id !== curUser._id}));
        });  
    }, [curUser]);
    
    const handleSearch = async (e) => {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        const filteredPeople = users.filter((user) => {
            return user.name.toLowerCase().includes(searchInput.value.toLowerCase()) || user.email.toLowerCase().includes(searchInput.value.toLowerCase())});
        setResults((prevResults) =>
    filteredPeople.map((user) => {
      const prevUser = prevResults.find((u) => u._id === user._id) || {};
      //NOTE: the current user's sentFriends isn't updated but the friend's receivedFriends is
      //const isFriend = curUser.friends.some((friend) => friend._id === user._id);
      //const hasSentRequest = curUser.sentFriends.some((friend) => friend._id === user._id);
      //const hasReceivedRequest = curUser.receivedFriends.some((friend) => friend._id === user._id);
        const isFriend = user.friends.some((friend) => friend.user === curUser._id);
        const hasSentRequest = user.sentFriends.some((friend) => friend.user === curUser._id);
        const hasReceivedRequest = user.receivedFriends.some((friend) => friend.user === curUser._id);
      const isDisabled = isFriend || hasSentRequest || hasReceivedRequest || prevUser.isDisabled;
      return {
        ...user,
        isDisabled,
      };
    })
  );
        const searchResults = users.filter((user) => {
            return user.name.toLowerCase().includes(searchInput.value.toLowerCase()) || user.email.toLowerCase().includes(searchInput.value.toLowerCase())
        });
    }

    async function handleFriendReq(receiverId) {
        const response = await sendFriendReq(curUser._id, receiverId);
        setResults(results.map(user => {
            if (user._id === receiverId) {
              return {
                ...user,
                isDisabled: true,
              };
            }
            return user;
        }));

    }

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
      };
    
      const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
      };
    
      const resultsToDisplay = results.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

    return(
        <div className='bg-stone-100 min-h-screen'>
            <div className='mx-auto flex flex-col h-full space-y-4'>
                <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" 
                                className="w-5 h-5 text-gray-500 dark:text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input type="search" id="default-search" 
                                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Search Users" 
                        required/>
                        <button type="button" 
                                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                                onClick={handleSearch}>Search</button>
                    </div>
                    <div className="my-5 w-11/12 mx-auto md:grid md:grid-cols-3 gap-4">
                    {resultsToDisplay.map(user => {
                        return (
                            <div key={user._id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex flex-col items-center pb-10">
                                    <div className="w-24 h-24 mb-3 mt-4 rounded-full bg-gray-300 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0 2c-3.87 0-11 1.94-11 5.82v2.18h22v-2.18c0-3.88-7.13-5.82-11-5.82z" />
                                        </svg>
                                    </div>
                                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.name}</h5>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                                    <div className="flex mt-4 space-x-3 md:mt-6">
                                        <button type="button"
                                                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center rounded-lg focus:ring-4 focus:outline-none
                                                ${user.isDisabled ? 'bg-gray-400 cursor-not-allowed text-gray-600 dark:bg-gray-500 dark:text-gray-400' : 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'}`}
                                                onClick={() => {
                                                    handleFriendReq(user._id); 
                                                }}
                                                disabled={user.isDisabled}>
                                                    Add friend
                                        </button>
                                        <a href={(user ? "/profile/"+user._id : "/profile/")} 
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                                                View Profile
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col mx-auto mt-4">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage-1)*itemsPerPage+1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage*itemsPerPage, results.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{results.length}</span> Entries
                    </span>
                    <div className="inline-flex justify-center mt-2 xs:mt-0">
                        <button className="inline-flex items-center px-4 py-2 mr-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}>
                            <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(results.length / itemsPerPage)}>
                            <svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFriends;