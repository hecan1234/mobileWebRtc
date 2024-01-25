import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

AppRegistry.registerComponent('AwesomeProject', () => App);

let pc1Senders = [];
let localStream = null;
let remoteStream = null;


//Firebase garbage
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


notifee.registerForegroundService((notification) => {
  console.log('Notifee foreground service registered');
  return new Promise(() => {
    // Long running task...
  });
});


// helperFunctions.js
export const startScreenCapture = async () => {
  // Async logic here
  const channelId = await notifee.createChannel( {
    id: 'screen_capture',
    name: 'Screen Capture',
    lights: true,
    vibration: true,
  } );
  

  const localStream = await mediaDevices.getDisplayMedia();
  
  
  await notifee.displayNotification( {
    title: 'Screen Capture',
    body: 'This notification will be here until you stop capturing.',
    android: {
      channelId,
      asForegroundService: true
    }
  } );
  return localStream;
};

export const grantPermissions = async () => {
  await mediaDevices.getDisplayMedia();
};