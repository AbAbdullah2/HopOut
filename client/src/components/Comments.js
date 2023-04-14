import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../services/api';


function Comments(props) {
    const { curUser, event } = props;
    const [allUsers, setAllUsers] = useState([])
    const fakeComments = [
        {
            _id: "uid",
            author: curUser._id,
            text: "Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy.",
            date: new Date(),
        },
        {
            _id: "uid",
            author: curUser._id,
            text: "Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy.",
            date: new Date(),
        },
        {
            _id: "uid",
            author: curUser._id,
            text: "Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy.",
            date: new Date(),
        }

    ]
    const [comments, setComments] = event && event.comments ? event.comments : fakeComments;

    useEffect(() => {
        getAllUsers().then((res) => {
            setAllUsers(res.data.data);
        })  
    }, []);

    useEffect(() => {
        
    }, [comments]);

    const handlePostComment = () => {
        
    };

    return (
        <div className="relative">
            <section className="dark:bg-gray-900 py-3" >
            <div className="max-w-2xl mx-auto px-2">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Comments ({event && event.comments ? event.comments.length : 0})</h4>
                </div>
                <form className="mb-6" onSubmit={handlePostComment}>
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <label for="comment" className="sr-only">Your comment</label>
                        <textarea id="comment" rows="6"
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Write a comment..." required></textarea>
                    </div>
                    <button type="submit"
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                        Post comment
                    </button>
                </form>
                { 
                fakeComments.map((comment) => (
                    <article className="p-6 mb-3 text-base bg-white rounded-lg dark:bg-gray-900">
                    <footer className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">{allUsers && allUsers.find(user => user._id === comment.author) ? allUsers.find(user => user._id === comment.author).name : ""}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {comment.date.toDateString()}
                            </p>
                        </div>
                        <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            type="button">
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
                                </path>
                            </svg>
                            <span className="sr-only">Comment settings</span>
                        </button>
                    </footer>
                    <p className="text-gray-500 dark:text-gray-400">{comment ? comment.text : ""}</p>
                    <div className="flex items-center mt-4 space-x-4">
                        {/* <button type="button"
                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                            <svg aria-hidden="true" className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            Reply
                        </button> */}
                    </div>
                </article>
                ))

                }

            </div>
            </section>
        </div>
    );

}

export default Comments;
