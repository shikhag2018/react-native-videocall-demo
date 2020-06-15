import React, { useState, useEffect, createContext,useRef } from 'react'
import auth from '@react-native-firebase/auth'
import SignInStack from './signInStack'
import SignOutStack from './signOutStack'
import io from "socket.io-client/dist/socket.io.js"
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux'
import { SocketProvider } from '../screens/SocketContext';
import '../UserAgent';


const db =firestore().collection('users');
const AuthContext = createContext(null)

function AuthNavigator(props) {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState(null)
  const [contacts, setContacts] = useState('')
  const [Socket,setSocket]=useState(null)
  const socket = useRef();
  // Handle user state changes
  async function onAuthStateChanged(result) {
   setUser(result)
   if(!!result)
    {  socket.current= io("http://192.168.43.241:4443", { jsonp: false,foeceNode:true})
       db.doc(result.uid).get().then((doc)=>
      { 
        socket.current.send({
              type: "login",
              name: doc.data().id
       })
      props.my_Data(doc.data())
  
  
    })
   }
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged) 

    // unsubscribe on unmount

    return authSubscriber
  }, [])

  if (initializing) {
    return null
  }

  return user ? (
    <AuthContext.Provider value={user}>
    <SocketProvider socket={socket.current}> 
      <SignInStack />
    </SocketProvider>
    </AuthContext.Provider>
  ) : (
      <SignOutStack />
  )
}


const mapDispatchToProps=(dispatch)=>{
  return{

  my_Data:(data)=>{
      dispatch({type:'MY_DATA',payload:data})},  
}
}

export default connect(null,mapDispatchToProps)(AuthNavigator);


