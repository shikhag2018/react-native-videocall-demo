import React,{useState,useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,

} from 'react-native';

import { Button, Input ,Icon} from 'react-native-elements';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Login({navigation}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const [ErrorMsg,setErrorMsg]=useState('');


const validatelogin = () => {
    try {
       
        if (email=="" && password=="" )
        {
            setErrorMsg(" * please fill email and password ")
        }
        else if (email=="" || password=="" )
        {
            setErrorMsg(" * please provide credentials")
        }
        else
        {
            login()
        }
      
    } catch (e) {
   

        
    }
};

const login = async() => {
    setShowLoading(true);

    try {
        const doLogin = await auth().signInWithEmailAndPassword(email, password);
        setShowLoading(false);
    } catch (e) {
        setShowLoading(false);
        setErrorMsg(e.message);
    }
};



  return (
        <View style={styles.container}>
        <View style={styles.formContainer}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',padding:15}}>
                <Text style={{ fontSize: 28, height: 50 ,color:'#F08080'
                 }}>Please Login!</Text>
            </View>
            <View style={styles.subContainer}>
                <Input
                    inputContainerStyle={{borderRadius:5}}
                    style={styles.textInput}
                    placeholder='Your Email'
                    leftIcon={
                        <Icon
                        name='mail'
                        color='#F08080'
                        size={24}
                        />
                    }
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
            <View style={styles.subContainer}>
                <Input
                    style={styles.textInput}
                    inputContainerStyle={{borderRadius:5}}
                    placeholder='Your Password'
                    leftIcon={
                        <Icon
                        name='lock'
                        color='#F08080'
                        size={24}
                        />
                    }
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            <Text style={{color:'#FF0000'} }>{ErrorMsg}</Text>
            <View style={styles.subContainer}>
                <Button
                
                   buttonStyle={{backgroundColor:"#F08080",borderRadius:5}}
                    title="Login"
                    onPress={() => validatelogin()} />
            </View>
            
               
            <TouchableOpacity 
                onPress={() => { navigation.navigate('Reset')}} >
                <View style={{alignItems:'flex-end'}} >
                    <Text style={{color:'#F08080'}}>Forgot Password?</Text>
                </View>
            </TouchableOpacity>
                        
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Not a user?</Text>
            </View>
            <View style={styles.subContainer}>
                <Button
                    style={styles.textInput}
                    buttonStyle={{backgroundColor:"#F08080",borderRadius:5}}
                    title="Register"
                    onPress={() => {
                        navigation.navigate('Register');
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
        //alignItems:"center"
         //backgroundColor: 'transparent'
    },
    
    formContainer: {
        height: 350,
        padding: 20,
    },
    subContainer: {
        marginBottom: 5,
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
        width: 200,
       
    },
});