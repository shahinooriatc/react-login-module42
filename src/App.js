import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import { useState } from 'react';
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
	//New User Registration...
	const [newUser, setNewUser] = useState(false);
	//Sign In State...
	const [user, setUser] = useState({
		isSignedIn: false,
		displayName: '',
		age: '',
		email: ' ',
		password: '',
		photo: ' ',
		successful: false,
		error: ' '
	})

	//Sign In...With Google...
	const googleProvider = new firebase.auth.GoogleAuthProvider();
	const handleGoogleSignIn = () => {
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
				console.log(errorCode, errorMessage, email, credential);
			});
	}

	//Sign In with Facebook...
	const fbProvider = new firebase.auth.FacebookAuthProvider();
	const handleFbSignIn = () => {
		firebase
			.auth()
			.signInWithPopup(fbProvider)
			.then(result => {
				console.log(result.user);
				const { displayName, email, photoURL } = result.user;
				const signedInUser = { isSignedIn: true, name: displayName, email: email, photo: photoURL };
				setUser(signedInUser);
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.email;
				const credential = error.credential;
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

	//User Registration Input Fields...
	const handleBlur = (event) => {
		// Define Parameter isFormValid Boolean...
		let isFormValid = true;

		if (event.target.name === 'email') {
			const isFormValid = /^[^\s@]+@[^\s@]+$/.test(event.target.value);
		}
		if (event.target.name === 'password') {
			const isFormValid = /^[A-Za-z]\w{7,14}$/.test(event.target.value);
		}

		if (isFormValid) {
			// Ager value state theke copy kore newUserInfo te store koreche...
			const newUserInfo = { ...user };
			//ekhon newUserInfo variable ee new Value add korbo...
			newUserInfo[event.target.name] = event.target.value;
			// newUserInfo er updated value gulo setUser State ee store korlam...
			setUser(newUserInfo);
		}

	}

	//User Field Submit form...
	const handleSubmitForm = (event) => {
		//If newUser check box checked... newUser true...then create newUser in firebase...
		if (newUser && user.email && user.password) {
			//Create new user with email & password...
			firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
				.then(result => {
					const newUserInfo = { ...user }
					newUserInfo.error = '';
					newUserInfo.successful = true;
					setUser(newUserInfo);
					updateUserInfo(user.name);
					console.log(user);
				})
				.catch(error => {
					const newUserInfo = { ...user }
					newUserInfo.error = error.message;
					newUserInfo.successful = false;
					setUser(newUserInfo);
				});
		}

		//If newUser check box unChecked... newUser false...then signIn with email & pass in firebase...
		if (!newUser && user.email && user.password) {
			//Sign In With User email & Password...
			firebase.auth().signInWithEmailAndPassword(user.email, user.password)
				.then(result => {
					const user = result.user;
					const newUserInfo = { ...user }
					newUserInfo.error = '';
					newUserInfo.successful = true;
					setUser(newUserInfo);
				})
				.catch(error => {
					const newUserInfo = { ...user }
					newUserInfo.error = error.message;
					newUserInfo.successful = false;
					setUser(newUserInfo);
				});
		}
		// Stop browser auto load ...
		event.preventDefault();
	}

	//UpDate User Information...
	const updateUserInfo = name => {
		const user = firebase.auth().currentUser;
		user.updateProfile({
			displayName: name,

		})
			.then(result => {
				// Update successful.
				console.log('user info updated ');
			})
			.catch(error => {
				// An error happened.
			});
	}
	return (
		<div className="App container">
			<h3>React Authentication </h3><hr />

			<div className="signIn">
				{
					user.isSignedIn ?
						<button className="btn btn-warning" onClick={handleSignOut}> Sign Out</button>
						: <button className="btn btn-danger" onClick={handleGoogleSignIn}> SignIn With Google</button>
				}
				<br /><br />
				{
					user.isSignedIn ? <span></span> : <button className='btn btn-primary ' onClick={handleFbSignIn}>SignIn with Facebook</button>
				}
				{/* /After Sign In with Google Provider... */}
				{
					user.isSignedIn && <div>
						<h3>WelCome :{user.name}</h3>
						<p>Your Email :{user.email}</p>
						<img src={user.photo} alt="Img" />
					</div>
				}
			</div>

			{/* /Sign in & Sign out form */}
			<div className="full-form">
				<h2> <span style={{ color: 'green' }}>{user.displayName} </span> Authentication Page</h2>

				<form className='' action="" onSubmit={handleSubmitForm}><br />

					<input type="checkbox" name="newUser" onClick={() => setNewUser(!newUser)} />
					<label htmlFor="newUser">Create New User</label>

					{
						newUser && <div className="newUser">
							<input className='form-control' type="text" name="name" onBlur={handleBlur} placeholder='Enter Name' /><br />
							<input className='form-control' type="number" name="age" onBlur={handleBlur} placeholder='Enter Your Age' /><br />
						</div>
					}
					<input className='form-control' type="email" name="email" onBlur={handleBlur} placeholder='Enter Email' required /><br />
					<input className='form-control' type="password" name="password" onBlur={handleBlur} placeholder='Enter Password' required /><br />
					<input className='form-control btn btn-info ' type="submit" value={newUser ? 'Sign Up' : 'Sign in'} />
				</form>
				<hr />
				{/* /error message handling... */}
				<p style={{ color: 'red' }}>{user.error}</p>
				{/* /Successful message handling... */}
				{
					user.successful && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In'} successfully</p>
				}
			</div>


		</div>
	);
}

export default App;

