import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'dotenv/config'

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
//https://login-53f05.firebaseapp.com/__/auth/handler
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Thiết lập persistence cho Firebase Auth
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('Đã thiết lập persistence thành công');
  })
  .catch((error) => {
    console.error('Lỗi khi thiết lập persistence:', error);
  });

// Cấu hình cho Google Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Cấu hình cho Facebook Provider
const fbProvider = new firebase.auth.FacebookAuthProvider();
fbProvider.addScope('public_profile');
fbProvider.addScope('email');

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
  // Comment lại để sử dụng Firebase thật
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('localhost', '8080');
}

// Bật gỡ lỗi Firebase
if (process.env.NODE_ENV === 'development') {
  window.firebase = firebase;
}

export { db, auth, googleProvider, fbProvider };
export default firebase;
