import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { 
mediaDevices, 
RTCView,
RTCPeerConnection,
RTCIceCandidate,
RTCSessionDescription
} 
from 'react-native-webrtc';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

import firebase from 'firebase/app';
import firestore from '@react-native-firebase/firestore';


AppRegistry.registerComponent('AwesomeProject', () => App);



const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};


const pc = new RTCPeerConnection(servers);
let pc1Senders = [];
let localStream = null;

var sender;

notifee.registerForegroundService((notification) => {
  console.log('Notifee foreground service registered');
  return new Promise(() => {
    // Long running task...
  });
});

export const startScreenCapture = async () => {
  // Async logic here
  const channelId = await notifee.createChannel( {
    id: 'screen_capture',
    name: 'Screen Capture',
    lights: true,
    vibration: true,
  } );
  

  localStream = await mediaDevices.getDisplayMedia();
  
  
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

export const createCall = async () => {
  console.log(localStream)
  localStream.getTracks().forEach((track) => {
    console.log("Add 1 track to stream");


    //experimental STuff need to delete later
    let sender = pc.addTrack(track, localStream);
    pc1Senders.push(sender)


    console.log("We have added our track to the local stream")
  });
};

export const offerCreation = async () => {
  let customId;
  let exists;

  do {
    
    customId = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    const docRef = firestore().collection('calls').doc(customId.toString());
    const doc = await docRef.get();
    exists = doc.exists;
  } while (exists);

  const callDoc = firestore().collection('calls').doc(customId.toString());
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  pc.onicecandidate = (event) => {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };

  const offerDescription = await pc.createOffer();

  await pc.setLocalDescription(offerDescription);
  console.log("PC1 finish setting local");

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };
  console.log(callDoc.id)
  await callDoc.set({ offer });

  callDoc.onSnapshot((snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {

      const answerDescription = new RTCSessionDescription(data.answer);
      
      pc.setRemoteDescription(answerDescription);
      console.log("pc1 set remote Desc")
    }
  });

  answerCandidates.onSnapshot((snapshot) => {
    console.log("Ice candidot response")
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
        console.log("HERE")
        const params = sender.getParameters();
        console.log(params)
        if (!params.codecs.length) {
            console.log("No codec information available");
            return;
        }
      
      }
    });
  });


};