import React, { Component } from 'react';
import { Switch, StyleSheet, View, Text, AsyncStorage, Dimensions, Image, TouchableOpacity, Alert, Modal, Keyboard } from 'react-native';
import User from './User';
import { Actions } from 'react-native-router-flux';
import { TextInput } from 'react-native-gesture-handler';
console.disableYellowBox = true;
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
import database from '@react-native-firebase/database';
import { FlatList } from 'react-native-gesture-handler';
import TextAvatar from 'react-native-text-avatar';
import Clickroom from './GroupInfo.js';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createRoomvisible: false,
      roomName: '',
      pass: '',
      roompass: '',
      LOCK_KEY: '',
      openRoomPass: '',
      rooms: [],
      lock_rooms: [],
      switch_toggle: false,
      switch_val: false,
      switch_text: 'Unlock Room',
      switch_text_color: 'red',
      groupPassModalVisible: false,
      checkRoomName: '',
      groupPassTextChange: true
    }
  }
  //creating encrypted room switch value change event 
  switchChange = (value) => {
    this.setState({ switchChange: value });
  }
  //get message event
  getData = () => {
    database().ref('rooms/odalar').on('child_added', (val) => {
      let room = val.val();
      this.setState((prevState) => {
        return {
          rooms: [...prevState.rooms, room]
        }
      })
    })
  }
  UNSAFE_componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow = () => {
  }
  _keyboardDidHide() {
  }
  componentWillMount() {
    this.getData();
    //console.log("işlem bitti");
  }
  
  componentDidMount() {
    //data from GroupMessage page for delete room
    Keyboard.dismiss();
    if (this.props.delRoom) {
      //Actions.refresh()
    }
    //Actions.refresh()
  }
  //"create room modal" visible change event
  changeRoomVisible = (visible) => {
    this.setState({ createRoomvisible: visible })
  }
  //To enter the password modal when entering encrypted room
  groupPassVisible = (visible) => {
    this.setState({ groupPassModalVisible: visible })
  }
  //creating room event
  createRoom = () => {
    //roomname and accound password are equal to ""(empty)
    if (this.state.roomName != '' && this.state.pass != '') {
      //account password and AsyncStore password if equeal
      if (this.state.pass == User._PASSWORD) {
        //encrypted room condition
        if (this.state.switch_val) {
          if (this.state.roompass.length > 2) {
            //set firebase with password
            database().ref('rooms/odalar').push().set({ creator_username: User._USERNAME, creator_phone: User._PHONE, roomname: this.state.roomName, lock: true, lock_key: this.state.roompass });
            this.setState({ createRoomvisible: false })
            Alert.alert("Congratulations!\n", this.state.roomName + " adlı odanız başarıyla kuruldu.")
          }
          else {
            Alert.alert("kurulum hatası");
          }
        }
        else {
          //set firebase without password
          database().ref('rooms/odalar').push().set({ creator_username: User._USERNAME, creator_phone: User._PHONE, roomname: this.state.roomName, lock: false, lock_key: null });
          this.setState({ createRoomvisible: false })
          Alert.alert("Congratulations!\n", this.state.roomName + " adlı odanız başarıyla kuruldu.")
        }
      }
      else {
        Alert.alert("ERROR PASSWORD", "Password is not correct!")
      }
    }
    else {
      Alert.alert("ERROR LENGTH", "LESS THAN 3 AND EQUAL TO 0");
    }
  }
  //produce random rgb color
  rGBtranslate() {
    //rastgele rgb renk üretme
    var r = Math.floor(Math.random() * 253);
    var g = Math.floor(Math.random() * 253);
    var b = Math.floor(Math.random() * 253);
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  //clicks and entering any created room
  goGroupMsg(roomName, userName, userPhone) {
    Clickroom.roomname = roomName;
    Clickroom.creatorname = userName;
    Clickroom.creatorphone = userPhone;
    Actions.GroupMsg();
  }
  extraction = (item) => {
    console.log("EXTRA ITEM: ", item.lock);
  }
  //room pass save to asyncstore
  asynStore = async (item) => {
    await AsyncStorage.setItem('' + item, _ROOM_PASS);
  }
  //entering the room where the password was previously entered
  groupActivation = async (_room_name, _lock_key, _creator) => {
    Clickroom.roomname = _room_name;
    Clickroom.creatorname = _creator;
    this.setState({ LOCK_KEY: _lock_key, })
    User._ROOM_PASSWORD = await AsyncStorage.getItem('' + _room_name);
    User._ENTEGRE_ROOM_USERNAME = await AsyncStorage.getItem('' + Clickroom.roomname + '/' + User._USERNAME)
    //store şifre boşsa veya kayıtlı olan store şifre ile oda şifresi uyuşmuyorsa, 
    if ((User._ROOM_PASSWORD != null && User._ROOM_PASSWORD == this.state.LOCK_KEY && User._ENTEGRE_ROOM_USERNAME == this.state.LOCK_KEY) || User._USERNAME == Clickroom.creatorname) {
      Actions.GroupMsg()
    }
    else {
      this.setState({ groupPassModalVisible: !this.state.groupPassModalVisible, checkRoomName: _room_name })
    }
  }
  //first entry into the room
  newMemberActivation = async () => {
    if (this.state.openRoomPass == this.state.LOCK_KEY) {
      User._ROOM_PASSWORD = await AsyncStorage.setItem('' + this.state.checkRoomName, this.state.LOCK_KEY);
      User._ENTEGRE_ROOM_USERNAME = await AsyncStorage.setItem('' + this.state.checkRoomName + '/' + User._USERNAME, this.state.LOCK_KEY);
      this.setState({ groupPassModalVisible: !this.state.groupPassModalVisible });
      Alert.alert("Unlock Room Key", "Welcome [" + User._USERNAME + "]!\nEnjoy chat");
      let date = new Date();
      let hour = date.getHours().toString();
      let minute = date.getMinutes().toString();
      //tek haneleri kontrol edip başına 0 atıyoruz.
      var restore_hour = hour.length === 1 ? "0" + hour.toString() : hour.toString();
      var restore_minute = minute.length === 1 ? "0" + minute.toString() : minute.toString();
      await database().ref('rooms/messages' + '/' + this.state.checkRoomName + '/').push().set({ from: "BOT", from_last: "KONTROL", from_phone: "NONE", message: User._USERNAME.charAt(0).toUpperCase() + User._USERNAME.slice(1).toLowerCase() + " " + User._LASTNAME.charAt(0).toUpperCase() + User._LASTNAME.slice(1).toLowerCase() + " aramıza katıldı. Kendisine bir merhaba deyin !", date: restore_hour + ':' + restore_minute });
      Actions.GroupMsg();
    }
    else {
      this.setState({ groupPassTextChange: false })
    }
  }
  //Change visibility by switch value
  roomPassBox = () => {
    if (this.state.switch_val) {
      return (
        <View style={{ flex: 4 }}>
          <TextInput
            placeholder=" Room Password"
            placeholderTextColor="gray"
            fontSize={13}
            backgroundColor="#dddddd"
            style={{ marginTop: 5, height: 35 }}
            onChangeText={input => this.setState({ roompass: input })}
            maxLength={15}
          />
        </View>
      )
    }
    else {
      return null
    }
  }
  //failed password attempts when entering any encrypted room
  groupPassControlText = () => {
    if (!this.state.groupPassTextChange) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
          <Text style={{ textAlign: 'center', fontSize: 16, color: 'red', fontWeight: 'bold' }}>Invalid Password</Text>
        </View>
      )
    }
    else {
      return null;
    }
  }
  //modal used to enter the encrypted room
  groupPassModal = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: 'center', fontSize: 18, color: '#1E90FF' }}>{this.state.checkRoomName}</Text>
        <TextInput
          keyboardType="url"
          placeholder=" Enter Room Key"
          placeholderTextColor="gray"
          backgroundColor="#dddddd"
          style={{ marginTop: 5 }}
          onChangeText={input => this.setState({ openRoomPass: input })}
          maxLength={25}
          autoFocus={true}
        />
        <View style={{ flex: 0.2 }}>
          {this.groupPassControlText()}
        </View>
        <View style={{ flex: 1, marginBottom: 50 }}>
          <TouchableOpacity style={styles.modalClickCompleteButton} onPress={() => this.state.openRoomPass === '' ? Alert.alert("Stop", "Password cannot be entered empty!") : this.newMemberActivation()}>
            <Text style={{ color: 'white', fontSize: 15 }}>Verification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalClickCompleteButton} onPress={() => this.setState({ groupPassModalVisible: !this.state.groupPassModalVisible })}>
            <Text style={{ color: 'white', fontSize: 15 }}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  //creating room modal
  modal = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{}}>Hello {User._USERNAME.charAt(0).toUpperCase() + User._USERNAME.slice(1).toLowerCase() + " " + User._LASTNAME.charAt(0).toUpperCase() + User._LASTNAME.slice(1).toLowerCase() + "!" + "\n" + "Kuracağın oda bilgilerini senden istiyoruz."}</Text>
        <TextInput
          keyboardType="url"
          placeholder=" Room Name"
          placeholderTextColor="gray"
          fontSize={13}
          backgroundColor="#dddddd"
          style={{ marginTop: 5, height: 35 }}
          onChangeText={input => this.setState({ roomName: input })}
          maxLength={25}
          autoFocus={true}
        />
        <TextInput
          placeholder=" Account Pasasword"
          placeholderTextColor="gray"
          fontSize={13}
          backgroundColor="#dddddd"
          style={{ marginTop: 5, height: 35 }}
          onChangeText={input => this.setState({ pass: input })}
          maxLength={15}
        />
        <View style={{ flex: 1, alignItems: 'flex-start', flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 12 }} onPress={() => this.setState({ switch_val: !this.state.switch_val })}>Encrypt Room</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#25d366" }}
              thumbColor={this.state.switch_val ? "#25d366" : "#f4f3f4"}
              onValueChange={(val) => this.setState({ switch_val: !this.state.switch_val })}
              value={this.state.switch_val}
              style={{ size: 10 }}
            />
          </View>
          {this.roomPassBox()}
        </View>
        <View style={{ flex: 3 }}>
          <TouchableOpacity style={styles.modalClickCompleteButton} onPress={() => this.createRoom()}>
            <Text style={{ color: 'white', fontSize: 15 }}>Lets Creat!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancelButton} onPress={() => this.changeRoomVisible(!this.state.createRoomvisible)}>
            <Text style={{ color: 'white', fontSize: 15 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  //main render 
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.01, backgroundColor: 'white' }}></View>
        <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E90FF', flexDirection: 'row' }}>
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => Actions.Main()}>
              <Image
                source={require('../src/p_lib/back.png')}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', marginRight: 55 }}>Join Another One!</Text>
          </View>
        </View>
        <View style={{ flex: 8 }}>
          <FlatList
            data={this.state.rooms}
            renderItem={
              ({ item }) => {
                //response room name is "DELETE"
                if (item.roomname == "DELETE") {
                  database().ref('rooms').child('odalar').on('value', (val) => {
                    //get room information from firebase
                    if (val.val() != null) {
                      var data = val.val();
                      var keys = Object.keys(val.val());                     
                      for (var i = 0; i < keys.length; i++) {                        
                        var iter = keys[i];                        
                        var room_name = data[iter].roomname;                       
                        if (room_name == "DELETE") {
                          //key[i] = registered room key
                          //we use room key for deleting
                          database().ref('rooms/odalar/' + keys[i]).remove();
                          Actions.Group()
                        }
                      }
                    }
                    else {
                      Alert.alert("Not found setup room")
                    }
                  })
                }
                else {
                  //if room is locked, add lock icon
                  if (item.lock) {
                    return (
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: width - 10, height: height * 0.1, marginTop: 5 }} onPress={() => this.groupActivation(item.roomname, item.lock_key, item.creator_username)}>
                          <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                              <TextAvatar
                                backgroundColor={this.rGBtranslate()}
                                textColor={'white'}
                                size={height < 600 ? 60 : 65}
                                type={'circle'}>
                                {item.roomname[0].toUpperCase() + item.roomname[1].toLowerCase()}
                              </TextAvatar>
                            </View>
                            <View style={{ flex: 4, justifyContent: 'center', flexDirection: 'row' }}>
                              <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon
                                  name="lock"
                                  backgroundColor="red"
                                  color="black"
                                  size={35}>
                                </Icon>
                              </View>
                              <View style={{ flex: 6, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={styles.roomNameText}>{"[" + item.roomname + "]"}</Text>
                                <Text style={styles.creatorNameText}>{"Creator: " + item.creator_username}</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: 'smoke', height: 1.5, width: width, marginLeft: width * 0.4 }}></View>
                      </View>
                    )
                  }
                  else {
                    return (
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: width - 10, height: height * 0.1, marginTop: 5 }} onPress={() => this.goGroupMsg(item.roomname, item.creator_username, item.creator_phone)}>
                          <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                              <TextAvatar
                                backgroundColor={this.rGBtranslate()}
                                textColor={'white'}
                                size={height < 600 ? 60 : 65}
                                type={'circle'}>
                                {item.roomname[0].toUpperCase() + item.roomname[1].toLowerCase()}
                              </TextAvatar>
                            </View>
                            <View style={{ flex: 4, justifyContent: 'center' }}>
                              <Text style={styles.roomNameText}>{"[" + item.roomname + "]"}</Text>
                              <Text style={styles.creatorNameText}>{"Creator: " + item.creator_username}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: 'smoke', height: 1.5, width: width, marginLeft: width * 0.4 }}></View>
                      </View>
                    )
                  }
                }
              }
            }
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={{ flex: 0.01, backgroundColor: 'white' }}></View>
          <View style={styles.createButtonView}>
            <TouchableOpacity onPress={() => this.changeRoomVisible(!this.state.createRoomvisible)} style={styles.createRoomButton}>
              <Text style={{ color: 'white' }}>Create New Room</Text>
            </TouchableOpacity>
          </View>
          <Modal
            style={styles.modalStyle}
            transparent={true}
            visible={this.state.createRoomvisible}>
            <View style={styles.modalfirstView}>
              <View style={styles.modalsecondView}>
                {this.modal()}
              </View>
            </View>
          </Modal>
          <Modal
            style={styles.modalStyle}
            transparent={true}
            visible={this.state.groupPassModalVisible}>
            <View style={styles.modalfirstView1}>
              <View style={styles.modalsecondView1}>
                {this.groupPassModal()}
              </View>
            </View>
          </Modal>
          <View style={{ flex: 0.01, backgroundColor: 'white' }}></View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  modalsecondView: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 30,
    flex: 1,
    borderRadius: 5,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalfirstView: {
    backgroundColor: '#000000aa',
    flex: 1,
    marginBottom: 0
  },
  modalsecondView1: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 10,
    flex: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalfirstView1: {
    backgroundColor: '#000000aa',
    flex: 1,
    marginBottom: 0,
  },
  createRoomButton: {
    height: 40,
    width: width - 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  createButtonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    height: 40
  },
  bottomContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  modalClickCompleteButton: {
    backgroundColor: 'green',
    width: width - 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  modalCancelButton: {
    backgroundColor: 'red',
    width: width - 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  roomNameText: {
    color: 'black',
    fontSize: 17,
    marginLeft: 10
  },
  creatorNameText: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 10
  }
})