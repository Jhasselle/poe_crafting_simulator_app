import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, TouchableOpacity, ScrollView, View } from 'react-native';
import { AppBar, Avatar, Button, Divider, Colors, DarkTheme, List, Text, Checkbox, Provider as PaperProvider } from 'react-native-paper';
import Store from '../store/store';
import endgame_tags from '../data/endgame_tags';
import img_dictionary from '../data/img_dictionary';

// import base_items from '../data/base_items';


export function ItemEndgameSelection(props) {

    const [store] = useState(Store.getInstance())
    const [base_item] = useState(props['navigation']['state']['params']['item_base'])
    const [selectedEndgameTags, setSelectedEndgameTags] = useState([])
    const [itemImage, setItemImage] = useState(null)

    useEffect(() => {
        setItemImage(img_dictionary[base_item.visual_identity.id])
    },[props])

    const navigationCallback = (item_uid) => {
        props.navigation.navigate('Loading', { 'item_uid': item_uid });
    }

    const createItem = () => {
        let tags = []
        let new_base_item = { ...base_item }

        for (let i = 0; i < selectedEndgameTags.length; i++) {
            tags.push(endgame_tags[new_base_item.item_class][selectedEndgameTags[i]])
        }

        new_base_item.tags = tags.concat(new_base_item.tags)
        store.createItem(new_base_item, selectedEndgameTags, navigationCallback)
    }

    

    const addTag = (endgameType) => {
        let result = []

        if (selectedEndgameTags.includes(endgameType)) {
            result = selectedEndgameTags.slice()
            let index = result.indexOf(endgameType)
            result.splice(index, 1)
        }
        else {
            if (endgameType == 'shaper' || endgameType == 'elder') {
                if (!selectedEndgameTags.includes(endgameType)) {
                    result = [endgameType]
                }
                
            }
            else {
                if (selectedEndgameTags.includes('shaper') || selectedEndgameTags.includes('elder')) {
                    result = [endgameType]
                }
                // 
                // // This is for 3.9 endgame types, uncomment when new item affixes are released
                // /
                // else if (selectedEndgameTags.length <= 1) {
                //     result = [...selectedEndgameTags, endgameType]
                // }
                // else {
                //     result = [selectedEndgameTags[1]]
                //     result.push(endgameType)
                // }
            }
        }

        setSelectedEndgameTags(result)
    }

    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>
                <View style={styles.itemBox}>
                    <Text>{base_item.name}</Text>
                    {itemImage ? <Image source={itemImage}/>
                    : null}
                </View>
                <View style={styles.endGameTypeTray}>
                    <View style={styles.row}>
                        <TouchableOpacity style={(selectedEndgameTags.includes('shaper')) ? styles.on : styles.off} onPress={() => addTag('shaper')}>
                            <Text>Shaper</Text>
                            <Image source={img_dictionary['shaper']}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={(selectedEndgameTags.includes('elder')) ? styles.on : styles.off} onPress={() => addTag('elder')}>
                            <Text>Elder</Text>
                            <Image source={img_dictionary['elder']}/>
                        </TouchableOpacity>
                    </View>
                    <Divider />
                    <View style={styles.row}>
                        <TouchableOpacity style={(selectedEndgameTags.includes('adjudicator')) ? styles.on : styles.off} onPress={() => addTag('adjudicator')}>
                            <Text>Adjudicator</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={(selectedEndgameTags.includes('crusader')) ? styles.on : styles.off} onPress={() => addTag('crusader')}>
                            <Text>Crusader</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={(selectedEndgameTags.includes('hunter')) ? styles.on : styles.off} onPress={() => addTag('hunter')}>
                            <Text>Hunter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={(selectedEndgameTags.includes('warlord')) ? styles.on : styles.off} onPress={() => addTag('warlord')}>
                            <Text>Warlord</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.itemBox}>
                    <Button onPress={createItem}>Create Item</Button>
                </View>
                

            </View>
        </PaperProvider>
    );
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#1E2126'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    endgameButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    endGameTypeTray: {
        flex: 1,
    },
    itemBox: {
        flex: 2,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'stretch',
    },
    on: {
        flex: 1,
        
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.blue600,
    },
    off: {
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.green600,
    }
});
