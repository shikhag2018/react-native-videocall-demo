import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Button, Input ,Icon} from 'react-native-elements';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Call from '../screens/call';

const stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function SignInStack() {
  return (
    <NavigationContainer>
          <stack.Navigator>
            <stack.Screen name="Home" component={CALL}  options={{
             headerShown: false
              }} />
              <stack.Screen name="Call" component={Call}  options={{
             headerShown: false
              }}/>
         </stack.Navigator>
    </NavigationContainer>
  )
}

function CALL() {
  return (
    
    <Tab.Navigator 
            activeColor="white"
            //style={{ backgroundColor: 'green' }}>
            barStyle={{ backgroundColor: 'green' }}>
           <Tab.Screen name="Home" component={Home}
               options={{
          tabBarIcon: ({ color }) => (
            <Icon name="video-call" type="material-icons" color={color} size={26} />
          ),
        }}
            /> 
          <Tab.Screen name="Profile" component={Profile}
               options={{
          tabBarIcon: ({ color }) => (
            <Icon name="list" type="feather" color={color} size={26} />
          ),
        }}
            />   
       </Tab.Navigator>
  );
}