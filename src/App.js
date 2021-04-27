import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import { useState } from 'react';
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

    //Sign In State...
    const [user, setUser] = useState({
        isSignedIn: false,
        name: ' ',
        email: ' ',
        photo: ' '
    })

    //Sign In...
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const handleSignIn = () => {
        firebase.auth().signInWithPopup(googleProvider)
            .then(result => {
                const { displayName, email, photoURL } = result.user;
                const signedInUser = { isSignedIn: true, name: displayName, email: email, photo: photoURL };
                setUser(signedInUser);
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = error.credential;
                // ...
                console.log(errorCode, errorMessage, email, credential);
            });
    }




    //Sign Out...
    const handleSignOut = () => {
        firebase.auth().signOut()
            .then(() => {
                // Sign-out successful.
                const signOutUser = {
                    isSignedIn: false
                }
                setUser(signOutUser);
            }).catch((error) => {
                // An error happened.
            });
    }


    return (
        <div className="App">
            <h3>React Authentication </h3><hr />
            {
                user.isSignedIn ?
                    <button className="btn" onClick={handleSignOut}> Sign Out</button>
                    : <button className="btn" onClick={handleSignIn}> Sign In With Google</button>
            }
            {
                user.isSignedIn && <div>
                    <h3>WelCome :{user.name}</h3>
                    <p>Your Email :{user.email}</p>
                    <img src={user.photo} alt="Img" />
                </div>
            }

        </div>
    );
}

export default App;

