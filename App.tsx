import React, { useState, useEffect, useContext } from 'react';
import { View, Button, StyleSheet, Text,findNodeHandle, NativeModules } from 'react-native';
import { mediaDevices, RTCView, ScreenCapturePickerView } from 'react-native-webrtc';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { startScreenCapture, closePC, offerCreation, createCall, callDocId,offerCreationNoAddTrack, useCustomId , generateFinalRoomAnswer } from './index.js';
import ShareScreen from './index.js';
import { startBroadcastOutSide} from './index.js'

export default function App() {
  const [localStream, setLocalStream] = useState(null);
  const { customId, setCustomId } = useCustomId();
  const screenCaptureView = React.useRef(null);

  const startBroadcast = async () => {
      const reactTag = findNodeHandle(screenCaptureView.current);
      return NativeModules.ScreenCapturePickerViewManager.show(reactTag);
  }

  const handlePress = () => {
    console.log("HER0");
    generateFinalRoomAnswer(setCustomId); // Pass `setCustomId` to the async function
  };
  const getVideoStream = async () => {
  
    try {

      try {
        console.log("woah")
        notifee.registerForegroundService((notification) => {
          return new Promise(() => {
            // Long running task...
          });
        });

        const channelId = await notifee.createChannel( {
          id: 'screen_capture',
          name: 'Screen Capture',
          lights: false,
          vibration: false,
          
        } );
        
        await notifee.displayNotification( {
          title: 'Screen Capture',
          body: 'This notification will be here until you stop capturing.',
          android: {
            channelId,
            asForegroundService: true
          }
        } );

        // Create a channel (required for Android)
        // const channelId = await notifee.createChannel({
        //   id: 'default',
        //   name: 'Default Channel',
        // });

        // // Display a notification
        // await notifee.displayNotification({
        //   title: 'Notification Title',
        //   body: 'Main body content of the notification',
        //   android: {
        //     channelId,
        //     smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        //     // pressAction is needed if you want the notification to open the app when pressed
        //     asForegroundService: true
        //   },
        // });

        console.log('Hi there');
      } catch( err ) {
        console.error('oopse');
      };
      

    } catch (e) {
      console.error('Error getting video stream:', e);
    }
  };

  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView 
          streamURL={localStream.toURL()} 
          style={styles.video} 
        />
      )}
      <ScreenCapturePickerView ref={screenCaptureView} />

      <Text style={styles.textStyle}>Custom ID: {customId || 'Not set'}</Text>
            
      <Button title="Start BroadCast" onPress={async () => {
        await startBroadcast()
      }} />


      <Button title="Refresh Stream" onPress={async () => {
      // Call any other functions if needed, for example:
      // await getVideoStream(); // if getVideoStream is async

      // Now calling the async function from index.js
        
        const returnStream = await startScreenCapture(screenCaptureView.current);
        console.log("In button");
        console.log(returnStream)
        setLocalStream(returnStream);
      }} />
      
      <Button title="Generate Room ID" onPress={handlePress} />

      <Button title="Create Room" onPress={async () => {
      // Call any other functions if needed, for example:
      // await getVideoStream(); // if getVideoStream is async

      // Now calling the async function from index.js
        await offerCreationNoAddTrack();
        // setLocalStream(returnStream);
      }} />


    <Button title="temp" onPress={async () => {
      // Call any other functions if needed, for example:
      // await getVideoStream(); // if getVideoStream is async

      // Now calling the async function from index.js
        await startBroadcastOutSide();
        // setLocalStream(returnStream);
      }} />
      <Button title="close Stream" onPress={async () => {
      // Call any other functions if needed, for example:
      // await getVideoStream(); // if getVideoStream is async

      // Now calling the async function from index.js
        const returnStream = await closePC();
        setLocalStream(returnStream);
        setCustomId(0);
        // setLocalStream(returnStream);
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  video: {
    width: 300, // Set the width and height as needed
    height: 300,
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'black', // This sets the text color to black
    fontSize: 16, // Optional: setting the font size
    // Add other text styling properties as needed
  },
});

export default App;
