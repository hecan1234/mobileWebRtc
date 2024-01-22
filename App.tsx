import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import notifee, { AndroidImportance } from '@notifee/react-native';


const App = () => {
  const [localStream, setLocalStream] = useState(null);

  notifee.registerForegroundService( notification => {
    return new Promise( () => {
    } );
  } );


  const getVideoStream = async () => {
    try {

      try {
        const channelId = await notifee.createChannel( {
          id: 'screen_capture',
          name: 'Screen Capture',
          lights: false,
          vibration: false,
          importance: AndroidImportance.DEFAULT
        } );
        
        await notifee.displayNotification( {
          title: 'Screen Capture',
          body: 'This notification will be here until you stop capturing.',
          android: {
            channelId,
            asForegroundService: true
          }
        } );

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

  useEffect(() => {
    getVideoStream();
  }, []);

  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView 
          streamURL={localStream.toURL()} 
          style={styles.video} 
        />
      )}
      <Button title="Refresh Stream" onPress={getVideoStream} />
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
