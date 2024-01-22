import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { View, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    mediaDevices,
  } from 'react-native-webrtc';



const firebaseConfig = {

  apiKey: "AIzaSyDTov-4lD7C90jMteYNe68efo50aD4CmnA",

  authDomain: "unitywebrtc-897f0.firebaseapp.com",

  projectId: "unitywebrtc-897f0",

  storageBucket: "unitywebrtc-897f0.appspot.com",

  messagingSenderId: "387695409681",

  appId: "1:387695409681:web:6a6d33c26f9616e8734fb0",

  measurementId: "G-L30KMYE64Q"

};

const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  };


AppRegistry.registerComponent(appName, () => App);


const pc = new RTCPeerConnection(servers);
let pc1Senders = [];
let localStream = null;
let remoteStream = null;

// helperFunctions.js
export const externalFunction = async () => {
    console.log('External function called!');
    //Alert.alert('External Function', 'This is from an external file!');
    localStream = await mediaDevices.getUserMedia({ video: true });
    console.log('External function calleddfdfd!');
        // console.log('start');
        // if (!stream) {
        //   let s;
        //   try {
        //     s = await mediaDevices.getUserMedia({ video: true });
        //     setStream(s);
        //   } catch(e) {
        //     console.error(e);
        //   }
        // }
    
  };
  