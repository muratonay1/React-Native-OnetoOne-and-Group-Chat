import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Image, TouchableOpacity, Dimensions,Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FlatList } from 'react-native-gesture-handler';
import User from './User';
import database from '@react-native-firebase/database';
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
require('react-native').unstable_enableLogBox();
console.disableYellowBox = true;
import Clickuser from './Connect';
import TextAvatar from 'react-native-text-avatar';
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            createRoomvisible: false,
            bottomSelectTextColor: '',
            bottomSelectButtonRadius: 20,
            bottonButtonBackColor: 'lightcyan',
            w: 40,
            h: 40
        }
    }
    //get user data from firebase
    getData = () => {
        database().ref('users').on('child_added', (val) => {
            let person = val.val();
            //remove ourselves from registered users
            if (person.phone == User._PHONE && person.username == User._USERNAME && person.lastname == User._LASTNAME) {
                User._USERNAME = person.username;
                User._PHONE = person.phone;
                User._LASTNAME = person.lastname
            }
            else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
            console.log("USERS: ", this.state.users);
        })
    }
    componentWillMount() {
        this.getData();
        console.log("işlem bitti");
    }
    //click user, and go to Message page
    goToChat(n, p, l) {
        //save cliked user information
        Clickuser.username = n;
        Clickuser.phone = p;
        Clickuser.lastname = l;
        Actions.Msg();
    }
    //random rgb color
    rGBtranslate() {
        var r = Math.floor(Math.random() * 253);
        var g = Math.floor(Math.random() * 253);
        var b = Math.floor(Math.random() * 253);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#1E90FF" />
                <View style={{ flex: 1, backgroundColor: '#1E90FF', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TextAvatar
                            backgroundColor={'white'}
                            textColor={'gray'}
                            size={50}
                            type={'circle'}>
                            {User._USERNAME[0].toUpperCase() + " " + User._LASTNAME[0].toUpperCase()}
                        </TextAvatar>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 3 }}>
                        <View style={{ justifyContent: 'flex-end' }}>
                            <Text style={{ marginLeft: 10, textAlign: 'right', color: 'white' }}>Your F/L Name:</Text>
                            <Text style={{ marginLeft: 10, textAlign: 'right', color: 'white' }}>Your Phone:</Text>
                        </View>
                        <View>
                            <Text style={{ marginLeft: 10, color: '#204051' }}>{User._USERNAME.charAt(0).toUpperCase() + User._USERNAME.slice(1).toLowerCase()} {User._LASTNAME.charAt(0).toUpperCase() + User._LASTNAME.slice(1).toLowerCase()}</Text>
                            <Text style={{ marginLeft: 10, color: '#204051' }}>{User._PHONE}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.7, justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => Actions.Setting()}>
                            <Image
                                source={require('../src/p_lib/setting.png')}
                                style={{ width: this.state.w, height: this.state.h, marginRight: 15 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightcyan' }}>
                    <Text>Contact List</Text>
                </View>
                <View style={{ flex: 8, backgroundColor: 'white' }}>
                    <FlatList
                        data={this.state.users}
                        renderItem={
                            ({ item }) => {
                                return (
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <TouchableOpacity style={{ width: width - 10, height: height * 0.1, marginTop: 5 }} onPress={() => this.goToChat(item.username, item.phone, item.lastname)}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <TextAvatar
                                                        backgroundColor={this.rGBtranslate()}
                                                        textColor={'white'}
                                                        size={height < 600 ? 60 : 65}
                                                        type={'circle'}>
                                                        {item.username[0].toUpperCase() + " " + item.lastname[0].toUpperCase()}
                                                    </TextAvatar>
                                                </View>
                                                <View style={{ flex: 4, justifyContent: 'center' }}>
                                                    <Text style={{ color: 'black', fontSize: 17, marginLeft: 10 }}>
                                                        {item.username.charAt(0).toUpperCase() + item.username.slice(1).toLowerCase()} {item.lastname.charAt(0).toUpperCase() + item.lastname.slice(1).toLowerCase()}</Text>
                                                    <Text style={{ color: 'gray', fontSize: 12, marginLeft: 10 }}>{item.phone}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ backgroundColor: 'smoke', height: 1.5, width: width, marginLeft: width * 0.4 }}></View>
                                    </View>
                                )
                            }
                        }
                    />
                </View>
                <View style={{ width: width, flex: 0.8, backgroundColor: 'beige', flexDirection: 'row' }}>
                    <View style={{ flex: 0.01, backgroundColor: 'white' }}></View>
                    <View style={{ flex: 1, marginBottom: 5 }}>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#1E90FF', textAlign: 'center', justifyContent: 'center' }} onPress={() => Actions.Group()}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>
                                See All Social Groups
                    </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.01, backgroundColor: 'white' }}></View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        position: "absolute",
        backgroundColor: '#fff',
        height: height * 0.5
    }
})
