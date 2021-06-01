import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Keyboard   } from 'react-native';
import { Container, Input, Item, Form, Thumbnail, Label } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const changepassword = 'http://192.168.254.114:8080/api/change_password';

export default class change_pass extends Component {
  static navigationOptions = {
    title: 'Change Password',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#A94C4C'
    },
    headerTitleStyle: {
      color: 'white'
    },
}
constructor(props) {   
  super(props);
  this.state = {
    isLoading: false,
    username: null,
    password: '',
    new_password: '',
    new_re_password: '',

  };
}

componentDidMount() {
  this.getUserId().then((userD) => {
    this.setState({username: userD});
  })
}

user_changepass = async () => {
    const {  password, new_password, new_re_password } = this.state;
    let regex = /[a-zA-Z0-9]{8}/gm;
    if(password == '' || new_password == '' || new_re_password == '' )
    {
        alert("Please fill the missing field!");
    }
    else
    {
        if(regex.test(new_password) === false)
    {
      this.setState({
        password: '',
        new_password: '',
        new_re_password: '',
        });
      alert("New password should be 8 characters!");
      return false;
    }
    else
    {
      if (new_password !== new_re_password)
      {
        this.setState({
          password: '',
          new_password: '',
          new_re_password: '',
          });
        alert("new password does not match");
      }
      else
      {
        this.setState({ isLoading : true }, () =>
       {
        fetch(changepassword,
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
              password : this.state.password,
              new_password : this.state.new_re_password,

            })

        }).then((response) => response.json())
        .then((responseJson) =>
        {
          if( responseJson == 'Password Changed!')
          {
            this.setState({ isLoading : false });
            this.props.navigation.navigate('Profile');
            alert('Password changed successfully!');
          }
          else{
             alert('Invalid old password');
             this.setState({
              password: '',
              new_password: '',
              new_re_password: '',
              });
             this.setState({ isLoading : false});
          }
        }).catch((error) =>
        {
            console.error(error);
            this.setState({ isLoading : false});
        });
    }
  
    );
      }
    }
  }
}

getUserId = async () => {
  let userD = await AsyncStorage.getItem('userDetails');
  return userD;
}

render() {
      return (
         <Container style={{backgroundColor: "#ece9ea"}}>
             <View style={styles.view}> 
             <Form style={styles.content}>
             <Thumbnail source={require('./images/photo.png')} />
                <Text style={{marginTop:20, fontWeight: "bold"}}> {this.state.username}</Text>
                
                    <Item floatingLabel>
                    <Label>Old Password</Label>
                    <Input
                    secureTextEntry
                   // style={styles.inputText}
                    placeholder="Password" 
                    placeholderTextColor="#5f5b5b"
                    onChangeText={text => this.setState({password:text})}
                    autoCapitalize="none"
                    value={this.state.password}
                     />
                    </Item>
                    <Item floatingLabel last>
                    <Label>New Password</Label>
                    <Input 
                    secureTextEntry
                  //  style={styles.inputText}
                    placeholder="Password" 
                    placeholderTextColor="#5f5b5b"
                    onChangeText={text => this.setState({new_password:text})}
                    autoCapitalize="none"
                    value={this.state.new_password}
                    />
                    </Item>
                    <Item floatingLabel last>
                    <Label>Confirm New Password</Label>
                    <Input 
                    secureTextEntry
                   // style={styles.inputText}
                    placeholder="Password" 
                    placeholderTextColor="#5f5b5b"
                    onChangeText={text => this.setState({new_re_password:text})}
                    autoCapitalize="none"
                    value={this.state.new_re_password}
                    onSubmitEditing={Keyboard.dismiss}
                    />
                    </Item>
                </Form>
              </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 10}}>
               

                <TouchableOpacity style={styles.post}
                    onPress = {this.user_changepass}
                // onPress={() => this.props.navigation.navigate('Profile')}
                 >
                <Text style={styles.posttext}>Save Changes</Text>
                 </TouchableOpacity >
                 {
                 this.state.isLoading ? <ActivityIndicator color='#A94C4C' size='large'style={styles.ActivityIndicatorStyle} /> : null
                     }
                 </View>
        
         </Container>
       )
   }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    savebutton: {
     textAlign: "center",
    },
    view: {
     margin: 15,
    },
    post:{
      width:"80%",
      backgroundColor:"#A94C4C",
      borderRadius:5,
      height:40,
      alignItems:"center",
      justifyContent:"center",
      margin: 7.5,
      marginTop: 50,
    },
    posttext:{
      color:"white"
    },
});