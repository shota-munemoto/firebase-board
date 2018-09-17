import * as firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
    apiKey: "AIzaSyBuVZvSQq-8QgUmzLwW7mBQe3MMXURzxdk",
    authDomain: "fir-test-f5fe6.firebaseapp.com",
    databaseURL: "https://fir-test-f5fe6.firebaseio.com",
    messagingSenderId: "759948665628",
    projectId: "fir-test-f5fe6",
    storageBucket: "fir-test-f5fe6.appspot.com",
})
firebase.firestore().settings({ timestampsInSnapshots: true })

export default firebase
