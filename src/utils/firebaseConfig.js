import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBBPD-xq-OaeEcO0E7Hl90TrGWTzw6aUiE",
    authDomain: "nyous-d8536.firebaseapp.com",
    projectId: "nyous-d8536",
    storageBucket: "nyous-d8536.appspot.com",
    messagingSenderId: "421767821313",
    appId: "1:421767821313:web:a325cb3e8894d28533e800"
  };

const app  = firebase.initializeApp(firebaseConfig);

export const db = app.firestore()

  export default firebaseConfig;