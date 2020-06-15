import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from '../screens/Login';
import Register from '../screens/Register';
import Reset from '../screens/Reset';

const stack = createStackNavigator();

export default function SignOutStack() {
  return (
    <NavigationContainer>
       <stack.Navigator >
          <stack.Screen name="Login" component={Login} options={{
                   headerShown: false}}/>
          <stack.Screen name="Register" component={Register} 
             options={{
             headerShown: false
              }} />
          <stack.Screen name="Reset" component={Reset} 
              options={{
                  headerShown: false
              }}/>    
    </stack.Navigator>
    </NavigationContainer>
  )
}