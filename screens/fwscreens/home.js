import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Alert, TouchableHighlight, LogBox  } from 'react-native';
import { Container,  Header, Content, Icon, Right, Button, Input, Item, Picker, Form, Left, Card, CardItem, Thumbnail, Body, Footer, FooterTab, Drawer, ActionSheet, Root, Badge} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideBar from './menu.js';
import moment from "moment";

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome,faUser,faBell, faAlignLeft, faSortDown, faCheck, faChevronUp, faPen, faComment, faBars, faChevronDown } from '@fortawesome/free-solid-svg-icons';




// import { YellowBox } from 'react-native'
// console.disableYellowBox = true;

/*
YellowBox.ignoreWarnings([
	'Warning: Failed child context type:', // TODO: Remove when fixed
])*/

LogBox.ignoreAllLogs()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
             
const url = 'http://192.168.254.112:8080/api/getRecentPost';
const url2 = 'http://192.168.254.112:8080/api/getTrendingPost';

const url3 = 'http://192.168.254.112:8080/api/checkUpvotePost';
const url6 = 'http://192.168.254.112:8080/api/checkDownvotePost';

const url5 = 'http://192.168.254.112:8080/api/addTokenToUser';

const url_upvotePost = 'http://192.168.254.112:8080/api/mobileUpvotePost';
const url_downvotePost = 'http://192.168.254.112:8080/api/mobileDownvotePost';

const url4 = 'http://192.168.254.112:8080/api/check_notif_count';

var BUTTONS = ["Most recent posts", "Most popular posts"];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 4;

export default class home extends Component {

  static navigationOptions = 
  {
      headerShown: false,
  }
closeDrawer() {
  this.drawer._root.close()
};
openDrawer(){
  this.drawer._root.open()
};


_logout = async() => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }
   


constructor(props) {
    
    super(props);
    this.state = {
  //    selected: "key1",
      isLoading: true,
      username: '',
      isFetching: false,
   //   anonz: '',
      voteIndicator: false,
      iconColor: 'gray',
      isLoading2: true,
      isFetching2: false,
      sortedPost: false,
      //upvotedPost: [],
      myids: [],
      myids2: [],
      dataSource: '',
      dataSource2: '',
   //   allids: '',
      notification_count: '',
      notifcounter: [],
    };
  }
 _isMounted = false;

   componentDidMount() {
    this._isMounted = true;
    this.registerForPushNotificationsAsync();
    this.fetchpostall();
    this.viewupvotedPost();
    this.viewdownvotedpost();
    this.getUserId().then((userD) => {
      this.setState({username: userD});
    });

    this.props.navigation.addListener('willFocus',this._handleStateChange);
    this.fetchpostall();
  }

   componentWillUnmount() {
     this._isMounted = false;
  }


   _handleStateChange = state => {
     this.fetchpostall();
     this.viewupvotedPost();
   };
  

  registerForPushNotificationsAsync = async () => {
    
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification! Please turn on your notification settings!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
     // console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return fetch(url5,{
      method: 'POST',
      headers: {
       'Accept': 'application/json, text/plain, */*',
       'Content-Type': 'application/json',
      },
      body: JSON.stringify(
       {
         userToken: token,
         username: this.state.username,
       })
    }).then((response) => response.text()).then(() =>
    {
      //do nothing
    }).catch((error) =>
    {
        console.error(error);
    });
  }




  getUserId = async () => {
    let userD = await AsyncStorage.getItem('userDetails');
    return userD;
  }

  OpenCommment(id) {
     this.props.navigation.navigate('PostComment', { getpostid: id });
  }

   onRefresh() {
      this.setState({ 
        isFetching: true 
      }, function() { 
         this.fetchpostall(),
         this.viewupvotedPost();
         this.viewdownvotedpost();
       //  this.registerForPushNotificationsAsync();
      });
   }

   fetchpostall = async () =>
   {
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        dataSource: responseJson,
        isFetching: false,
        sortedPost: false,
      }, function() {
      });
    })
    .catch((error) => {
      console.error(error);
    });
   } 

   sortPost = async () =>
   {
    return fetch(url2)
    .then((response) => response.json())
    .then((responseJson2) => {
      this.setState({
        isLoading: false,
        dataSource: responseJson2,
        isFetching2: false,
        sortedPost: true,
      }, function() {
        // In this block you can do something with new state.
      });
    })
    .catch((error) => {
      console.error(error);
    });
   }


FlatListItemSeparator = () => {
  return (
    <View />
  );
}

postcolorUpvoted(item)
{
  let upvoteColor = "gray";
  //var  = Array.isArray(this.state.myids);
  if(this.state.myids.map(i =>i.post_id).includes(item.id))
  {
    upvoteColor = "#940000";
  }
  else
  {
    upvoteColor = "gray";
  }
 return upvoteColor;
}

postcolordownvoted(item)
{
  let upvoteColor = "gray";
  if(this.state.myids2.map(i =>i.post_id).includes(item.id))
  {
    upvoteColor = "#940000";
  }
  else
  {
    upvoteColor = "gray";
  }
 return upvoteColor;
}


viewupvotedPost = async () =>
{
return fetch(url3)
  .then((response) => response.json())
  .then((responseJson) => {
    let filteredResponseJson = responseJson.filter(votes => votes.username == this.state.username )
    this.setState({
      myids: filteredResponseJson
     
    }, function() {
      // In this block you can do something with new state.
    });

  })
  .catch((error) => {
    console.error(error);
  });
}

viewdownvotedpost = async () =>
{
return fetch(url6)
  .then((response) => response.json())
  .then((responseJson) => {
    let filteredResponseJson2 = responseJson.filter(votes => votes.username == this.state.username )
    this.setState({
      myids2: filteredResponseJson2
    }, function() {
      // In this block you can do something with new state.
    });

  })
  .catch((error) => {
    console.error(error);
  });
}


viewnotifcounter = async () =>
{
  return fetch(url4)
  .then((response) => response.json())
  .then((responseJson) => {
    let filteredResponseJson = responseJson.filter(notif_count => notif_count.user_post == this.state.username )
    this.setState({
     // notification_count: filteredResponseJson,
     // notifcounter: filteredResponseJson,
      notifcounter: filteredResponseJson,
    }, function() {
      
    });
  })
  .catch((error) => {
    console.error(error);
  });
}


upvotePost = async (id) =>
{ 
  fetch(url_upvotePost,
  {
      method: 'POST',
      headers: 
      {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(
      {
        post_id : id,
        username : this.state.username,
      })

  }).then((response) => response.json())
  .then((responseJson) =>
  {
      if (this.state.sortedPost === true)
        {
          this.sortPost();
          this.viewupvotedPost();
         this.viewdownvotedpost();
        }
      else
        {
          this.fetchpostall();
          this.viewupvotedPost();
          this.viewdownvotedpost();
        }
  }).catch((error) =>
  {
      console.error(error);
  });
}


downvotePost = async (id) =>
{ 
  fetch(url_downvotePost,
  {
      method: 'POST',
      headers: 
      {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(
      {
        post_id : id,
        username : this.state.username,
      })

  }).then((response) => response.json())
  .then((responseJson) =>
  {
      if (this.state.sortedPost === true)
        {
          this.sortPost();
          this.viewupvotedPost();
         this.viewdownvotedpost();
        }
      else
        {
          this.fetchpostall();
          this.viewupvotedPost();
         this.viewdownvotedpost();
        }
  }).catch((error) =>
  {
      console.error(error);
  });
}


recent = () =>
{
  this.fetchpostall();
}
pop = () =>
{
this.sortPost();
}

render(){
 
  if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      
<Drawer ref={(ref) => { this.drawer = ref; }}
 content={<SideBar navigate= {this.props.navigation.navigate} />}
  onClose={() => this.closeDrawer()} >
    
<View style={{flex: 1}}>
<Header style={{backgroundColor: "#A94C4C", height:50, marginTop: 10}}>
          <Left>
          <Button 
              transparent
          onPress={() => this.openDrawer()}>
          <FontAwesomeIcon icon={faBars} color={"white"} />
        </Button>
        </Left>
          <Body>
            <Text style={{color:"white", fontSize: 20, marginLeft: -30 }}>Home</Text>
          </Body>
          <Right />
        </Header>
       

<View style={{ flexDirection: 'column', height: 35}}>
               <Root>
                <TouchableOpacity style={styles.sort}
                 onPress={this.handlePress,
                  () => ActionSheet.show({
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    //title: "Sort Post",
                  },
                    buttonIndex => { 
                      if(buttonIndex === 0)
                       {
                        this.recent()
                       }
                       else if(buttonIndex === 1)
                       {
                         this.pop()
                       }
                    }
                  )} >
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'center' }}>
                <FontAwesomeIcon icon={faAlignLeft} style={{ fontSize: 15, paddingBottom: 5, }} />
                <Text> Sort Post </Text>
                <FontAwesomeIcon icon={faSortDown } style={{ fontSize: 15, paddingBottom: 5, }} />
                </View>
                 </TouchableOpacity >
                 </Root>
                 </View>
            <TouchableHighlight  style={{ height:5,}} onPressOut = {this.fetchpostall}>
                        <Text></Text>
            </TouchableHighlight>
         <FlatList
          data={ this.state.dataSource }
          extraData={this.state.dataSource}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          ItemSeparatorComponent = {this.FlatListItemSeparator}
          renderItem=
          {({item}) => 
          <Content>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Thumbnail source={require('./images/photo.png')} />
                <Body>
                <Text style={{fontWeight: "bold"}}>{item.title}</Text>
                <View style={{flexDirection: "row"}}>  
                  {
                   item.anonymous === 'Anonymous' ? <Text style={{color:'black', fontSize: 12}}>Anonymous </Text> :  <Text style={{color:'black', fontSize: 12}}> {item.username}  </Text>
                  }
                   <Text note style={{color:'gray', fontSize: 12}}>
                   - {moment(item.created_at).format('MMMM Do YYYY, h:mm a')}
                  </Text>
                  </View>
                  {item.status == 1 ? <Text style={styles.statusStyle}><FontAwesomeIcon icon={faCheck} style={{fontSize: 15, color: "green"}}/> Noticed by USeP admin </Text> : <Text></Text> }
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={{fontSize: 13}}>
                {item.description}
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{height:55}}>
              <Left style={{ width: "100%", paddingLeft: "10%",borderTopWidth: 1, borderTopColor: "#ece9ea"}}> 
                <TouchableOpacity style={styles.likeStyle}
                 onPress={this.upvotePost.bind(this, item.id)}>
                  <View style={{flexDirection: "row"}}>
                  <FontAwesomeIcon icon={faChevronUp} style={{color: this.postcolorUpvoted(item), fontSize: 15}}/>
                  <Text style={{color: this.postcolorUpvoted(item), fontSize: 13}}> {item.upvote_count} </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                 onPress={this.downvotePost.bind(this, item.id)}>
                  <View style={{flexDirection: "row"}}>
                  <FontAwesomeIcon icon={faChevronDown} style={{color: this.postcolordownvoted(item), fontSize: 15}}/>
                  <Text style={{color: this.postcolordownvoted(item), fontSize: 13}}> {item.downvote_count} </Text>
                  </View>
                </TouchableOpacity>
                </Left>
              <Right style={{width: "100%", paddingRight: "10%",borderTopWidth: 1, borderTopColor: "#ece9ea"}}>
              <TouchableOpacity style={styles.commentStyle} onPress={this.OpenCommment.bind(this, item.id)}>
              <View style={{flexDirection: "row"}}>
                  <FontAwesomeIcon style={{color: "gray", paddingTop: 15, paddingRight: 5}} icon={faComment} />
                  <Text style={{color: "gray", fontSize: 13}}
                  > Comments</Text>
                  </View>
                </TouchableOpacity>
                </Right>
            </CardItem>
          </Card>
         
        </Content>
        
          }
          keyExtractor={(item, index) => index.toString()}
          />
        
       
        <View style={{ flexDirection: 'column', flex: 1, marginRight: 10 }}>
        <TouchableOpacity style={styles.add} onPress={() => this.props.navigation.navigate('CreatePage')}>
        <FontAwesomeIcon
                    icon={faPen} style={{color:'white', fontSize: 22}} />
        </TouchableOpacity>
        </View>

        <Footer style={styles.footer}>
          <FooterTab style={{backgroundColor:'white'}}>
            <Button>
            <FontAwesomeIcon
               icon={faHome } style={{color:'#A94C4C'}} />
              <Text>Home</Text>
            </Button>
            <Button  onPress={() => this.props.navigation.navigate('Profile')}>
            <FontAwesomeIcon style={{color:'gray'}} icon={faUser} />
              <Text>Profile</Text>
            </Button>
            <Button badge vertical onPress={() => this.props.navigation.navigate('Notification')}>
             {/* <Badge style={{backgroundColor: '#A94C4C', marginBottom: -15}}><Text style={{color: 'white', fontSize: 10}}>2</Text></Badge> */}
            <FontAwesomeIcon  style={{color:'gray'}} icon={faBell} />
                <Text> Notification</Text>
            </Button>
          </FooterTab>
        </Footer>
        
          </View>
          </Drawer>
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
  inputView:{
    width:"80%",
    backgroundColor:"#ffffff",
    borderRadius:25,
    height:50,
    justifyContent:"center",
    padding:20,
    marginTop:20
  },
  inputText:{
    height:50,
    color:"#5f5b5b"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  add:{
    width:"14%",
    backgroundColor:"#940000",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 15,
    
  },
  loginText:{
    color:"white"
  },
 
  Picker:
  {
      width: "50%",
      flexDirection: "row", 
  },
  logout:{
    width:"90%",
    backgroundColor:"#ff8080",
    borderRadius:5,
    height:40,
    alignItems:"center",
    justifyContent:"center",
    margin: 3,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ece9ea",
  },
  sort:{
    margin: 9,
  },
  sorttext:{
    color:"white",
    paddingLeft: 100,
    paddingRight: 100,
    paddingTop: 10,
    paddingBottom: 10,
  },
  likeStyle:
  {
    width:"20%",
    backgroundColor:"white",
    borderRadius:5,
    height:30,
    alignItems:"center",
    justifyContent:"center",
    margin: 7.5,
  },
  commentStyle:
  {
    width:"100%",
    backgroundColor:"white",
    borderRadius:5,
    height:30,
    alignItems:"center",
    justifyContent:"center",
    margin: 7.5,
  },
  statusStyle:
  {
    color: "green",
    padding: 0.5,
    fontWeight: "bold",

  },
});