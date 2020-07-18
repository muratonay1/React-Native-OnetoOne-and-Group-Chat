import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, Image, Alert, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
import database from '@react-native-firebase/database';
import User from './User';
import ReversedList from './ReverseFlatlist';
import Clickuser from './Connect';
export default class Msg extends Component {
    constructor(props) {
        super(props);
        this.all_list = [];
        this.state = {
            auto_width: null,
            message: '',
            liste: [],
            send: '>>',
            keyboardVisible: false,
            _flex: 1,
        }
    }
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        database().ref('messages').child(User._PHONE).child(Clickuser.phone).on('child_added', (val) => {
            //Unique key ile gelen mesaj listesini unique keyden ayırıp state listemize atıyoruz.
            this.setState((prevstate) => {
                return {
                    liste: [...prevstate.liste, val.val()]
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
        if(this.state.message.trim().length != 0)
        {
            //set firebase our save and connect user are save
            database().ref('messages/' + User._PHONE + '/' + Clickuser.phone + '/').push().set({ from: User._USERNAME, from_phone: User._PHONE, target_phone: Clickuser.phone, message: this.state.message, date: restore_hour + ':' + restore_minute });
            database().ref('messages/' + Clickuser.phone + '/' + User._PHONE + '/').push().set({ from: User._USERNAME, from_phone: User._PHONE, target_phone: Clickuser.phone, message: this.state.message, date: restore_hour + ':' + restore_minute });
            this.setState({ message: '' });
        }
    }
    renderRow({ item }) {
        return (
            <View style={{
                flexDirection: 'row',
                width: '60%',
                alignSelf: item.from === User._USERNAME ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User._USERNAME ? '#4285F4' : '#F4B400',
                borderRadius: 5,
                marginBottom: 10
            }}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <View style={{ flex: 3 }}>
                        <Text style={{ color: 'white', padding: 7, fontSize: 16 }}>
                            {item.message}
                        </Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={{ marginRight: 3 }}> {item.date}</Text>
                    </View>
                </View>
            </View>
        )
    }
    backToMain() {
        Keyboard.dismiss();
        Actions.Main()
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1.2, backgroundColor: '#1E90FF', flexDirection: 'row' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5, backgroundColor: '#1E90FF', borderRadius: 20, width: width * 0.1, height: height * 0.055 }}
                            onPress={() => this.backToMain()}>
                            <Image
                                source={require('../src/p_lib/back.png')}
                                style={{ width: 25, height: 25 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 50 }}>{Clickuser.username} {Clickuser.lastname}</Text>
                    </View>
                </View>
                <View style={{ flex: 10, backgroundColor: '#e9e2d0' }}>
                    <ReversedList
                        style={{ padding: 10, height: height * 0.8, backgroundColor: 'white' }}
                        data={this.state.liste}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', marginBottom: width * 0.05 }}>
                    <TextInput
                        style={{ width: width * 0.8, height: 40, marginLeft: 5, backgroundColor: '#dddddd', borderRadius: 10 }}
                        placeholder="Send Message"
                        onChangeText={(message) => this.setState({ message: message })}
                        value={this.state.message}
                        keyboardType="url"
                        autoFocus
                    />
                    <TouchableOpacity
                        style={{ backgroundColor: 'green', width: 50, height: height * 0.065, justifyContent: 'center', alignItems: 'center', borderRadius: 120, marginLeft: 10 }}
                        onPress={() => this.sendMessage()}>
                        <Text style={{ color: 'white' }}>{this.state.send}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}