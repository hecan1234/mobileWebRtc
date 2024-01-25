import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { startScreenCapture, grantPermissions } from './index.js';

const App = () => {
  const [localStream, setLocalStream] = useState(null);

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
      
      const stream = await mediaDevices.getDisplayMedia();
      setLocalStream(stream);


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
      <Button title="Refresh Stream" onPress={async () => {
      // Call any other functions if needed, for example:
      // await getVideoStream(); // if getVideoStream is async

      // Now calling the async function from index.js
        const returnStream = await startScreenCapture();
        setLocalStream(returnStream);
      }} />
      <Button title="Grant Permissions" onPress={async () => {
      // Call any other functions if needed, for example:
      // await getVideoStream(); // if getVideoStream is async

      // Now calling the async function from index.js
        await grantPermissions();
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
});

export default App;
