import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ListView, Alert, FlatList, TouchableHighlight, ActionSheetIOS   } from 'react-native';
import { Container, Content, Icon, Right, Button, Input, Item, Picker, Form, Left, Card, CardItem, Thumbnail, Body, Footer, FooterTab, Label, ActionSheet, Root, Badge } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome,faUser,faBell, faPen, faUnlockAlt, faAngleDown, faCheck, faChevronUp, faComment, faChevronDown } from '@fortawesome/free-solid-svg-icons';


const url = 'http://192.168.254.112:8080/api/getRecentPost';
const url3 = 'http://192.168.254.112:8080/api/checkUpvotePost';
const url4 = 'http://192.168.254.112:8080/api/checkDownvotePost';

const url_upvotePost = 'http://192.168.254.112:8080/api/mobileUpvotePost';
const url_downvotePost = 'http://192.168.254.112:8080/api/mobileDownvotePost';

var BUTTONS = ["Delete Post"];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 2;

export default class profile extends Component {
    static navigationOptions = {
        title: 'Profile',
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
    username: '',
    isFetching: false,
    postId: '',
    voteIndicator: false,
    myids: [],
    myids2: [],

  };
}
_isMounted = false;

  getUserId = async () => {
    let userD = await AsyncStorage.getItem('userDetails');
    return userD;
  }
  

fetchmypostall = async () =>
{
  return fetch(url)
  .then((response) => response.json())
  .then((responseJson) => {
    let filteredResponseJson = responseJson.filter(mypost => mypost.username == this.state.username )
    let ids = responseJson.filter(id => id.id)
    this.setState({
      isLoading: false,
      dataSource: filteredResponseJson,
      isFetching: false,
      postId: ids,
    }, function() {
      // In this block you can do something with new state.
    });
  })
  .catch((error) => {
    console.error(error);
  });
}

componentDidMount() {
  this._isMounted = true;
  this.viewupvotedPost();
  this.viewdownvotedPost();
  this.getUserId().then((userD) => {
    this.setState({username: userD});
  })
}

onRefresh() 
  {
    this.setState({ isFetching: true }, 
      function() { 
        this.fetchmypostall();
        this.viewupvotedPost();
        this.viewdownvotedPost();
     });
  }

UNSAFE_componentWillMount()
  {
    this.fetchmypostall();
    this._isMounted = false;
  }


FlatListItemSeparator = () => {
  return (
    <View/>
  );
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

          this.fetchmypostall();
          this.viewupvotedPost();
          this.viewdownvotedPost();
        
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
    this.fetchmypostall();
    this.viewupvotedPost();
    this.viewdownvotedPost();
  }).catch((error) =>
  {
      console.error(error);
  });
}


OpenCommment(id) {
 this.props.navigation.navigate('PostComment', { getpostid: id });
}

postcolorupvoted(item)
{
  let headerColor = "gray";
  if(this.state.myids.map(i =>i.post_id).includes(item.id))
  {
    headerColor = "#940000";
  }
  else
  {
    headerColor = "gray";
  }
 return headerColor;
}

postcolordownvoted(item)
{
  let headerColor = "gray";
  if(this.state.myids2.map(i =>i.post_id).includes(item.id))
  {
    headerColor = "#940000";
  }
  else
  {
    headerColor = "gray";
  }
 return headerColor;
}

viewupvotedPost = async () =>
{
return fetch(url3)
  .then((response) => response.json())
  .then((responseJson) => {
    let filteredResponseJson = responseJson.filter(votes => votes.username == this.state.username )
    if (this._isMounted) {
    this.setState({
      myids: filteredResponseJson
    }, function() {
      // In this block you can do something with new state.
    });
  }
  })
  .catch((error) => {
    console.error(error);
  });
}


viewdownvotedPost = async () =>
{
return fetch(url4)
  .then((response) => response.json())
  .then((responseJson) => {
    let filteredResponseJson2 = responseJson.filter(votes => votes.username == this.state.username )
    if (this._isMounted) {
    this.setState({
      myids2: filteredResponseJson2
    }, function() {
      // In this block you can do something with new state.
    });
  }
  })
  .catch((error) => {
    console.error(error);
  });
}

deletepost = (id) =>
{
  fetch('http://192.168.254.112:8080/api/deleteMyPost',
  {
      method: 'POST',
      headers: 
      {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(
      {
        post_id: id
      })

  }).then((response) => response.text()).then(() =>
  {
    this.fetchmypostall();
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
             <View style={styles.view}> 
             <Form style={styles.content}>
             <Thumbnail source={require('./images/photo.png')} />
                <Text style={{marginTop:20, fontWeight: "bold"}}> {this.state.username}</Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{alignItems: 'center', marginTop: 10, flex: 0.5, borderRightWidth: .5}}>
                  <TouchableOpacity style={{ alignItems: 'center'}}
                 onPress={() => this.props.navigation.navigate('CreatePage')} >
                 <FontAwesomeIcon style={{color:'#A94C4C'}} size={24} icon={faPen} />
                   <Text style={{fontSize:10}}>Create Post</Text>
                   </TouchableOpacity>
                   </View>
                  <View style={{alignItems:'center',  marginTop:10, flex: 0.5}}>
                  <TouchableOpacity style={{ alignItems: 'center'}}
                  onPress={() => this.props.navigation.navigate('Change_pass')}>
                   <FontAwesomeIcon style={{color:'#A94C4C'}} size={24} icon={faUnlockAlt} />
                 
                  <Text style={{fontSize:10}}>Change Password</Text>
                  </TouchableOpacity>
                  </View>
                </View>
                </Form>
              </View>
                 <TouchableHighlight style={{ height: 0.1}} onPressOut = {this.fetchpostall}>
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
              <View style={{width:"5%"}}>
              <Right>
              <Root>
                <TouchableOpacity
                onPress={this.handlePress,
                  () => ActionSheet.show({
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    title: "Manage Post",
                  },
                    buttonIndex => { 
                      if(buttonIndex === 0)
                      {
                        this.deletepost(item.id)
                      }
                    }
                  )} style={{width:25}}>
              <FontAwesomeIcon icon={faAngleDown} style={{fontSize: 21, color: "black"}}/>
               </TouchableOpacity>
               </Root>
              </Right>
              </View>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={{fontSize: 13}}>
                {item.description}
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{height:55}}>
              <Left style={{width: "100%", paddingLeft: "10%",borderTopWidth: 1, borderTopColor: "#ece9ea"}}>
              <TouchableOpacity style={styles.likeStyle}
                onPress={this.upvotePost.bind(this, item.id)}>
                  <View style={{flexDirection: "row"}}>
                  <FontAwesomeIcon icon={faChevronUp} style={{color: this.postcolorupvoted(item), fontSize: 15}}/>
                  <Text style={{color: this.postcolorupvoted(item), fontSize: 13}}> {item.upvote_count} </Text>
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
              <Right style={{ width: "100%", paddingRight: "10%",borderTopWidth: 1, borderTopColor: "#ece9ea"}}>
              <TouchableOpacity style={styles.commentStyle} onPress={this.OpenCommment.bind(this, item.id)}>
              <View style={{flexDirection: "row"}}>
                  <FontAwesomeIcon style={{color:'gray', paddingTop: 15, paddingRight: 5}} icon={faComment} />
                  <Text style={{color:'gray', fontSize: 13}}
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
        <Footer style={styles.footer}>
          <FooterTab style={{backgroundColor:'white'}}>
            <Button onPress={() => this.props.navigation.navigate('Home')}>
            <FontAwesomeIcon
               icon={faHome } style={{color:'gray'}} />
              <Text>Home</Text>
            </Button>
            <Button >
            <FontAwesomeIcon style={{color:'#A94C4C'}} icon={faUser} />
              <Text>Profile</Text>
            </Button>
            <Button badge vertical onPress={() => this.props.navigation.navigate('Notification')}>
             {/* <Badge style={{backgroundColor: '#A94C4C', marginBottom: -15}}><Text style={{color: 'white', fontSize: 10}}>2</Text></Badge> */}
               <FontAwesomeIcon  style={{color:'gray'}} icon={faBell} />
                <Text> Notification</Text>
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
    footer: {
      borderTopWidth: 1,
      borderTopColor: "#ece9ea",
    }
});