import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, ActivityIndicator, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard  } from 'react-native';


export default class register extends Component {
  static navigationOptions = {
    title: 'Register',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#A94C4C'
    },
    headerTitleStyle: {
      color: 'white'
    },   
}
    constructor()
    {
        super();
 
        this.state = { 
 
          Username: '', 
 
          Password: '', 
          
          re_password: '',
 
          ActivityIndicator_Loading: false, 
 
        }
    }

    Insert_Data_Into_MySQL = () =>
    {
        const { Username, Password, re_password } = this.state;
        let passwrd_regex = /[a-zA-Z0-9]{8}/gm;
        let username_regex = /[a-zA-Z0-9]{8}/gm;
        if(Username == '' || Password == ''|| re_password == '')
        {
            alert('Please input missing field!');
        }
        else
        {
          if(username_regex.test(Username) === false)
          {
            alert("Username should be atleast 8 characters.");
            return false;
          }
          else
          {
            if(passwrd_regex.test(Password) === false)
            {
              alert("Password should be atleast 8 characters!");
              return false;
            }
            else
            {
              if (Password !== re_password)
              {
                alert("Password does not match");
              }
              else
              {
                this.setState({ ActivityIndicator_Loading : true }, () =>
               {
                fetch('http://192.168.254.112:8080/api/registerFWuser',
                {
                    method: 'POST',
                    headers: 
                    {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                    {
                      username : this.state.Username,
                      password : this.state.re_password
                    })
                }).then((response) => response.json())
                .then((responseJson) =>
                {
                  if( responseJson == 'Account created successfully!')
                  {
                    this.setState({ ActivityIndicator_Loading : false });
                    alert('Account created successfully!');
                    this.props.navigation.navigate('Login');
                  }
                  else if(responseJson == 'Username already existed!')
                  {
                    this.setState({
                      ActivityIndicator_Loading : false,
                      Username: '',
                      Password: '',
                      re_password: '',
                      });
                      alert(responseJson);
                  }
                }).catch((error) =>
                {
                    console.error(error);
                    this.setState({ ActivityIndicator_Loading : false});
                });
              }
              );
                }
              }
          }
        }
    }


  
  render(){
    return (
      <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={styles.container2}
     >
       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            onChangeText = {(TextInputText) => this.setState({ Username: TextInputText })}
            autoCapitalize="none"
            />
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Password" 
            placeholderTextColor="#5f5b5b"
            onChangeText = {(TextInputText) => this.setState({ Password: TextInputText })}
            autoCapitalize="none"
            />
            
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Re-enter Password" 
            placeholderTextColor="#5f5b5b"
            onChangeText={text => this.setState({re_password:text})}
            autoCapitalize="none"
            />
        </View>
        <View>
        <Text style={{color:'white', fontSize: 11}}>  *Password must be at least 8 characters long.</Text>
        </View>
        {
        this.state.ActivityIndicator_Loading ? <ActivityIndicator color='white' size='large' style={{ marginTop: 10}}/> : null
        }
        <TouchableOpacity style={styles.loginBtn}
           onPress = { this.Insert_Data_Into_MySQL} >
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity >
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
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
  container2: {
    flex: 1,
    
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
    marginTop: -20
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
  forgot:{
    color:"white",
    fontSize:11
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
  text:
  {
    fontWeight:"bold",
    fontSize:10,
    color:"#ffebee",
    marginBottom:10
  },
});