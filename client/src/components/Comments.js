import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllComments, createComment, deleteComment} from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import toast, { Toaster } from 'react-hot-toast';
import { formatSingleDate } from '../helpers/FormatDate';

function Comments(props) {
  const { curUser, event } = props;
  const [allUsers, setAllUsers] = useState([])
  const [commentText, setCommentText] = useState("");
  const [commentSection, setCommentSection] = useState(null);

  useEffect(() => {
    getAllUsers().then((res) => {
      setAllUsers(res.data.data);
    }); 
    getAllComments(event._id).then((res) => {
      if (res.data.data.length && res.data.data.length > 0) {
        setCommentSection(res.data.data[0])
      }
    });
  }, [event]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    createComment(event._id, commentSection._id, curUser._id, commentText).then((res) => {
      if (res.status === 201) {
        setCommentSection(res.data.data);
        setCommentText('');
      } else {
        toast.error('Error posting comment. Please try again later.');   
      }
    });
  };

  const handleDelete = (comment) => {
    deleteComment(commentSection._id, comment._id, curUser._id).then((res) => {
      if (res.status === 200) {
        if (res.data.data && res.data.data.length > 0 ) {
          let newComments = commentSection.comments;
          newComments = newComments.filter(c => c._id !== res.data.data[0]._id);
          setCommentSection({...commentSection, comments: newComments});
        }
      }
    });
  };
            
  return (
    <div className='mt-4'>
      <Toaster />
      <p className='font-bold text-slate-700 m-2'>Comments ({commentSection ? commentSection.comments.length : 0})</p>
      <div className='m-2 bg-white bg-opacity-50 rounded-md shadow-md flex items-center justify-center'>
        {(curUser.attending.includes(event._id) || curUser.organizing.includes(event._id)) ? 
          <div className="w-full p-4">
            { commentSection ? 
            commentSection.comments.map((comment) => (
              <div className="relative mb-2" key={comment._id}>
                <div className="flex flex-row items-center">
                    <a href={`/profile/${allUsers && allUsers.find(user => user._id === comment.sender) ? allUsers.find(user => user._id === comment.sender)._id : ""}`}>
                      <p className="mr-3 text-md text-gray-900 font-bold">{allUsers && allUsers.find(user => user._id === comment.sender) ? allUsers.find(user => user._id === comment.sender).name : ""}</p>
                    </a>
                    <p className="text-sm text-gray-600">
                      {comment.createdAt ? formatSingleDate(new Date(comment.createdAt)) : "Just now"}
                    </p>
                    <div className="absolute right-0">
                      {comment.sender === curUser._id ?  
                        <FontAwesomeIcon onClick={() => handleDelete(comment)} icon={solid('trash')} className="px-1" />                  
                      : <></>}
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{comment ? comment.message : ""}</p>
              </div>
            )) : <></>
            }
            <form className="w-full flex flex-row space-x-2" onSubmit={handlePostComment}>
                <textarea id="comment" rows="1"
                  className="bg-white rounded-l border border-gray-200 px-2 w-full text-sm text-gray-900 focus:ring-0 focus:outline-none"
                  placeholder="Write a comment..." value={commentText} required onChange={(e) => setCommentText(e.target.value)}>
                </textarea>
              <button type="submit"
                className="inline-flex items-center px-4 text-center text-white bg-blue-500 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800">
                <FontAwesomeIcon icon={solid('arrow-right')} />
              </button>
            </form>
          </div>
        :
          <div className="mx-auto py-6 flex items-center text-center justify-center w-full">
            <h2 className="text-lg font-bold text-gray-900">RSVP to view and post comments!</h2>
          </div>
        }
     </div>
    </div>
  ); 
}

export default Comments;
