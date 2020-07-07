import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Alert
} from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux'
const db =firestore().collection('users');
class Profile extends React.Component{

signOut=async(props)=>{
   
   try{
    await firebase.auth().signOut()
    .catch(e=>Alert.alert(e.message));
      

   }
   catch(e){
      console.log(e.message)
   }

}

render(){
  console.log(this.props.My_id)
  return(
      <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
      <Text style={{fontSize:15}}>My id: {this.props.My_id}</Text>
      <Button title="Logout" onPress={()=>{
        this.signOut().then(()=>{db.removeAllObservers()})}
      }/>
      </View>

    )
}
}

const mapStateToProps=(state)=>{ 
  return {
    My_id:state.caller,
    
  }
 
}

export default connect(mapStateToProps)(Profile);




