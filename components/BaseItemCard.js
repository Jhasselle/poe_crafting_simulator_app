import React, { useEffect } from 'react';
import { Dimensions, TouchableHighlight, StyleSheet, ImageBackground, Image, View } from 'react-native';
import { Avatar, Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import img_dictionary from '../data/img_dictionary'
import { ItemHeader } from '../components/ItemHeader';

export function BaseItemCard({item, navigation}) {
    useEffect(()=>{
    })
        
    return (
        <TouchableHighlight 
            onPress={() => navigation.navigate('Loading', {'item_uid': item.uid})}
            style={styles.center}>
            
            <ImageBackground 
                source={img_dictionary['item-feed-background']} 
                style={styles.center}
                imageStyle={{ resizeMode: 'stretch' }}>

            <Card style={{backgroundColor: 'rgba(0, 0, 0, 0.0)'}}>
                <Card.Title 
                    styles={{paddingRight: 40}}
                    title={
                        <Text style={styles.text}>
                            {item.rarity == 'rare'
                                ?   item.name + ' ' + item.item_base.name
                                :   item.rarity == 'magic'
                                    ?   item.name
                                    :   item.rarity == 'normal'
                                        ? item.item_base.name
                                        : null
                            }
                        </Text>
                    } 
                    subtitle={item.item_base.item_class}
                    right={() => <View style={{paddingRight: 20}}>
                        {item.endgame_tags.length >= 1 
                            ? <Image source={img_dictionary[item.endgame_tags[0]]}/>
                            : null
                        }
                        {item.endgame_tags.length == 2 
                            ? <Image source={img_dictionary[item.endgame_tags[1]]}/>
                            : null
                        }
                    </View>
                    } 
                />
                </Card>
            </ImageBackground>
        </TouchableHighlight>
    );
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
        alignItems: 'stretch',
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
        fontSize: 18,
        color: '#ffffff'
    },
    magic: {
        fontSize: 18,
        color: 'cyan',
        position: 'absolute',
    },
    rare: {
        fontSize: 18,
        color: 'yellow'
    },
    text: {
        fontFamily: 'Fontin-SmallCaps',
    }
});