import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Alert, TouchableHighlight, Image  } from 'react-native';
import { Container,  Header, Content, Icon, Right, Button, Input, Item, Picker, Form, Left, Card, CardItem, Thumbnail, Body, Footer, FooterTab, Drawer} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, faSignOutAlt, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

const deleteMyToken = 'http://192.168.254.114:8080/api/deleteMyToken';

export default class menu extends Component {
  
    static navigationOptions = {
        headerShown: false
}

    constructor(props) {
    
        super(props);
        this.state = {
            username: '',
        };
      }

      _logout = async() => {
        fetch(deleteMyToken,
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
              })
          }).then((response) => response.text()).then(() =>
          {
            AsyncStorage.clear();
            this.props.navigate('Auth');

          }).catch((error) =>
          {
              console.error(error);
          });
      }
      _home = async() => {
       this.props.navigate('Home');
      }

      _managePassword = async() =>
      {
        this.props.navigate('Change_pass');
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

  
render(){
   return (
<Content style={{backgroundColor: "white"}}>
<View style={styles.upper} >
<Thumbnail source={require('./images/photo.png')} style={{width: 40, height: 40, margin: 5}} />
        <Text style={styles.logo}>{this.state.username}</Text>
  </View>

        <TouchableOpacity style={styles.logout} onPress={this._home}>
            <View style={{flexDirection: "row",alignItems:"center",}}>
                    <FontAwesomeIcon
                        icon={faHome} 
                      style={{fontSize: 21, color: "#ff8080", padding: 10}}
                      />
            <Text > Home</Text>
        </View>
</TouchableOpacity>

<TouchableOpacity style={styles.logout} onPress={this._managePassword}>
<View style={{flexDirection: "row",alignItems:"center",}}>
            <FontAwesomeIcon
              icon={faUnlockAlt}
               style={{fontSize: 21, color: "#ff8080", padding: 10}}
               />
    <Text> Manage Password</Text>
    </View>
</TouchableOpacity>

<TouchableOpacity style={styles.logout} onPress={this._logout}>
<View style={{flexDirection: "row",alignItems:"center",}}>
            <FontAwesomeIcon
              icon={faSignOutAlt}
               style={{fontSize: 21, color: "#ff8080", padding: 10}}
               />
    <Text> Logout</Text>
    </View>
</TouchableOpacity>
</Content>
)
};

}
const styles = StyleSheet.create({
    logout:{
        width:"100%",
        //backgroundColor:"#ff8080",
        height:50,
        //alignItems:"center",
        justifyContent:"center",
        marginBottom: 1,
      //  marginLeft: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ece9ea",
        
      },
      upper:{
        width:"100%",
        backgroundColor:"#A94C4C",
        height:80,
        marginBottom: 1,
        flexDirection: "row",
        paddingTop: 25,
      },
      logo:{
        fontWeight:"bold",
        fontSize:20,
        color:"#ffebee",
        paddingTop: 15,
      },
 
})
