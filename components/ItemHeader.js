import React, { useState, useEffect } from 'react';
import { Dimensions, ImageBackground, TouchableOpacity, StyleSheet, Text, View, Button, Image } from 'react-native';
import img_dictionary from '../data/img_dictionary';
import { Colors } from 'react-native-paper';

export function ItemHeader({item}) {

    const [endgameTags, setEndgameTags] = useState([])
    const [leftEndgameImg, setLeftEndgameImg] = useState(null)
    const [rightEndgameImg, setRightEndgameImg] = useState(null) 

    const [leftHeader, setLeftHeader] = useState(null)
    const [middleHeader, setMiddleHeader] = useState(null)
    const [rightHeader, setRightHeader] = useState(null)

    useEffect(()=>{
        if (item) {
            setEndgameTags(item.endgame_tags)
            if (item.rarity == 'normal') {
                setLeftHeader(img_dictionary['header-normal-left'])
                setMiddleHeader(img_dictionary['header-normal-middle'])
                setRightHeader(img_dictionary['header-normal-right'])
            }
            else if (item.rarity == 'magic') {
                setLeftHeader(img_dictionary['header-magic-left'])
                setMiddleHeader(img_dictionary['header-magic-middle'])
                setRightHeader(img_dictionary['header-magic-right'])
            }
            else {
                setLeftHeader(img_dictionary['header-rare-left'])
                setMiddleHeader(img_dictionary['header-rare-middle'])
                setRightHeader(img_dictionary['header-rare-right'])
            }

        }    
    }, [item])

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
            {   leftHeader
                ?   <ImageBackground 
                        source={leftHeader} 
                        style={styles.edge} 
                        imageStyle={{ resizeMode: 'stretch' }}>

                    {   leftEndgameImg 
                        ? <Image source={leftEndgameImg}/>
                        : null
                    } 
                    </ImageBackground>
                : null
            }
        
            {   middleHeader
                ?   <ImageBackground 
                        source={middleHeader} 
                        style={styles.center} 
                        imageStyle={{ resizeMode: 'stretch' }}>

                        {/* I was too anamored with whether I could, I never stopped to ask if I should. */}
                        {   item 
                            ?   item.rarity == 'rare'
                                ?   <View style={styles.center}>
                                        <Text style={styles.rare}>{item.name}</Text>
                                        <Text style={styles.rare}>{item.item_base.name}</Text>
                                    </View>
                                :   item.rarity == 'magic'
                                    ?   <Text style={styles.magic}>{item.name}</Text>
                                    :   item.rarity == 'normal'
                                        ? <Text style={styles.normal}>{item.item_base.name}</Text>
                                        : null
                            : null
                        }
                        </ImageBackground>
                    : null
                }

            {   rightHeader
                ?   <ImageBackground 
                        source={rightHeader} 
                        style={styles.edge} 
                        imageStyle={{ resizeMode: 'stretch' }}>

                        {   rightEndgameImg 
                            ? <Image source={rightEndgameImg}/>
                            : null
                        } 
                    </ImageBackground>
                : null
            }

        </View>
    )
}

var height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    edge: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleFrame: {
        flexDirection: 'row',
        // flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        height: height / 12,
        marginLeft: 10,
        marginRight: 10,
    },
    normal: {
        fontFamily: 'Fontin-SmallCaps',
        fontSize: 20,
        color: '#ffffff'
    },
    magic: {
        fontFamily: 'Fontin-SmallCaps',
        fontSize: 20,
        color: 'cyan',
        position: 'absolute',
    },
    rare: {
        fontFamily: 'Fontin-SmallCaps',
        fontSize: 20,
        color: Colors.yellow300
    },
    
});
