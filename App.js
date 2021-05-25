import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, HeaderBackbutton } from 'react-navigation-stack';

import Login from './screens/authscreens/login.js';
import Register from './screens/authscreens/register.js';

import Home from './screens/fwscreens/home.js';
import Profile from './screens/fwscreens/profile.js';
import Notification from './screens/fwscreens/notification.js';
import Change_pass from './screens/fwscreens/change_pass.js';
import CreatePage from './screens/fwscreens/createpage.js';
import PostComment from './screens/fwscreens/postComment.js';

const RootStack = createStackNavigator(
{
Home: {
  screen: Home
},
Profile: {
  screen: Profile
},
Notification: {
  screen: Notification
},
Change_pass: {
  screen: Change_pass
},
CreatePage: {
  screen: CreatePage
},
PostComment: {
  screen: PostComment
},

});

const AuthStack = createStackNavigator(
{
  Login: {
    screen: Login
  },
  Register: {
    screen: Register
  }
})

class AuthLoadingScreen extends Component
{ 
  constructor(props)
  {
    super(props);
    this._checklogin();
  }

  render()
  {
    return(
      <View style={{flex: 1, paddingTop: 20, alignItems: 'center',justifyContent: 'center'}}>
          <ActivityIndicator />
      </View>
    );
  }

  _checklogin = async() => 
  {
      const userlogin = await AsyncStorage.getItem('userLoggedInStatus');
      this.props.navigation.navigate(userlogin !== 'true' ? 'Auth' : 'App');
  }
}

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: RootStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
  )); 
