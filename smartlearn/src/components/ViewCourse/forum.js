
            import React, { useState, useEffect } from 'react';
            import jwt_decode from 'jwt-decode';
            import 'bootstrap/dist/css/bootstrap.min.css';
            import './forum.css';

            import ReplyIcon from '@mui/icons-material/Reply';
            import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
            import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';


            import DeleteConfirmationDialog from '../dialoguePopUp';

            import { useRef } from 'react';


            function Forum({ pactolusId }) {

              const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


              const [comments, setComments] = useState([]);
              const [newComment, setNewComment] = useState('');
              const [replyCommentId, setReplyCommentId] = useState('');

              const [repliedComment, setRepliedComment] = useState(null);

              const token = localStorage.getItem('token');
              const authenticated = token !== null;
              let id = '';
              let isAdmin = false;
         let userName="";

              if (authenticated) {
                const decodedToken = jwt_decode(token);
                id = decodedToken.user_id;
                isAdmin = decodedToken.isAdmin;
                userName=decodedToken.name;

              }


              const forumContainerRef = useRef(null);

              useEffect(() => {
                // Scroll to the bottom of the container
                if (forumContainerRef.current) {
                  forumContainerRef.current.scrollTop = forumContainerRef.current.scrollHeight;
                }
              }, [comments]);
              useEffect(() => {
                // Fetch comments when the component mounts
                fetchComments();
              }, []);

              const fetchComments = async () => {
                try {
                  const response = await fetch(`http://localhost:3001/api/forum/comments/${pactolusId}`);
                  if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                  }
                  const data = await response.json();
                  setComments(data);
                  console.log(data);
                } catch (error) {
                  console.error('Error fetching comments:', error);
                }
              };

              const addComment = async () => {
                try {
                  const response = await fetch('http://localhost:3001/api/forum/comments', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      pactolusId: pactolusId,
                      userId: id,

                      comment: newComment,

                      replyId: replyCommentId

                    }),
                  });
                  if (!response.ok) {
                    throw new Error('Failed to add comment');
                  }
                  setNewComment('');
                  setReplyCommentId('');
                  setRepliedComment('');
                  fetchComments();
                } catch (error) {
                  console.error('Error adding comment:', error);
                }
              };

              const deleteComment = async (commentId) => {
                setIsDeleteDialogOpen(false);
                try {
                  const response = await fetch(`http://localhost:3001/api/forum/comments/${commentId}`, {
                    method: 'DELETE',
                  });
                  if (!response.ok) {
                    throw new Error('Failed to delete comment');
                  }
                  fetchComments();
                } catch (error) {
                  console.error('Error deleting comment:', error);
                }
              };

              const handleReply = (commentId) => {
                const comment = comments.find((c) => c.id === commentId);
                setRepliedComment(comment);
                setReplyCommentId(commentId);

              };
              const formatDate = (dateString) => {
                const date = new Date(dateString);
                const options = {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                };
                return new Intl.DateTimeFormat(undefined, options).format(date);
              };

              const canDeleteComment = (commentUserId) => {
                return authenticated && (commentUserId === id || isAdmin);
              };


              const [deleteCommentId, setDeleteCommentId] = useState(null);
              return (
                <div className="ForumContainer" ref={forumContainerRef}>

                  <div className="comments-section">
                    <h2>Discussions ({comments.length})</h2>
                    {comments.map((comment, index) => (
                      <div className="comment" key={`${comment.id}-${index}`}>
  {comment.replyId && (
                          <div className="replied-comment">
                            <p className="small-font">{comment.replyComment.comment}</p>
                          </div>
                        )}
                        <div className="user-profile">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/727/727399.png?w=740&t=st=1685882562~exp=1685883162~hmac=1ee0166012bfe7fd53e6ffc67aa3ec19c1f76143100baceaa37a6b0376ce2956"
                            alt="Profile"
                            className="profile-picture"
                          />
                          {comment.user_role=="user"? (
                            <span className="comment-user text-primary fw-bold mb-0">{comment.user_name}</span>
                          ) : (
                            <span className="comment-admin text-primary fw-bold mb-0">{comment.user_name} (admin)</span>
                          )}
                                    <span className="reply_of_comment">{(comment.reply_comment)}</span>
                          <span className="comment-date"><QueryBuilderIcon/>{formatDate(comment.date_of_creation)}</span>


                          <div>


    </div>

                          {canDeleteComment(comment.user_id) && (
                            // <button className="delete-comment-button" >
                            //   delete
                            // </button>
                       <>

                         <span onClick={() => {setIsDeleteDialogOpen(true)  ; setDeleteCommentId(comment.id)}}><DeleteForeverIcon/></span>


                        </>


                          )}

                        </div>
                        <div className='comment-text'>{comment.comment}</div>
                       <span className="reply-comment-button"  onClick={() => handleReply(comment.id)}>     <ReplyIcon/>  Reply </span>

                        {/* <button className="reply-comment-button" onClick={() => handleReply(comment.id)}>

                        </button> */}


                      </div>

                    ))}
                  </div>

                  {authenticated && (
  <div className="add-a-comment">
    <img
      src="https://cdn-icons-png.flaticon.com/512/727/727399.png?w=740&t=st=1685882562~exp=1685883162~hmac=1ee0166012bfe7fd53e6ffc67aa3ec19c1f76143100baceaa37a6b0376ce2956"
      alt="Profile"
      className="profile-picture"
    />
    {isAdmin ? (
      <span className="comment-admin text-primary fw-bold mb-0">
        {userName} (admin)
      </span>
    ) : (
      <span className="comment-user text-primary fw-bold mb-0">{userName}</span>
    )}
    <span className="add-a-comment-text">Add a message</span>
    {repliedComment && (
      <div className="replied-comment">
      Reply to : ( {repliedComment.user_name } ) {repliedComment.comment}
      </div>
    )}
    <textarea
      className="textarea form-control"
      rows="4"
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    ></textarea>
    <button className="btn btn-primary send" onClick={addComment}>
    Send
    </button>
  </div>
)}

                  {/* {authenticated && (
                    <div className="add-comment-section">
                      <h2>Add a Comment</h2>
                      {repliedComment && (
                        <div className="replied-comment">
                          <p className="small-font">{repliedComment.comment}</p>
                        </div>
                      )}
                      <textarea
                        className="form-control"
                        rows="4"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      ></textarea>
                      <button className="btn btn-primary" onClick={addComment}>
                        Submit
                      </button>
                    </div>
                  )} */}
 {setIsDeleteDialogOpen&&(   <DeleteConfirmationDialog
  open={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
  onConfirm={() => deleteComment(deleteCommentId)}
/>
)

  /* }{
{setIsDeleteDialogOpen&&(
      <div className="dialog-box">
        <h2 className="dialog-title">Are you sure you want to delete this?</h2>
        <div className="dialog-actions">
          <button className="dialog-button cancel" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</button>
          <button className="dialog-button delete" onClick={() => deleteComment(deleteCommentId)}>Delete</button>
        </div>
      </div>
)
} */}
                </div>
              );
            }

            export default Forum;

