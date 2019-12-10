import React, { useState, useEffect } from 'react';
import { Dimensions, ImageBackground, TouchableOpacity, StyleSheet, Text, View, Button, Image } from 'react-native';
import img_dictionary from '../data/img_dictionary';

export function ItemHeader(props) {

    const [endgameTags, setEndgameTags] = useState([])
    const [leftEndgameImg, setLeftEndgameImg] = useState(null)
    const [rightEndgameImg, setRightEndgameImg] = useState(null) 

    useEffect(()=>{
        if (props.item) {
            setEndgameTags(props.item.endgame_tags)
        }    
    }, [props])

    useEffect(()=>{
        if (endgameTags.length == 1) {
            setLeftEndgameImg(img_dictionary[endgameTags[0]])
            setRightEndgameImg(img_dictionary[endgameTags[0]])
        }
        // Will be used for 3.9 endgame types
        else if (endgameTags.length == 2) {
            setLeftEndgameImg(img_dictionary[endgameTags[0]])
            setRightEndgameImg(img_dictionary[endgameTags[1]])
        }
    }, [endgameTags])


    
    return (
        <View style={styles.titleFrame}>
            <ImageBackground 
                source={require('../img/frame/title-frame-left.png')} 
                style={styles.edge} 
                imageStyle={{ resizeMode: 'stretch' }}>

                {leftEndgameImg ? <Image source={leftEndgameImg}/>
                : null} 

            </ImageBackground>

            <ImageBackground source={require('../img/frame/title-frame.png')} style={styles.center} imageStyle={{ resizeMode: 'stretch' }}>
                {/* <Text style={stylesTitleBar.text}>{props.item.name}</Text>
                <Text style={stylesTitleBar.text}>{props.item.base}</Text> */}
                {props.item ? (
                    <Text style={(props.item.rarity == 'normal') ? styles.normal : (props.item.rarity == 'magic') ? styles.magic : styles.rare}>
                        {props.item.name} {props.item.item_base.name}
                    </Text>
                ) : null}

            </ImageBackground>

            <ImageBackground 
                source={require('../img/frame/title-frame-right.png')} 
                style={styles.edge} 
                imageStyle={{ resizeMode: 'stretch' }}>

                {rightEndgameImg ? <Image source={rightEndgameImg}/>
                : null} 
                
            </ImageBackground>

        </View>
    )
}

var height = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
    normal: {
        fontSize: 18,
        color: '#ffffff'
    },
    magic: {
        fontSize: 18,
        color: 'blue'
    },
    rare: {
        fontSize: 18,
        color: 'yellow'
    },
});
