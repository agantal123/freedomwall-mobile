import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, Switch  } from 'react-native';
import { Container, Header, Content, Icon, Button, ListItem, CheckBox, Body, Textarea, Form } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class createpage extends Component {
  static navigationOptions = {
    title: 'Create Post',
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
      Title: '', 
      Description: '', 
      ActivityIndicator_Loading: false, 
      username: null,
      switchValue: true,
      anonym: 'Anonymous',
      anonym2: ''
      
    }
}


toggleSwitch = (value) => {
      //onValueChange of the switch this function will be called
      this.setState({switchValue: value})
     // this.setState({anonym: this.state.username})
      //state changes according to switch
      //which will result in re-render the text
   }
   

   siwtchz = () =>
   {
      if (this.state.switchValue === true){
        alert(this.state.anonym);
      }
      else if(this.state.switchValue === false)
      {
      // this.setState({anonym: this.state.username})
        alert(this.state.username);
      }
   }

Insert_Data_Into_MySQL2 = () =>
{
  const {  Description } = this.state;
  const {  Title } = this.state;
    if ( Description === '' || Title === '')
          {
            alert("Please input the missing fields!");
          }
          else
          {
            if (this.state.switchValue === true){
              this.setState({ ActivityIndicator_Loading : true }, () =>
              {
               // fetch('http://localhost:8000/api/store_post',
               fetch('http://192.168.254.112:8080/api/store_post',
                  {
                      method: 'POST',
                      headers: 
                      {
                          'Accept': 'application/json, text/plain, */*',
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(
                      {
                        title : this.state.Title,
                        description : this.state.Description,
                        user_post : this.state.username,
                        anon : this.state.anonym,
                      })
          
                  }).then((response) => response.text()).then(() =>
                  {
          
                      this.setState({ ActivityIndicator_Loading : false });
                     this.props.navigation.navigate('Home');
          
                  }).catch((error) =>
                  {
                      console.error(error);
                      this.setState({ ActivityIndicator_Loading : false});
                  });
              });
            }
   else if(this.state.switchValue === false)
      {
          this.setState({ ActivityIndicator_Loading : true }, () =>
      {
      // fetch('http://localhost:8000/api/store_post',
      fetch('http://192.168.254.112:8080/api/store_post',
          {
              method: 'POST',
              headers: 
              {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(
              {
                title : this.state.Title,
                description : this.state.Description,
                user_post : this.state.username,
                anon : this.state.anonym2,
              })

          }).then((response) => response.text()).then(() =>
          {

              this.setState({ ActivityIndicator_Loading : false });
            this.props.navigation.navigate('Home');

          }).catch((error) =>
          {
              console.error(error);
              this.setState({ ActivityIndicator_Loading : false});
          });
      });
              
              }
            }
  }

componentDidMount() {
  this.getUserId().then((userD) => {
    this.setState({username: userD});
  })  
}

getUserId = async () => {
  let userD = await AsyncStorage.getItem('userDetails');
  return userD;
}



render()

{    
    return (
      <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={styles.container2}
     >
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.logo_small}>Write your post here</Text>
        <Text>_________________________________________</Text>
        <Form style={styles.form}>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Title" 
            placeholderTextColor="#5f5b5b"
            onChangeText = {(TextInputText) => this.setState({ Title: TextInputText })}/>
        </View>
        <View style={styles.inputView2} >
        <Textarea rowSpan={5}  
            style={styles.inputText2}
            placeholder="Write something...." 
            placeholderTextColor="#5f5b5b"
            onChangeText = {(TextInputText) => this.setState({ Description: TextInputText })}/>
        </View>
        <ListItem style={{justifyContent: 'center'}}>
        <Switch
          onValueChange = {this.toggleSwitch}
          value = {this.state.switchValue}/>
          <Text> Post as anonymous</Text>
          </ListItem>
          <View style={{flex: 1, flexDirection: 'row', height:10, marginTop: 10}}>
         
   
                      </View>           
        <TouchableOpacity style={styles.loginBtn}
           onPress = { this.Insert_Data_Into_MySQL2} >
          <Text style={styles.loginText}>POST</Text>
        </TouchableOpacity >
        {
        this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large' /> : null
        }
        </Form>
      </View>
      </TouchableWithoutFeedback>
     </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 1,
  },
  logo_small:{
    fontWeight:"bold",
    fontSize:23,
    marginBottom:5,
    color:"#5f5b5b"

  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#940000",
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,
    marginBottom:10,
    color:"#5f5b5b",
    borderRadius:5,
  },
  inputView:{
    width:"80%",
    backgroundColor:"#d7e2ec",
    height:50,
    justifyContent:"center",
    padding:20,
    marginTop:20
  },
  inputView2:{
    width:"80%",
    height:"40%",
    backgroundColor:"#d7e2ec",
    justifyContent:"center",
    padding:5,
    marginTop:20
  },
  inputText:{
    height:50,
    color:"#5f5b5b"
  },
  inputText2:{
    color:"#5f5b5b"
  },
  loginText:{
    color:"white"
  },
  form:{
    width: "100%",
    alignItems:"center",
    justifyContent:"center",
  },
  warning: {
    fontSize:12,
    textDecorationLine: 'underline',
    color:"gray"
  },
  warning2: {
    fontSize:12,
    color:"gray"
  },
  
});