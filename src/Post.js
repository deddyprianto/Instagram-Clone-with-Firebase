import React, { useState, useEffect } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import { MoreVert } from '@material-ui/icons'
import firebase from 'firebase'
import "./Post.css";
import { db } from "./firebase";
function Post({ postId, user, username, post, image }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db.collection("post").doc(postId).collection("comment").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()))
      })
    }
    return () => {
      unsubscribe();
    }
  }, [postId])

  const postComment = (e) => {
    e.preventDefault();
    db.collection("post").doc(postId).collection("comment").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setComment("");
  }
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar"></Avatar>
        <h4>{username}</h4>
        <div className="menu">
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <img src={image} alt="" className="post__image" />
      <h5 className="post__text">
        <strong>{username}</strong> {post}
      </h5>
      <div className="post__comments">
        {comments.map((data) => (
          <h5 className="post__text2">
            <strong>{data.username}</strong> {data.text}
          </h5>

        ))}
      </div>
      {user && (
        <form className="post__commentbox">
          <input type="text" className="post__input" placeholder="add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
          <button disabled={!comment} className="post__button" type="submit" onClick={postComment}>Post</button>
        </form>
      )}
    </div>
  );
}
export default Post;
