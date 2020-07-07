import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  List,
  FlatList, 
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { SearchBar,ListItem,Icon,Input } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux'
import IncomingCall from 'react-native-incoming-call';
import InCallManager from 'react-native-incall-manager';
import io from "socket.io-client/dist/socket.io.js"
import '../UserAgent';
import Modal from 'react-native-modal';
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

import RNCallKeep from 'react-native-callkeep';

/*const options = {
  ios: {
    appName: 'My app name',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
    //additionalPermissions: [PermissionsAndroid.PERMISSIONS.example]
  }
};

RNCallKeep.setup(options).then(accepted => {console.log(accepted)});
*/


const db =firestore().collection('users');
class Home extends React.Component{
constructor(){
  super()
  window.home = this;
 this.state = {
    search: '',
    loading:false,
    contacts:[],
    busy:false,
    id:'',
    IceCandidates:[],
    isModalVisible:false,
    value:'',
    error:'',
  };
 

}

componentDidMount(){
 global.socket= io("https://dd179b311bfe.ngrok.io",{jsonp: false,forceNode:true}) // use your own ngrok tunnel or replace with your router Ip 
   global.socket.on('connect', function(data) {
             console.log('connected');
               });
   this.authUnsubscriber = firebase.auth().onAuthStateChanged((userobj) => {
       
       if(userobj)
        {  try{
            db.doc(userobj.uid).onSnapshot((doc)=>
            { this.setState({contacts:doc.data().contacts})
              this.props.Caller(doc.data().id)
             this.setState({id:doc.data().id})
             global.socket.send({
                     type: "login",
                     name: doc.data().id
                 })
            })   
           }
           catch(e)
           {
              console.log(e)
             }
           }

    })

    global.socket.on('message', (message)=>{
            var data = message;
             switch(data.type) {
                case "login":
                    this.onLogin(data)
                    break;
                case "offer":
                     console.log("getting called");
                     this.onAnswer(data);
                    break;
              case "candidate":
                   if (data.candidate) {
                    try {
                      //console.log(data.candidate)
                      this.setState({IceCandidates:[...this.state.IceCandidates,data.candidate]})

                    } catch (e) {
                        console.log('Error adding received ice candidate', e);
                    }
                   }
                   break;
              case "call_response":
                    this.onResponse(data)
                    break;

              case "leave":
                   window.call.handleLeave()
                default:
                    break;
            }

              })


  }
 

onLogin(data){
             
             if (data.success === false) {
                    alert("oops...try a different username");
             } else {
                 var username = data.username;
                 console.log("Login Successfull");
                 console.log("logged in as :"+username);
                 console.log(data.userlist);
             }
        }


onResponse=(data)=>{
                switch(data.response){
                    case "accepted":
                    InCallManager.stopRingback();
                    InCallManager.start();
                    var incallwith = data.responsefrom;
                    console.log("Call accepted by :"+ data.responsefrom);
                    if (data.answer) {
                    try{
                     const remoteDesc = new RTCSessionDescription(data.answer);
                      global.pc.setRemoteDescription(remoteDesc).then(()=>{
                        console.log(this.state.IceCandidates)
                      this.state.IceCandidates.map(candidate=>global.pc.addIceCandidate(new RTCIceCandidate(candidate)))

                      })
                    
                    
                     }catch(e)
                    {
                    console.error('Error adding remote description', e);
                      }                   
                    }
                    
                    break;
                    case "rejected":
                    console.log("Call rejected by :"+ data.responsefrom);
                    this.setState({busy:false})
                    incallwith = ""
                    break;
                    case "busy":
                    console.log(data.responsefrom+" call busy");
                    this.setState({busy:false})
                    incallwith = ""
                    break;

                    default:
                    console.log(data.responsefrom+" is offline");
                    this.setState({busy:false})
                    incallwith = ""
                }
 
            }

 onAnswer=(data)=>{

      //IncomingCall.display(data.callername, "NA",'https://avatars3.githubusercontent.com/u/16166195');

        if(this.state.busy == false){
           this.setState({busy:true})
         InCallManager.startRingtone('_BUNDLE_');
        Alert.alert(
         'Hey There!',
         data.callername+" is calling you",
         [
        {text: 'accept', onPress: () =>{
          this.props.navigation.navigate("Call",{data:data})
          }
        },
        {text: 'reject', onPress: () =>this.callReject(data)},
          ],
              { 
        cancelable: false
               }
            );
            
            
             }
             else{
                 console.log("call busy");
                 global.socket.send({
                        type: "call_busy",
                        callername: data.callername,
                        from:this.state.id 
                 })
 
             }
        
}

callAccept=async(data)=>{
     console.log("call accepted");
     //console.log(data.data.offer)
     InCallManager.stopRingtone();
     InCallManager.start();
       if (data.data.offer) {
      global.pc.setRemoteDescription(new RTCSessionDescription(data.data.offer)).then(()=>
         {
        this.state.IceCandidates.map(candidate=>global.pc.addIceCandidate(new RTCIceCandidate(candidate)))

         global.pc.onicecandidate =(event)=> { 

                if (event.candidate) { 
                 global.socket.send({ 
                 type: "candidate",
                 target:data.data.callername ,
                 candidate: event.candidate 
                }); 
               } 
             }

       })}   

       const answer =await  global.pc.createAnswer();
             await global.pc.setLocalDescription(answer);
              global.socket.send({
                 type:"answer",
                 callername:data.data.callername,
                 answer:answer,
                 from:this.state.id
             });  

}



callReject=(data)=>{
  this.setState({busy:false})
  InCallManager.stopRingtone();
  InCallManager.stop();
   global.socket.send({
                 type:"call_rejected",
                 callername: data.callername,
                 from:this.state.id
             });
}

setBusyFalse=()=>{
   this.setState({busy:false})
}


searchId = search => {
    this.setState({loading:true})
    this.setState({ search });
  };

validate=()=>{
  if(this.state.value=='')
  {
   this.setState({error:"please enter valid id"})
 }
 else
 {
  this.props.Call_To_Id(this.state.value)
  this.setState({isModalVisible:false,error:''})
  this.props.navigation.navigate("Call")
 }
}

render(){
   //console.log(this.state.Id) 
   const { search } = this.state;

  return(
      <View style={styles.container}>
      
      <SearchBar
        placeholder="Type Here..."
        lightTheme        
        round 
        onChangeText={(text)=>this.searchId(text)}
        value={search}
      />

    <View >
  
      { !! this.state.contacts &&
         this.state.contacts.map((l, i) => (
            <ListItem
              title={l}
              key={i}
              bottomDivider
              rightIcon={
                <Icon
                  name="video"
                  type="foundation"
                  color="green"
                  onPress={()=>{
                  this.props.Call_To_Id(l)
                  this.props.navigation.navigate("Call")
                }}
                /> 
              }
             />
        ))
      }
  </View >
  
  <Modal isVisible={this.state.isModalVisible} >
  <View style={styles.modal}>
      
        <Input
          label="Enter id to call:"
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => this.setState({value:text})}
          errorStyle={{ color: 'red' }}
          errorMessage={this.state.error}
        />
     <View style={{flexDirection:'row'}}>
            
              <Icon
                  reverse
                  name="call"
                  type="zocial"
                  color="green"
                  onPress={()=>{this.validate()}}
                  />
              <Icon
                  reverse
                  name="cross"
                  type="entypo"
                  color="red"
                  onPress={()=>{ this.setState({isModalVisible:false})
                                 this.setState({value:''})}}
              />
         
    </View>
  </View>
  </Modal>
 
 
  <View style={styles.bottom}>
   <Icon
    raised
    name="dialpad"
    type="material-community"
    color="green"
    onPress={()=>{ this.setState({isModalVisible:true})
         }}
    />

 </View>

 </View>

    )
}
}



const mapDispatchToProps=(dispatch)=>{
  return{

  Call_To_Id:(data)=>{
      dispatch({type:'CALLEE',payload:data})},  
  Caller:(data)=>{
      dispatch({type:'CALLER',payload:data})},

}

}

const styles = StyleSheet.create({
 
  container:{
    flex:1,
    //justifyContent:'center',
    //alignItems:'center',
   
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
  modal:{
    height:200,
    width:300,
   // flex:1,
    backgroundColor : "#FFFFFF",
    alignItems:'center'
   },
  bottom:{
    justifyContent:"flex-end",
    right:0,
    bottom:0,
    position: "absolute",
    marginBottom:14
  }
 
});

export default connect(null,mapDispatchToProps)(Home);