import React, { useState, useEffect } from "react";
import { makeStyles, Modal, Button, Input } from '@material-ui/core'
import InstagramEmbed from 'react-instagram-embed'
import "./App.css";
import { db, auth } from "./firebase";
import Post from "./Post";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50
  const left = 50
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}% )`,
  }
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle())
  const [post, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [opensignin, setOpensignin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    db.collection("post").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setPost(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  // for checking user exist or not-exist
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // user has been loggin
        setUser(authUser)
      } else {
        // user not loggin
        setUser(null)
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])


  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      });
    }).catch((error) => alert(error.message))
    setOpen(false)
  }
  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message))
    setOpensignin(false)
  }
  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
            </center>
            <Input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}></Input>
            <Input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
            <Button onClick={signUp}>Sign Up</Button>

          </form>
        </div>
      </Modal>

      <Modal open={opensignin} onClose={() => setOpensignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
            </center>
            <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            <Input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>


      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
        {user ? <Button onClick={() => auth.signOut()}>LogOut</Button> :
          <div className="">
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpensignin(true)}>Sign In</Button>
          </div>
        }
      </div>
      <div className="app__post">
        <div className="app__postLeft">
          {post.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              post={post.post}
              image={post.image}
            ></Post>
          ))}
        </div>
        <div className="app__postRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CAaQAL-FToW'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>
      {user?.displayName ? (<ImageUpload username={user.displayName} />) : ("You have been login know")}
    </div>
  );
}

export default App;
