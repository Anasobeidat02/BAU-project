import './App.css';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Google Sign-In Button Component with CLIENT_ID and callback
function GoogleSignInButton({ onSignIn }) {
  const CLIENT_ID = '374095984660-uqh9pfqkcq3emmt07l7adep40iha26il.apps.googleusercontent.com'; // Given CLIENT_ID
  
  useEffect(() => {
    if (window.google) {
      // Initialize Google Sign-In with CLIENT_ID and callback
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: onSignIn,
      });

      // Render Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, [onSignIn]); // Ensure useEffect re-runs if callback changes

  return <div id="google-signin-button"></div>; // Google Sign-In button placeholder
}

// Callback function to process Google Sign-In response
function loginCallback(response, setNewUser, setLoggedInUser) {
  console.log('Google Sign-In response:', response);
  
  const idToken = response.credential;
  if (idToken) {
    try {
      const decodedToken = jwtDecode(idToken); // Decode the JWT
      console.log('Decoded JWT:', decodedToken);

      // Fill in the default fields
      const user = {
        name: decodedToken.name,
        email: decodedToken.email,
      };
      
      setNewUser((prevUser) => ({ ...prevUser, ...user })); // Update newUser with Google data
      setLoggedInUser(user); // Store logged-in user's data
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }
}

function logOut() {
  window.google.accounts.id.revoke("anasmobeidat86@gmail.com", () => {
    console.log('User logged out');
    window.location.reload(); // Reload after logout
  });
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
  });

  const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in user's data

  useEffect(() => {
    Axios.get('http://localhost:5000/users').then((res) => {
      setUsers(res.data);
    });
  }, []);

  const createUser = () => {
    Axios.post('http://localhost:5000/createUser', newUser).then((res) => {
      console.log('User created:', res.data);
    }).catch((error) => {
      console.error('Error creating user:', error);
    });
  };

  const updateNewUser = (field, value) => {
    setNewUser({
      ...newUser,
      [field]: value,
    });
  };

  return (
    <>
      {/* Google Sign-In with loginCallback */}
      <GoogleSignInButton onSignIn={(response) => loginCallback(response, setNewUser, setLoggedInUser)} />

      {/* Displaying logged-in user information */}
      {loggedInUser && (
        <div className="card">
          <ul>
            <li>Name: {loggedInUser.name}</li>
            <li>Email: {loggedInUser.email}</li>
          </ul>
        </div>
      )}

      {/* Form to create a new user with pre-filled data */}
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name} // Pre-filled with data from Google
          onChange={(e) => updateNewUser('name', e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          onChange={(e) => updateNewUser('age', e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={newUser.email} // Pre-filled with data from Google
          onChange={(e) => updateNewUser('email', e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => updateNewUser('password', e.target.value)}
        />
        <button onClick={createUser}>Create User</button>
        <button onClick={logOut}>Logout</button> {/* Log out button */}
      </div>
      
      {/* Displaying existing users */}
      {users.map((user, index) => (
        <div className="card" key={index}>
          <ul>
            <li>Name: {user.name}</li>
            <li>Age: {user.age}</li>
            <li>Email: {user.email}</li>
          </ul>
        </div>
      ))}
    </>
  );
}
