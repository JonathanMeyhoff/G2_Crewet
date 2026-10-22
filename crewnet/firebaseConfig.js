// firebaseConfig.js forbinder appen til  Firebase-projekt. Kaldes kun en gang og alle andre henter filer fra databasen herfra.

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

//Mine personlige værdier fra firebase configs
const firebaseConfig = {
    apiKey: "AIzaSyDN5spYJjbq08TQlH82yj6RjQYPo_BHUAw",
    authDomain: "crewnet-382b4.firebaseapp.com",
    databaseURL: "https://crewnet-382b4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "crewnet-382b4",
    storageBucket: "crewnet-382b4.firebasestorage.app",
    messagingSenderId: "16361234027",
    appId: "1:16361234027:web:ffa3dca6e8f08887fbdb2e"
};

//Expo genstarter filen når man gemmer 
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getDatabase(app); // getDatabase henter live data i firebase databasen. Det er herfra resten af appen henter live data.
