import React, { Component } from "react";

import { TabNavigator, HeaderBackButton } from "react-navigation";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ListView, Alert, FlatList, TouchableHighlight, ActionSheetIOS   } from 'react-native';
import { Container, Content, Icon, Right, Button, Input, Item, Picker, Form, Left, Card, CardItem, Thumbnail, Body, Footer, FooterTab, Label } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome,faUser,faBell, faPen, faUnlockAlt, faCheck, faChevronUp, faComment, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const url = 'http://192.168.254.112:8080/api/view_my_notification';

export default class notification extends Component {
    static navigationOptions = {
        title: 'Notifications',
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
    isLoading: true,
    username: null,
    isFetching: false,
    postId: '',
    voteIndicator: false,

  };
}

goHome()
{
  this.props.navigation.navigate('Home');
}

UNSAFE_componentWillMount()
{
    this.fetchmynotifall()
}

onRefresh() {
  this.setState({ isFetching: true }, function() { this.fetchmynotifall() });
}



fetchmynotifall = async () =>
{
  return fetch(url)
  .then((response) => response.json())
  .then((responseJson) => {
    let filteredResponseJson = responseJson.filter(mynotif => mynotif.username == this.state.username )
    let ids = responseJson.filter(id => id.id)
    this.setState({
      isLoading: false,
      dataSource: filteredResponseJson,
      isFetching: false,
      postId: ids,
    }, function() {
      
    });
  })
  .catch((error) => {
    console.error(error);
  });
}

componentDidMount() {
  this.fetchmynotifall();
  this.getUserId().then((userD) => {
    this.setState({username: userD});
  })
}

FlatListItemSeparator = () => {
  return (
    <View
    style={{
        margin: -5,
      }}
    />
  );
}

getUserId = async () => {
  let userD = await AsyncStorage.getItem('userDetails');
  return userD;
}


OpenCommment(post_id,notif_id) {
    fetch('http://192.168.254.112:8080/api/seen_notification',
    {
        method: 'POST',
        headers: 
        {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
          notif_postId : notif_id,
          username : this.state.username,
        })
    }).then((response) => response.text()).then(() =>
    {
     this.props.navigation.navigate('PostComment', { getpostid: post_id });  
    
    }).catch((error) =>
    {
        console.error(error);
    });
 }
   render() {

    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
   
      return (
       
         <Container style={{backgroundColor: "#ece9ea"}}>
            <TouchableHighlight style={{ height: 0.1}} onPressOut = {this.fetchmynotifall}>
                  <Text></Text>
                </TouchableHighlight>
                <FlatList
                  data={ this.state.dataSource }
                  onRefresh={() => this.onRefresh()}
                  refreshing={this.state.isFetching}
                  ItemSeparatorComponent = {this.FlatListItemSeparator}
                  renderItem=
                  {({item}) => 
          <Content>
        <TouchableOpacity
         onPress={this.OpenCommment.bind(this, item.post_id, item.notification_id)} 
        >
          <Card style={{flex: 0}}>
          {item.seen_notification == 0 ? <CardItem style={{backgroundColor: '#e8dbdb'}}> 
          <Left>
                <Thumbnail source={require('./images/photo.png')} />
                <Body>
                    <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight: "bold"}}>{item.notification_from_user}</Text>
                    <Text note style={{fontSize: 13}}> {item.notification_type}.</Text>
                    </View>
                  <Text note style={{color:'#808080', fontSize: 12}}>{moment(item.created_at).format('MMMM Do YYYY, h:mm a')}</Text>
                </Body>
              </Left> 
          </CardItem> : 
          <CardItem style={{backgroundColor: 'white'}}>
            <Left>
                <Thumbnail source={require('./images/photo.png')} />
                <Body>
                    <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight: "bold"}}>{item.notification_from_user}</Text>
                    <Text note style={{fontSize: 13}}> {item.notification_type}.</Text>
                    </View>
                  <Text note style={{color:'#808080', fontSize: 12}}>{moment(item.created_at).format('MMMM Do YYYY, h:mm a')}</Text>
                </Body>
              </Left> 
             </CardItem> }
          </Card>
          </TouchableOpacity>
        </Content>
          }
          keyExtractor={(item, index) => index.toString()}
          />
        <Footer style={styles.footer}>
          <FooterTab style={{backgroundColor:'white'}}>
            <Button onPress={() => this.props.navigation.navigate('Home')}>
            <FontAwesomeIcon style={{color:'gray'}} icon={faHome} />
              <Text>Home</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate('Profile')}>
            <FontAwesomeIcon style={{color:'gray'}} icon={faUser} />
              <Text>Profile</Text>
            </Button>
            <Button>
            <FontAwesomeIcon style={{color:'#A94C4C'}} icon={faBell} />
              <Text>Notification</Text>
            </Button>
          </FooterTab>
        </Footer>
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
     backgroundColor: "white",
     paddingBottom: 20,
     borderBottomWidth: 1,
     borderBottomColor: "#ece9ea",
    },
    post:{
      width:"80%",
      backgroundColor:"#ff8080",
      borderRadius:5,
      height:30,
      alignItems:"center",
      justifyContent:"center",
      margin: 7.5,
    },
    posttext:{
      color:"white"
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: "#ece9ea",
    }
});