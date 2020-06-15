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
} from 'react-native';
import { SearchBar,ListItem,Icon } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import {connect} from 'react-redux'


import Call from './call'
class Home extends React.Component{
constructor(){
  super()
 this.state = {
    search: '',
    loading:false,
  };

}
searchId = search => {
    this.setState({loading:true})
    this.setState({ search });
  };





render(){
  const { My_Data}=this.props
   const { search } = this.state;

  return(
      <View style={{flex:1}}>
      <SearchBar
        placeholder="Type Here..."
        lightTheme        
        round 
        onChangeText={(text)=>this.searchId(text)}
        value={search}
      />
    <View >
  
      { !! My_Data.contacts &&
         My_Data.contacts.map((l, i) => (
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
 </View>

    )
}
}

const mapStateToProps=(state)=>{
  return {
    My_Data:state.my_data,
    
  }
 
}

const mapDispatchToProps=(dispatch)=>{
  return{

  Call_To_Id:(data)=>{
      dispatch({type:'CALLEE',payload:data})},  
}

}



export default connect(mapStateToProps,mapDispatchToProps)(Home);