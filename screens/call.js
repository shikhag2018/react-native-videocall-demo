import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';
import '../UserAgent';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';
import {connect} from 'react-redux'
import { withSocketContext } from './SocketContext';
  
class Call extends React.Component{
constructor(){
  super()
  this.state={
    stream:null,
  }


}

componentDidMount() { 
      this.call()
      const { socket } = this.props;
     socket.on('message', function(data){console.log(data)});

}

call=async(callerId)=>{
  const { socket } = this.props;
  const configuration = {"iceServers":[
    { urls: "stun:stun.l.google.com:19302"},
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'turn:numb.viagenie.ca', credential: 'shankarzkp@gmail.com', username: 'shikha@36' },
   ]};
  const pc = new RTCPeerConnection(configuration);
  
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();
      const facing = isFront ? 'front' : 'environment';
    const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
    const facingMode = isFront ? 'user' : 'environment';
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    pc.addStream(newStream);
    this.setState({stream:newStream})

    pc.onicecandidate = (event)=>{
  // send event.candidate to peer
      if (event.candidate) {
          socket.send({
          type:"candidate",
          target:this.props.callee,
          candidate: event.candidate
           }
          );
    }

   };

    pc.createOffer().then(desc => {
     pc.setLocalDescription(desc).then(() => {
       if(!!socket && !!this.props.callee && !!this.props.My_Data )
       { socket.send({
          type:"call_user",
          src:desc,
          name:this.props.callee,
          callername: this.props.My_Data.id

         })
   }
     })
  })

  

   socket.on('message',message=>{
        var data = message;
        console.log(data)
        switch(data.type)
        {
          case 'call_response':
             console.log("i m in call_response")
             try{
              const remoteDesc = new RTCSessionDescription(data.response);
                   pc.setRemoteDescription(remoteDesc);
                }catch(e)
                {
                    console.error('Error adding remote description', e);
                }
              break;
          case "candidate":
              if (data.candidate) {
                 try {
                       pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                    } catch (e) {
                        console.error('Error adding received ice candidate', e);
                    }
              }
            break;

        default:
            console.log(data)
          break;

        }
    })

 /*  socket.on('message', async message => {
     console.log(message)
    if (message.iceCandidate) {
        try {
            await pc.addIceCandidate(message.iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
  });
 */
pc.oniceconnectionstatechange = function(event){
       console.log(event)
    if (pc.connectionState === 'connected') {
        // Peers connected!
        console.log("peers connected")
    }
   };

}

render(){  
  return(
   <View style={styles.container}>
    <View style={styles.rtcview}>
       {!!this.state.stream && <RTCView style={styles.rtc} streamURL={this.state.stream.toURL()} />}
   </View>
    <View style={styles.rtcview}>
       {!!this.state.stream && <RTCView style={styles.rtc} streamURL={this.state.stream.toURL()} />}
   </View>
  </View>
);
}

}

const styles = StyleSheet.create({
 
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
   
  },
  rtcview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    width: '80%',
    backgroundColor: 'black',
    marginBottom:5
  },
  rtc: {
    width: '80%',
    height: '100%',
  },
 
});

const mapStateToProps=(state)=>{ 
  return {
    My_Data:state.my_data,
    callee:state.callee,
    
  }
 
}

export default connect(mapStateToProps)(withSocketContext(Call));