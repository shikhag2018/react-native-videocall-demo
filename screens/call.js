import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Dimensions
} from 'react-native';
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
import { Icon } from 'react-native-elements';
import {connect} from 'react-redux'
import InCallManager from 'react-native-incall-manager';
var localStream;

class Call extends React.Component{
constructor(){
  super()
   window.call = this;
  this.state={
    stream:null,
    remoteStream:null,
    connectedUser:null,
    IsMuted:false
  }
  

}

componentDidMount(){
    this.call()
 }


call=async()=>{
    const configuration = {"iceServers":[
    { urls: "stun:stun.l.google.com:19302"},
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'turn:numb.viagenie.ca', credential: 'shankarzkp@gmail.com', username: 'shikha@36' },
    ]};
    
    global.pc = new RTCPeerConnection(configuration);
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

    localStream = await mediaDevices.getUserMedia(constraints);
    
    
    global.pc.addStream(localStream)
    //console.log(global.pc)
    this.setState({stream:localStream})
    if(!!this.props.route.params &&this.props.route.params.data.type=="offer")
     { 
      window.home.callAccept(this.props.route.params)
     this.setState({ connectedUser:this.props.route.params.data.callername})
      }
    else
    {
      this.call_user()
    }

    global.pc.onaddstream=(event)=>{
      //console.log(event)
      this.setState({remoteStream: event.currentTarget._remoteStreams[0]});
     
    }
    global.pc.oniceconnectionstatechange =(event)=> {
      //console.log(event)
      //this.setState({remoteStream: event.currentTarget._remoteStreams[0]});
        };
        
 }



 call_user=()=>{
   InCallManager.start({media: 'video', ringback: '_BUNDLE_'});
   global.pc.onicecandidate = (event)=>{
  // send event.candidate to peer
      if (event.candidate) {
          global.socket.send({
          type:"candidate",
          target:this.props.callee,
          candidate: event.candidate
           }
          );
             }

   };
  
    global.pc.createOffer({ offerToReceiveAudio: 1,
        offerToReceiveVideo: 1}).then(desc => {
     global.pc.setLocalDescription(desc).then(() => {
       if(!!this.props.callee && !!this.props.My_id )
       { global.socket.send({
          type:"call_user",
          src:desc,
          name:this.props.callee,
          callername: this.props.My_id
     
         })
      this.setState({connectedUser:this.props.callee})
     }
     })
  })


 }


toggleMute = () => {
    localStream.getAudioTracks().forEach(track => {
      console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
      track.enabled = !track.enabled;
    this.setState({IsMuted:!track.enabled});
    });
  };

switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };


callDisconnect=()=>{
  
  global.socket.send({
    type:"leave",
    target:this.state.connectedUser,
    from:this.props.My_id
  })
  this.handleLeave()
  
}
 
handleLeave=()=>{
  console.log("in leave function")
  
  if (localStream != null) {
    localStream.getTracks().forEach(t => t.stop())
    localStream.release()
    localStream = null
    //this.setState({stream:null})
 }
 global.pc.close()
 window.home.setBusyFalse()
 this.props.navigation.navigate("Home") 
}

renderMic=()=>{
   if(this.state.IsMuted)
   {
     return (
         <Icon
        reverse
        name="mic-off"
        type="feather"
        color="red"
        onPress={()=>this.toggleMute()}
        />

      );
   }
   else
    {
      return(
         <Icon
        raised
        name="mic"
        type="feather"
        onPress={()=>this.toggleMute()}
        />

        );
    }

}




render(){  

  return(
   <View style={styles.container}>
  <View style={styles.rtcview}>
  {!!this.state.stream && <RTCView style={styles.rtc} streamURL={this.state.stream.toURL()} />}
   </View>
    <View style={styles.rtcview}> 
 {!!this.state.remoteStream && <RTCView style={styles.rtc} streamURL={this.state.remoteStream.toURL()} />}
    </View> 
   <View style={styles.bottom}>
     <View style={{flexDirection:'row'}}>
        {this.renderMic()}
       <Icon
        reverse
        name="call"
        type="zocial"
        color="red"
        onPress={()=>this.callDisconnect()}
        />
       <Icon
        raised
        name="switch-video"
        type="material-icons"
        onPress={()=>this.switchCamera()}
        />
      </View>
   </View>
  </View>
);
}

}

const styles = StyleSheet.create({
 
  container:{
    flex:1,
    //position:'relative'
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
  bottom:{
    justifyContent:"flex-end",
    marginBottom:14
  },
   localVideo: {
    width: 100,
    height: 100,
    position: 'absolute',
    right: 10,
    bottom: 60,
  },
   remoteVideo: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    margin: 0,
    padding: 0,
    aspectRatio: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    overflow: 'hidden',
    alignItems: 'center',
  },
 
});

const mapStateToProps=(state)=>{ 
  return {
    My_id:state.caller,
    callee:state.callee,
    
  }
 
}

export default connect(mapStateToProps)(Call);