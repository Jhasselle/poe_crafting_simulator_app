import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, Dimensions,TouchableOpacity, ScrollView, View } from 'react-native';
import { AppBar, Avatar, Button, Divider, Colors, DarkTheme, IconButton, List, Text, Checkbox, Provider as PaperProvider } from 'react-native-paper';
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
            if (selectedEndgameTags.length <= 1) {
                result = [...selectedEndgameTags, endgameType]
            }
            else {
                result = [selectedEndgameTags[1]]
                result.push(endgameType)
            }
        }

        setSelectedEndgameTags(result)
    }

    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>

                <View style={styles.endGameTypeTray}>
                    <View style={styles.row}>
                        <TouchableOpacity style={(selectedEndgameTags.includes('shaper')) ? styles.on : styles.off} onPress={() => addTag('shaper')}>
                            <Text style={styles.text}>Shaper</Text>
                            <Image style={{flex:1}} source={img_dictionary['shaper']}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={(selectedEndgameTags.includes('elder')) ? styles.on : styles.off} onPress={() => addTag('elder')}>
                            <Text style={styles.text}>Elder</Text>
                            <Image style={{flex:1}} source={img_dictionary['elder']}/>
                        </TouchableOpacity>
                    </View>
                    <Divider />
                    <View style={styles.row}>
                        <TouchableOpacity style={(selectedEndgameTags.includes('crusader')) ? styles.on : styles.off} onPress={() => addTag('crusader')}>
                            <Text style={styles.text}>Crusader</Text>
                            <Image style={{flex:1}} source={img_dictionary['crusader']}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={(selectedEndgameTags.includes('adjudicator')) ? styles.on : styles.off} onPress={() => addTag('adjudicator')}>
                            <Text style={styles.text}>Redeemer</Text>
                            <Image style={{flex:1}} source={img_dictionary['adjudicator']}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={(selectedEndgameTags.includes('hunter')) ? styles.on : styles.off} onPress={() => addTag('hunter')}>
                            <Text style={styles.text}>Hunter</Text>
                            <Image style={{flex:1}} source={img_dictionary['hunter']}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={(selectedEndgameTags.includes('warlord')) ? styles.on : styles.off} onPress={() => addTag('warlord')}>
                            <Text style={styles.text}>Warlord</Text>
                            <Image style={{flex:1}} source={img_dictionary['warlord']}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.itemBox}>
                    <Text style={styles.itemTitle}>{base_item.name}</Text>
                    {itemImage 
                        ?   
                                <Image style={styles.itemImage} source={itemImage} />
                            
                        : null
                    }
                </View>

                <TouchableOpacity style={styles.createItemBox} onPress={createItem}>
                    <Button 
                        style={styles.createItemButton} 
                        onPress={createItem}
                        labelStyle={{
                            fontSize: 24,
                            fontFamily: 'Fontin-SmallCaps',
                            }}
                        >
                        Create Item
                    </Button>
                </TouchableOpacity>
            
            </View>
        </PaperProvider>
    );
}


ItemEndgameSelection.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: () => 
            <Text 
                style={{
                    fontSize: 24,
                    fontFamily: 'Fontin-SmallCaps',
                    color: 'white'
                }}>
                Select Influence Types
            </Text>, 

        headerStyle: {
            backgroundColor: DarkTheme.colors.surface,
        },
        headerLeft: () => 
            <IconButton
                icon="arrow-left"
                onPress={() => navigation.pop()}
                style={{flex:1, color:'white'}}
                color='white'
            />
    };
}

var width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2126',
        width: width
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    endgameButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    endGameTypeTray: {
        flex: 1,
        flexDirection: 'column',
        width: '100%'
    },
    itemBox: {
        flex: 2,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: DarkTheme.colors.surface,
        width: width
    },
    itemTitle: {
        flex: 1,
        fontSize: 24,
        marginTop: 15,
        fontFamily: 'Fontin-SmallCaps',
    },
    itemImage: {
        position: 'absolute', 
    },
    createItemBox: {
        flex: 2,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    createItemButton: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    on: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: DarkTheme.colors.primary,
        borderColor: DarkTheme.colors.surface,
        borderWidth: 1,
    },
    off: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2126',
        borderColor: DarkTheme.colors.surface,
        borderWidth: 1,
    },
    text: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Fontin-SmallCaps',
    },
});
