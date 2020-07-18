import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, Image, Alert, TouchableOpacity, Dimensions, Keyboard, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import User from './User';
import ReversedList from './ReverseFlatlist';
import Clickroom from './GroupInfo.js';
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
var delRoom = false;
function rGBtranslate() {
    var r = Math.floor(Math.random() * 253);
    var g = Math.floor(Math.random() * 253);
    var b = Math.floor(Math.random() * 253);
    return "rgb(" + r + "," + g + "," + b + ")";
}
async function goBack() {
    await Actions.Group()
}
function backEvent() {
    database().ref('rooms/messages/' + Clickroom.roomname).remove();
    goBack()
}
export default class GroupMsg extends Component {
    constructor(props) {
        super(props);
        //this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state_change = this.state_change.bind(this);
        this.all_list = [];
        this.state = {
            auto_width: null,
            message: '',
            liste: [],
            send: '>>',
            keyboardVisible: false,
            _flex: 1,
            delRoom:false
        }
    }
    componentWillMount() {
        //BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        //this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        database().ref('rooms').child('messages').child(Clickroom.roomname).on('child_added', (val) => {
            this.setState((prevstate) => {
                return {
                    liste: [...prevstate.liste, val.val()]
                }
            })
        })
    }
    componentDidMount(){
        delRoom=false;
    }
    sendMessage = async () => {
        this.sendingSync();
    }
    sendingSync = async () => {
        //system time
        let date = new Date();
        let hour = date.getHours().toString();
        let minute = date.getMinutes().toString();
        //checked single digit for editing two digit (3:6 => 03:06 or 17:6 => 17:06)
        var restore_hour = hour.length === 1 ? "0" + hour.toString() : hour.toString();
        var restore_minute = minute.length === 1 ? "0" + minute.toString() : minute.toString();
        //group message send
        if (this.state.message.length != 0) {
            //set firebase
            database().ref('rooms/messages' + '/' + Clickroom.roomname + '/').push().set({ from: User._USERNAME, from_last: User._LASTNAME, from_phone: User._PHONE, message: this.state.message, date: restore_hour + ':' + restore_minute });
            this.setState({ message: '' });
        }
    }
    state_change() {
        this.setState({ liste: [] })
    }
    renderRow({ item }) {
        //message to welcome the newcomer to the room
        if (item.from == "BOT") {
            return (
                <View style={{
                    flexDirection: 'row',
                    width: '99%',
                    alignSelf: 'flex-start',
                    backgroundColor: '#ff4301',
                    borderRadius: 5,
                    marginBottom: 10,
                    marginTop: 12
                }}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <View style={{ flex: 3 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon
                                    name="star"
                                    backgroundColor="red"
                                    color="yellow"
                                    size={20}>
                                </Icon>
                                <Text style={{ color: 'yellow', fontSize: 15, marginLeft: 6, fontWeight: 'bold', textAlign: 'center' }}>{String(item.from) + " " + String(item.from_last)}</Text>
                                <Icon
                                    name="star"
                                    backgroundColor="red"
                                    color="yellow"
                                    size={20}>
                                </Icon>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: height < 600 ? 12 : 14, marginLeft: 6 }}>{item.message}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{ marginRight: 3 }}> {item.date}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        //if room creator delete room
        else if (item.from == "DELETE") {
            {
                delRoom=true;
                Actions.Group({ delRoom: delRoom })
            }
        }
        else {
            return (
                <View style={{
                    flexDirection: 'row',
                    width: '60%',
                    alignSelf: item.from === User._USERNAME ? 'flex-end' : 'flex-start',
                    backgroundColor: item.from === User._USERNAME ? '#dcf8c6' : 'white',
                    borderRadius: 5,
                    marginBottom: 10,
                    marginTop: 9
                }}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <View style={{ flex: 3 }}>
                            <Text style={{ color: rGBtranslate(), fontSize: 13, marginLeft: 6, fontWeight: 'bold' }}>{String(item.from).charAt(0).toUpperCase() + String(item.from).slice(1).toLowerCase() + " " + String(item.from_last).charAt(0).toUpperCase() + String(item.from_last).slice(1).toLowerCase()}</Text>
                            <Text style={{ color: 'black', fontSize: height < 600 ? 14 : 16, marginLeft: 6 }}>{item.message}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{ marginRight: 3 }}> {item.date}</Text>
                        </View>
                    </View>
                </View>
            )
        }
    }
    //back icon
    backToMain() {
        Keyboard.dismiss();
        Actions.Group();
    }
    //room creator delete room event
    adminDeleteRoom = () => {
        //database().ref('rooms/messages' + '/' + Clickroom.roomname + '/').remove();
        //database().ref('rooms/messages' + '/' + Clickroom.roomname + '/').
        database().ref('rooms').child('odalar').on('value', (val) => {
            if(val.val() != null)
            {
                var data = val.val();
                var keys = Object.keys(val.val());
                console.log(data.length);
                console.log("keys: ", keys)
                for (var i = 0; i < keys.length; i++) {
                    console.log("for içinde")
                    var iter = keys[i];
                    console.log("iter: ", iter);
                    var room_name = data[iter].roomname;
                    console.log("roomname: ", room_name)
                    console.log("clickroom: ", Clickroom.roomname)
                    if (room_name == Clickroom.roomname) {
                        console.log("enter the deleting event");
                        //deleting room
                        database().ref('rooms/odalar/' + keys[i]).remove();
                        //deleting all room messaage
                        database().ref('rooms/messages/' + Clickroom.roomname).remove()
                        //we set up a room with the "delete" tag. Then the screens of other users who see the room with the "delete" tag are refreshed page because
                        //because if the page doesn't refresh, the listed rooms stay the same
                        database().ref('rooms/odalar').push().set({ creator_username: null, creator_phone: null, roomname: "DELETE", lock: true, lock_key:"123333333333" });
                        console.log("deleting complete.");
                    }
                }
            }
            else{
                Alert.alert("There is no room")
            }
        })
    }
    //click room name and opening room detail
    roomDetail = () => {
        //Alert.alert(r_name+","+creator)
        //if room creator clicked
        if (Clickroom.creatorname == User._USERNAME) {
            Alert.alert(
                "ADMIN DETAILS",
                "You are the Admin of this room!",
                [
                    { text: "Cancel" },
                    {
                        text: "Clear All Messages(Coming Soon)",
                        style: "cancel"
                    }, {
                        text: "Delete Room",
                        onPress: () => this.adminDeleteRoom(),
                        style: 'destructive'
                    },
                ],
                { cancelable: false }
            );
        }
        //if clicked other user
        else {
            Alert.alert(
                "[" + Clickroom.roomname + "]" + " Detail",
                "Creator: " + Clickroom.creatorname + "\nYou are not authorized to edit rooms ",
                [
                    { text: "OK" }
                ],
                { cancelable: false }
            );
        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#204051' }}>
                <View style={{ flex: 1.2, backgroundColor: '#1E90FF', flexDirection: 'row' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => this.backToMain()}>
                            <Image
                                source={require('../src/p_lib/back.png')}
                                style={{ width: 25, height: 25 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.roomDetail()}>
                            <Text style={styles.roomNameText}>{"[" + Clickroom.roomname + "]"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 10, backgroundColor: '#e9e2d0' }}>
                    <ReversedList

                        style={{ padding: 10, height: height * 0.8, backgroundColor: '#204051' }}
                        data={this.state.liste}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={styles.messageSendContainer}>
                    <TextInput
                        style={styles.messageTextInput}
                        placeholder="Send Message"
                        onChangeText={(message) => this.setState({ message: message })}
                        value={this.state.message}
                        keyboardType="url"
                        autoFocus
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={() => this.sendMessage()}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{this.state.send}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    sendButton: {
        backgroundColor: '#25d366',
        width: 50,
        height: height * 0.075,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 120,
        marginLeft: 10,
        marginTop: 20
    },
    messageSendContainer: {
        flex: 1,
        backgroundColor: '#204051',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: width * 0.07
    },
    messageTextInput: {
        width: width * 0.8,
        height: 40,
        marginLeft: 5,
        backgroundColor: '#dddddd',
        borderRadius: 10,
        marginTop: 25
    },
    roomNameText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 50
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        backgroundColor: '#1E90FF',
        borderRadius: 20,
        width: width * 0.1,
        height: height * 0.055
    },
    messageSender: {
    }
})