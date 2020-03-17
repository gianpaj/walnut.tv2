import firebase from 'firebase/app';
import 'firebase/auth';

// The configuration below is not sensitive data. You can serenely add your config here
const config = {
  apiKey: 'AIzaSyA1-GsxvQht3kdP_b7fD9fNWEd2m4RdPu8',
  authDomain: 'ucutv-219215.firebaseapp.com',
  databaseURL: 'https://ucutv-219215.firebaseio.com',
  projectId: 'ucutv-219215',
  storageBucket: 'ucutv-219215.appspot.com',
  messagingSenderId: '467558405283',
  appId: '1:467558405283:web:69f44f22258fde52ccdb16',
};

firebase.initializeApp(config);
