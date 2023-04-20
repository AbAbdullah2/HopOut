import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getAllComments, createComment, deleteComment} from '../services/api';
import { Menu } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'


function Comments(props) {
    const { curUser, event } = props;
    const [allUsers, setAllUsers] = useState([])
    const [commentText, setCommentText] = useState("");
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

    const [commentSection, setCommentSection] = useState(null);

    useEffect(() => {
        console.log("useeffectcalled:")
        getAllUsers().then((res) => {
            setAllUsers(res.data.data);
        }); 
        getAllComments(event._id).then((res) => {
            console.log("get all comments res.data.data ", res.data)

            if (res.data.data.length && res.data.data.length > 0) {
                // setComments(res.data.data[0].comments);
                console.log("get all comments res.data.data ", res.data.data)
                setCommentSection(res.data.data[0])
            }
        });
    }, []);

    useEffect(() => {
        
    }, [commentSection]);

    const handlePostComment = async (e) => {
        // console.log('posting comment!', e);
        e.preventDefault();
        console.log("e: ", e);
        console.log("commentText: ", commentText);
        console.log("commentSection: ", commentSection);
        createComment(event._id, commentSection._id, curUser._id, commentText).then((res) => {
            console.log("res.data: ", res.data);
            setCommentSection(res.data.data);
        });
    };

    const handleDelete = (comment) => {
        deleteComment(commentSection._id, comment._id, curUser._id).then((res) => {
            console.log("deletecomment res: ", res);
            if (res.status == 200) {
                let newComments = commentSection.comments;
                newComments = newComments.filter(c => c._id != res.data.data._id);
                console.log("setting new comments to: ", newComments);
          
                setCommentSection({...commentSection, comments: newComments});
            }
        });
    };
            
        return (
            <div className="relative w-full" >
                <section className="dark:bg-gray-900 py-3" >
                {(!curUser.attending.includes(event._id)) ? 
                    <div className="max-w-2xl mx-auto px-2">
                        
                    <div className="flex justify-between items-center mb-3 w-full">
                        <h4 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Comments ({commentSection ? commentSection.comments.length : 0})</h4>
                    </div>
                    <form className="mb-6 w-full" onSubmit={handlePostComment}>
                        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <label for="comment" className="sr-only">Your comment</label>
                            <textarea id="comment" rows="6"
                                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder="Write a comment..." required onChange={(e) => {setCommentText(e.target.value); console.log("e", e.target.value);}}>{commentText}</textarea>
                        </div>
                        <button type="submit"
                            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                            Post comment
                        </button>
                    </form>
                    { commentSection ? 
                    commentSection.comments.map((comment) => (
                        <article key={comment._id} className="p-6 mb-3 text-base bg-white rounded-lg dark:bg-gray-900">
                        <footer className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <a href={`/profile/${allUsers && allUsers.find(user => user._id === comment.sender) ? allUsers.find(user => user._id === comment.sender)._id : ""}`}>
                                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">{allUsers && allUsers.find(user => user._id === comment.sender) ? allUsers.find(user => user._id === comment.sender).name : ""}</p>
                                </a>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </p>
                            </div>
                            {comment.sender === curUser._id ?  
                            <Menu>
                                <Menu.Button>
                                <div className='opacity-60 hover:opacity-90'><FontAwesomeIcon icon={solid('ellipsis-vertical')} className="px-1" /></div>
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-fill origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <Menu.Item className="p-2 w-full hover:bg-blue-200 text-sm">
                                    {({ active }) => (
                                        <button onClick={() => handleDelete(comment)} >
                                        Delete 
                                        </button>
                                    //   </a>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Menu>
                          
                            
                             : <></>
                            }
                        </footer>
                        <p className="text-gray-500 dark:text-gray-400">{comment ? comment.message : ""}</p>
                    </article>
                    )) : <></>
                    }
                    </div> 
                :
                <div className="max-w-2xl mx-auto px-2">
                    <div className="flex justify-between items-center mb-3 w-full">
                        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">RSVP to event to view and post comments!</h2>
                    </div>
                </div>
                }
                </section>
            </div>
        ); 
}

export default Comments;
