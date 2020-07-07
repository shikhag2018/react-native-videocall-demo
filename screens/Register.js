import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';


export default function Register({ navigation }) {
    const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showLoading, setShowLoading] = useState(false);
    const [ErrorMsg,setErrorMsg]=useState('');
    const db =firestore().collection('users');


const validateRegister =() => {
    
        if (email=="" && password=="" )
        {
            setErrorMsg("please fill email and password ")
        }
        else if(email==''||password=="")
        {
            setErrorMsg("please provide credentials")
        }
        else
        {
            register()
        }
      
};

ID=()=> {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return 'liv:' + Math.random().toString(36).substr(2, 9);
};

const register = async() => {
    setShowLoading(true);
    
    try {
        const doRegister = await auth().createUserWithEmailAndPassword(email, password)
         await db.doc(doRegister.user.uid).set({
              email:email,
              id:ID(),
          })
    
    } catch (e) {
        setShowLoading(false);
        setErrorMsg(e.message)
    }
};

    return (
        <View style={styles.container}>
        	<View style={styles.formContainer}>
        		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                	<Text style={{ fontSize: 28, height: 50,color:'green' }}>Register Here!</Text>
                </View>

        		<View style={styles.subContainer}>
                	<Input
	                    style={styles.textInput}
	                    placeholder='Your Email'
	                    leftIcon={
	                        <Icon
	                        name='mail'
                            color='green'
	                        size={24}
	                        />
	                    }
	                    value={email}
	                    onChangeText={setEmail}
                	/>
                </View>


	            <View style={styles.subContainer}>
	              <Input style={styles.textInput}
	                     placeholder='password'
	                     leftIcon={
	                      <Icon
	                      name="lock"
                          color='green'
	                      size={25}
	                      />
	                     }
	                     value={password}
	                     secureTextEntry={true}
	                     onChangeText={setPassword}

	              />
	            </View>
               <Text style={{color:'#FF0000'} }>{ErrorMsg}</Text>
	            <View style={styles.subContainer}>
	                <Button
	                    style={styles.textInput}
                        buttonStyle={{backgroundColor:"green",borderRadius:5}}
	                    title="Register"
	                    onPress={() => validateRegister()} />
                </View>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                	<Text>Already a user?</Text>
                </View>

                <View style={styles.subContainer}>
	                <Button
	                    style={styles.textInput}
	                    buttonStyle={{backgroundColor:"green",borderRadius:5}}
	                    title="Login"
	                    onPress={() => {
	                        navigation.navigate('Login');
	                    }} />
                </View>
                
                {showLoading &&
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
                 }


        	</View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
    },
    formContainer: {
        height: 400,
        padding: 20
    },
    subContainer: {
        marginBottom: 20,
        padding: 5,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        fontSize: 18,
        margin: 5,
        width: 200
    },
})
