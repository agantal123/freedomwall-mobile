import React from 'react';
import { StyleSheet, Text, View, TextInput,ActivityIndicator, TouchableOpacity,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const loginUrl = 'http://192.168.254.114:8080/api/loginFWuser';

export default class login extends React.Component {
static navigationOptions = 
{
    headerShown: false,
}

constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      userid: '',
      ActivityIndicator_Loading: false, 
    }
  } 
  
  UserLogin = async () =>
  {
      const { username }  = this.state;
      const { password }  = this.state;
      if(username == '' || password == '')
      {
        alert("Please enter your username and password!")
      }
      else
      { 
        this.setState({ ActivityIndicator_Loading : true }, () =>
        {
            fetch(loginUrl,
             {
              method: 'POST',
              headers: 
              {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(
              {
                username : this.state.username,
                password : this.state.password
              })
            }).then((response) => response.json())
            .then((responseJson) =>
            {
              if( responseJson == 'Invalid Credentials')
              {
                alert('Invalid Credentials!');
                this.setState({ ActivityIndicator_Loading : false});
              }
              else
              {
                AsyncStorage.setItem('userDetails', username);
                AsyncStorage.setItem('userLoggedInStatus', 'true');
                this.setState({ ActivityIndicator_Loading : false });
                this.props.navigation.navigate('Home');
              }
            }).catch((error) =>
            {
                console.error(error);
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
      }
  }

render(){
    return (
        <View style={styles.container}>
        <View style={{flexDirection: "row"}}>  
        <Image source={require('./auth_images/logo.png')} style={{width: 60, height: 60, marginBottom: 15}} /> 
        <Text style={styles.logo}>USeP</Text>
        </View>
        <Text style={styles.logo_small}>Freedom wall</Text>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Username" 
            placeholderTextColor="#5f5b5b"
            ref
            onChangeText={text => this.setState({username:text})}
            autoCapitalize="none"
            />
            
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Password" 
            placeholderTextColor="#5f5b5b"
            onChangeText={text => this.setState({password:text})}
            autoCapitalize="none"
            
            />
        </View>
        <TouchableOpacity style={styles.loginBtn}  onPress = { this.UserLogin } >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        {
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='white' size='large' /> : null
        }
        <TouchableOpacity style={{ marginTop: 40}} onPress={() => this.props.navigation.navigate('Register')} >
          <Text style={styles.loginText2}>Click here to Sign Up </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#A94C4C',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"#ffebee",
     
    },
    logo_small:{
      fontWeight:"bold",
      fontSize:30,
      color:"#ffebee",
      marginBottom:35,
      marginTop: -20,
    },
    inputView:{
      width:"80%",
      backgroundColor:"#ffffff",
      borderRadius:15,
      height:50,
      justifyContent:"center",
      padding:20,
      marginTop:10
    },
    inputText:{
      height:50,
      color:"#5f5b5b"
    },
    loginBtn:{
      width:"80%",
      backgroundColor:"#940000",
      borderRadius:15,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      marginBottom:10
    },
    loginText:{
      color:"white"
    },
    loginText2:{
      color:"white",
      fontStyle:"italic"
    },
    text:
    {
      fontWeight:"bold",
      fontSize:10,
      color:"#ffebee",
      marginBottom:10
    }
  });