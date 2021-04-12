import Rebase from 're-base';
import firebase from 'firebase'

var firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyDybgWaRFRU-BzRXCE9Mne5WLyEvyMxSh8",
    authDomain: "shiggins-self-learning.firebaseapp.com",
    databaseURL: "https://shiggins-self-learning-default-rtdb.firebaseio.com"
  });


const base = Rebase.createClass(firebaseConfig.database());

// this is a named export
export { firebaseConfig };

export default base;