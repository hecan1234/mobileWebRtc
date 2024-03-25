import {AppRegistry, NativeModules, findNodeHandle} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ReactDOM from 'react-dom';
import { 
mediaDevices, 
RTCView,
RTCPeerConnection,
RTCIceCandidate,
RTCSessionDescription,
ScreenCapturePickerView
} 
from 'react-native-webrtc';

import firebase from 'firebase/app';
import firestore from '@react-native-firebase/firestore';


AppRegistry.registerComponent('AwesomeProject', () => App);


// Create a context with a default value
const CustomIdContext = createContext({
  customId: null,
  setCustomId: () => {},
});

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

let globalRoomNum = 0;

let pc;
let pc1Senders = [];
let localStream = null;


export const closePC = async () => {
  pc1Senders = [];
  localStream = null;

  console.log("HI THERE")
  pc.close();
  return localStream;
};

export const generateFinalRoomAnswer = async (setCustomIdCallback) => {
  console.log("HI THERE")
  let customId;
  do {
    customId = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    const docRef = firestore().collection('calls').doc(customId.toString());
    const doc = await docRef.get();
    exists = doc.exists;
  } while (exists);
  
  // Use the passed callback to update the customId in context
  setCustomIdCallback(customId);
  globalRoomNum = customId
  console.log("HI THERE2")
};

export const startScreenCapture = async () => {

  pc = new RTCPeerConnection(servers);
    
  
  console.log("HI");
  localStream = await mediaDevices.getDisplayMedia({ video: true, audio: true });
  //localStream = await mediaDevices.getUserMedia( mediaConstraints );
  
  console.log(localStream);
 



  console.log(localStream);
  console.log("AM HERE");
  await offerCreation()
  return localStream;

  
};

export const grantPermissions = async () => {
  await mediaDevices.getDisplayMedia();
};

export const createCall = async () => {
  //captureStream = await mediaDevices.getDisplayMedia();
  console.log(localStream)
  localStream.getTracks().forEach((track) => {
    console.log("Add 1 track to stream");


    //experimental STuff need to delete later
    let sender = pc.addTrack(track, localStream);
    pc1Senders.push(sender)


    console.log("We have added our track to the local stream")
  });
};

export const offerCreationNoAddTrack = async () => {
  console.log(globalRoomNum)  
  let customId;
  let exists;

  do {
    
    customId = globalRoomNum
    const docRef = firestore().collection('calls').doc(customId.toString());
    const doc = await docRef.get();
    exists = doc.exists;
  } while (exists);

  console.log("REACHED!")  

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
      }
    });
  });
};


export const offerCreation = async () => {
  let customId;
  let exists;
  console.log(localStream)
  localStream.getTracks().forEach((track) => {
    console.log("Add 1 track to stream");


    //experimental STuff need to delete later
    let sender = pc.addTrack(track, localStream);
    pc1Senders.push(sender)


    console.log("We have added our track to the local stream")
  });

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
        // const params = sender.getParameters();
        // console.log(params)
        // if (!params.codecs.length) {
        //     console.log("No codec information available");
        //     return;
        // }
      
      }
    });
  });


};

//export const createCall = async () => 


export const startBroadcastOutSide = async () => {
  const screenCaptureView = React.useRef(null);
  const reactTag = findNodeHandle(screenCaptureView.current);
  return NativeModules.ScreenCapturePickerViewManager.show(reactTag);
}

export default function ShareScreen() {
  const screenCaptureView = React.useRef(null);



  const updateStream = async () => {
    let mediaConstraints = {
      audio: true,
      video: {
        frameRate: 30,
        facingMode: 'user'
      }
    };  
    pc = new RTCPeerConnection(servers);
    
  
    console.log("HI");
    localStream = await mediaDevices.getDisplayMedia({ video: true, audio: true });
    //localStream = await mediaDevices.getUserMedia( mediaConstraints );
  
    console.log(localStream);
    console.log("AM HERE");
    //await offerCreation()
  };

  return (
      <View>
          <ScreenCapturePickerView ref={screenCaptureView} />
          <Button title = "startBroadcast" onPress={startBroadcast}/>
          <Button title = "start" onPress={updateStream}/>
      </View>)
}

export const CustomIdProvider = ({ children }) => {
  const [customId, setCustomId] = useState(null);

  return (
    <CustomIdContext.Provider value={{ customId, setCustomId }}>
      {children}
    </CustomIdContext.Provider>
  );
};

const AppRoot = () => (
  <CustomIdProvider>
    <App />
  </CustomIdProvider>
);

export const useCustomId = () => useContext(CustomIdContext);

AppRegistry.registerComponent(appName, () => AppRoot);