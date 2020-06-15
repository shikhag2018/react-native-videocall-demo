import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

export default function Reset({ navigation }) {
    const [email, setEmail] = useState('');
	const [showLoading, setShowLoading] = useState(false);
    const [ErrorMsg,setErrorMsg]=useState('');

const reset = async() => {
    if(email=="")
    {

        setErrorMsg("* please fill email")
    }
    else
    {
    setShowLoading(true);
    try {
        
        await auth().sendPasswordResetEmail(email);
        setShowLoading(false);
    
    } catch (e) {
        setShowLoading(false);
        setErrorMsg(e.message)
    }
   }
};


    return (
    	<View style={styles.container}>
    		<View style={styles.formContainer}>
    			<View style={styles.subContainer}>
                <Input
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
                <Text style={{color:'#FF0000'} }>{ErrorMsg}</Text>
                <View style={styles.subContainer}>
	                <Button
	                    style={styles.textInput}
	                    buttonStyle={{backgroundColor:"#F08080",borderRadius:5}}
	                    title="Reset"
	                    onPress={() => reset()} />
                </View>

                <View style={styles.subContainer}>
	                <Button
	                    style={styles.textInput}
	                    buttonStyle={{backgroundColor:"#F08080",borderRadius:5}}
	                    title="Back to Login"
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
