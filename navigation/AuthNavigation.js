 import React, { useState, useEffect, createContext,useRef } from 'react'
import auth from '@react-native-firebase/auth'
import SignInStack from './signInStack'
import SignOutStack from './signOutStack'
import io from "socket.io-client/dist/socket.io.js"
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux'

import {
  SafeAreaView,
  StyleSheet,
  Alert,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';

/*RNCallKeep.setup({
  ios: {
    appName: 'CallKeepDemo',
  },
  android: {
     alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
  },
});
*/

const db =firestore().collection('users');
const AuthContext = createContext(null)

function AuthNavigator(props) {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState(null)
  const [contacts, setContacts] = useState('')


  // Handle user state changes
  async function onAuthStateChanged(result) {
   setUser(result)

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
        <SignInStack />
    </AuthContext.Provider>
  ) : (
      <SignOutStack />
  )
}




export default AuthNavigator;


