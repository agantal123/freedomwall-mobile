import React, { Component } from "react";

import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, FlatList, TouchableHighlight, LogBox } from 'react-native';
import { Container, Content, Left, Card, CardItem, Thumbnail, Body, Root, ActionSheet } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faChevronUp, faChevronDown, faEllipsisH, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const viewFullpost = 'http://192.168.254.114:8080/api/viewFullpost';
const view_comment = 'http://192.168.254.114:8080/api/view_comment';

const checkUpvotePost = 'http://192.168.254.114:8080/api/checkUpvotePost';
const checkDownvotePost = 'http://192.168.254.114:8080/api/checkDownvotePost';

const store_comment = 'http://192.168.254.114:8080/api/store_comment';
const deleteMyComment = 'http://192.168.254.114:8080/api/deleteMyComment';

const url_upvotePost = 'http://192.168.254.114:8080/api/mobileUpvotePost';
const url_downvotePost = 'http://192.168.254.114:8080/api/mobileDownvotePost';

var BUTTONS = ["Delete Comment"];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 2;

export default class postComment extends Component {
    static navigationOptions = {
        title: 'View Post',
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
    ActivityIndicator_Loading: false,
    post_id: '',
    title: '',
    description: '',
    date: '',
    anon: '',
    userpost: '',
    comment: '',
    username: '',
    upvote_count: '',
    downvote_count: '',
    isFetching: false,
    isLoading2: false,
    arrayHolder: [],
    dataSource: [],
    text: '',
    voteIndicator: false,
    myids: [],
    myids2: [],
    mypost: '',
  };
}

_isMounted = false;

UNSAFE_componentWillMount()
{
    this.fetchcommentall();
    this.fetchmypostall();
    this._isMounted = false;
}

componentDidMount() {
  this._isMounted = true;
  this.viewupvotedPost();
  this.viewdownvotedPost();
  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
}

fetchmypostall = async () =>
{
  fetch(viewFullpost, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
       
          id: this.props.navigation.state.params.getpostid
        })
      }).then((response) => response.json())
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                mypost: responseJson,
                post_id: responseJson.id,
                title: responseJson.title,
                description: responseJson.description,
                date: responseJson.created_at,
                anon: responseJson.anonymous,
                userpost: responseJson.username,
                upvote_count: responseJson.upvote_count,
                downvote_count: responseJson.downvote_count,
                status: responseJson.status,
              })
              
            }).catch((error) => {
              console.error(error);
            });

            this.getUserId().then((userD) => {
              this.setState({username: userD});
            })  
}

onRefresh() {
  this.setState({ isFetching: true }, 
    function() { 
       this.fetchcommentall();
       this.viewupvotedPost();
      this.viewdownvotedPost();
    });
}

fetchcommentall = async () =>
{
  return fetch(view_comment)
  .then((response) => response.json())
  .then((responseJson) => {
    let filteredResponseJson = responseJson.filter(comments => comments.post_id == this.props.navigation.state.params.getpostid )
   // let ids = responseJson.filter(id => id.id)
    this.setState({
      isLoading2: false,
      dataSource: filteredResponseJson,
      isFetching: false,
     // postId: ids,
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
<View
  style={{
    height: 1,
    width: "100%",
    backgroundColor: "white",
  }}
/>
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
    this.this.fetchmypostall();
    this.viewupvotedPost(); 
    this.viewdownvotedPost();
  }).catch((error) =>
  {
      console.error(error);
  });
}


deletecomment = (id) =>
{
  fetch(deleteMyComment,
  {
      method: 'POST',
      headers: 
      {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(
      {
        comment_id: id,
        username : this.state.username,

      })
  }).then((response) => response.text()).then(() =>
  {
    this.fetchcommentall();
  }).catch((error) =>
  {
      console.error(error);
  });
}

postcolorupvoted()
{
  let headerColor = "gray";
  if(this.state.myids.map(i =>i.post_id).includes(this.state.post_id))
  {
    headerColor = "#940000";
  }
  else
  {
    headerColor = "gray";
  }
 return headerColor;
}

postcolordownvoted()
{
  let headerColor = "gray";
  if(this.state.myids2.map(i =>i.post_id).includes(this.state.post_id))
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
return fetch(checkUpvotePost)
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
return fetch(checkDownvotePost)
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



getUserId = async () => {
  let userD = await AsyncStorage.getItem('userDetails');
  return userD;
}

PostaComment = () =>
 {
  this.setState({ ActivityIndicator_Loading : true }, () =>
  {
   fetch(store_comment,
      {
          method: 'POST',
          headers: 
          {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
          {
            comment : this.state.comment,
            username : this.state.username,
            post_id: this.props.navigation.state.params.getpostid,
          })

      }).then((response) => response.text()).then(() =>
      {

          this.setState({ ActivityIndicator_Loading : false  });

         this.fetchcommentall();
         this.attendee.setNativeProps({ text: '' })
         this.setState({comment: ''});
      }).catch((error) =>
      {
          console.error(error);
          this.setState({ ActivityIndicator_Loading : false});
      });
  });
 }
   render() {
    
    if (this.state.isLoading) {
        return (
          <View style={{flex: 1, paddingTop:20}}>
            <ActivityIndicator />
          </View>
        );
      }
      
      // const getdate = this.state.date;
      // const post_date = moment(getdate).startOf('second').fromNow();
      return (
    <View style={{flex:1, backgroundColor: "white"}}>
          <Content>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Thumbnail source={require('./images/photo.png')} />
                <Body>
                <Text style={{fontWeight: "bold"}}>{this.state.title}</Text>
                <Text note style={{color:'gray', fontSize: 12}}>
                   {this.state.anon == '' ? <Text>{this.state.userpost} </Text> : <Text style={{color:'black', fontSize: 12}}>Anonymous</Text> } 
                   - {moment(this.state.date).format('MMMM Do YYYY, h:mm a')}
                  </Text>
                  {this.state.status == 1 ? <Text style={styles.statusStyle}><FontAwesomeIcon icon={faCheck} style={{fontSize: 15, color: "green"}}/> Noticed by USeP admin </Text> : <Text></Text> }
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={{fontSize: 13}}>
                {this.state.description}
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <TouchableOpacity style={styles.likecomment}
                onPress={this.upvotePost.bind(this, this.state.post_id)}>
                  <View style={{flexDirection: "row"}}>
                  <FontAwesomeIcon icon={faChevronUp} style={{color: this.postcolorupvoted(this.state.post_id), fontSize: 15}}/>
                  <Text style={{color: this.postcolorupvoted(this.state.post_id), fontSize: 13}}> {this.state.upvote_count} </Text>
                  </View>
                </TouchableOpacity>

                
                <TouchableOpacity style={styles.likecomment}
                onPress={this.downvotePost.bind(this, this.state.post_id)}>
                  <View style={{flexDirection: "row"}}>
                  <FontAwesomeIcon icon={faChevronDown} style={{color: this.postcolordownvoted(this.state.post_id), fontSize: 15}}/>
                  <Text style={{color: this.postcolordownvoted(this.state.post_id), fontSize: 13}}> {this.state.downvote_count} </Text>
                  </View>
                </TouchableOpacity>
              </Left>
            </CardItem>
          </Card>
        
      <View style={{flex: 1}}>
       <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: "white"}}>
        <Text style={{fontWeight: "bold"}}>Comments</Text>
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "white"}}>     
            <View style={styles.inputView} >
            <TextInput  
                style={styles.inputText}
                placeholder="Write comment here" 
                placeholderTextColor="#5f5b5b"
                onChangeText={text => this.setState({comment:text})}
                autoCapitalize="none"
                ref={element => {
                  this.attendee = element
                }}
                />
            </View>
                <View style={styles.sendView}>
                {this.state.comment !== '' ? 
                <TouchableOpacity onPress={this.PostaComment}>
                <FontAwesomeIcon icon={faPaperPlane} style={{color: "#ff8080", fontSize: 30}}/>
                </TouchableOpacity>
                : <Text></Text> }
                 </View>
          </View> 
               <View>
               <FlatList
                  data={ this.state.dataSource }
                  extraData={this.state.dataSource}
                  onRefresh={() => this.onRefresh()}
                  refreshing={this.state.isFetching}
                  ItemSeparatorComponent = {this.FlatListItemSeparator}
                  renderItem=
                  {({item}) => 
                  
                    <CardItem>
                      <Left style={{marginRight:10}}>
                        <Thumbnail style={{width: 35, height: 35}} source={require('./images/photo.png')} />
                        <Body>
                        <View style={{ flexDirection: "row" }}>     
                        <Text style={{fontWeight: "bold", fontSize: 12}}>{item.username} - </Text>
                        <Text style={{fontSize: 12}}>{moment(item.created_at).format('MMMM Do YYYY, h:mm a')}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignContent: "center"}}>
                        <View style={styles.commentView} >
                        <Text note style={{color:'gray'}}> {item.comment_content}</Text>
                        </View>
                        <View style={{ alignContent: "center", justifyContent: "center"}}>
                        {item.username == this.state.username ?
                         <View>
                          <Root>
                          <TouchableOpacity
                            onPress={this.handlePress,
                              () => ActionSheet.show({
                                options: BUTTONS,
                                cancelButtonIndex: CANCEL_INDEX,
                                destructiveButtonIndex: DESTRUCTIVE_INDEX,
                                title: "Manage Comment",
                              },
                                buttonIndex => { 
                                  if(buttonIndex === 0)
                                  {
                                    this.deletecomment(item.id)
                                  }
                                }
                              )} style={{width:20}}>
                          <Text>&nbsp;
                          <FontAwesomeIcon style={{color: "gray"}} size={15} icon={faEllipsisH} />
                          </Text> 
                          </TouchableOpacity>
                          </Root>
                          </View>
                           : <Text></Text> }
                        </View>
                        </View>
                        </Body>
                      </Left>
                    </CardItem>
                  
                
                  }
                  keyExtractor={(item, index) => item.id}
                  />
                  </View>
                  
        </View>
        </Content>
    </View>

     
       )
   }
}
const styles = StyleSheet.create({
    container: {
      //alignItems: 'center',
    },
    inputView:{
        width:"85%",
        backgroundColor:"#ededed",
        borderRadius:10,
        height:50,
        justifyContent:"center",
        padding:20,
        marginTop:10,
        marginLeft: 10,
      },
      commentView:{
       
        backgroundColor:"#ededed",
        borderRadius:10,
        padding:8,
      
      },
      sendView:{
         width:"15%",
      // backgroundColor:"#ededed",
      // borderRadius:10,
        height:50,
        justifyContent:"center",
        padding:5,
        marginTop:10
      },
      inputText:{
        height:50,
        color:"#5f5b5b"
      },
      statusStyle:
     {
    color: "green",
    padding: 0.5,
    fontWeight: "bold",
    },
    likecomment:
    {
  
    backgroundColor:"white",
    borderRadius:5,
    height:30,
    margin: 7.5,
    },
    
});