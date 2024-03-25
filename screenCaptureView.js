
import React, { useState } from 'react'
import { View, findNodeHandle, NativeModules, Button } from 'react-native'
import { mediaDevices, RTCView, ScreenCapturePickerView } from 'react-native-webrtc';



export default function ShareScreen() {
    const screenCaptureView = React.useRef(null);

    const startBroadcast = async () => {
        const reactTag = findNodeHandle(screenCaptureView.current);
        return NativeModules.ScreenCapturePickerViewManager.show(reactTag);
    }

    const updateStream = async () => {
        let vedioStream = await mediaDevices.getDisplayMedia();
        setVideoStream(vedioStream.toURL())
    };

    return (
        <View>
            <ScreenCapturePickerView ref={screenCaptureView} />
            <Button title = "startBroadcast" onPress={startBroadcast}/>
            <Button title = "start" onPress={updateStream}/>
        </View>)
}

