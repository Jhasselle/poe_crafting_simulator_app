import React, { useState, useEffect } from 'react';
import { Dimensions, ImageBackground, TouchableOpacity, StyleSheet, Text, View, Button, Image } from 'react-native';

const elder = require('../img/frame/title-frame-elder.png');
const shaper = require('../img/frame/title-frame-shaper.png');

// [{id: 1, name: 'billy witchdoctor', class: 'jewelry', base: 'iron ring', endGameType: null, src: require('../img/items/Rings/Ring1.png'), affixes: []}]


export function ItemHeader(props) {
    
    return (
        <View style={stylesTitleBar.titleFrame}>

            <ImageBackground source={require('../img/frame/title-frame-left.png')} style={stylesTitleBar.edge} imageStyle={{ resizeMode: 'stretch' }}>
                <Image source={shaper} />
            </ImageBackground>

            <ImageBackground source={require('../img/frame/title-frame.png')} style={stylesTitleBar.center} imageStyle={{ resizeMode: 'stretch' }}>
                <Text style={stylesTitleBar.text}>{props.item.name}</Text>
                <Text style={stylesTitleBar.text}>{props.item.base}</Text>
            </ImageBackground>

            <ImageBackground source={require('../img/frame/title-frame-right.png')} style={stylesTitleBar.edge} imageStyle={{ resizeMode: 'stretch' }}>
                <Image source={elder} />
            </ImageBackground>

        </View>
    )
}

var height = Dimensions.get('window').height;

const stylesTitleBar = StyleSheet.create({
    edge: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green'
    },
    titleFrame: {
        flexDirection: 'row',
        // flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        height: height / 12,
        marginLeft: 50,
        marginRight: 50,
    },
    text: {
        fontSize: 18,
        color: '#ff7'
    }
});
