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
export default class Profile extends React.Component{

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
  return(
      <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
      <Button title="Logout" onPress={()=>this.signOut()}/>
      </View>

    )
}
}