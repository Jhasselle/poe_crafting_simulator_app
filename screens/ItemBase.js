import React, { useState, useEffect, useRef } from 'react';
import { Image, ImageBackground, StyleSheet, ScrollView, View } from 'react-native';
import { AppBar, Avatar, Button, DarkTheme, IconButton, List, Text, Checkbox, Provider as PaperProvider } from 'react-native-paper';
// import Store from '../store/store';
import base_items from '../data/base_items';
import img_dictionary from '../data/img_dictionary';


export function ItemBase(props) {

    const navigateToEndgameSelection = (base) => {
        props.navigation.navigate('ItemEndgameSelection', { 'item_base': base });
    }

    return (
        <PaperProvider theme={DarkTheme}>
            <ImageBackground 
                source={require('../img/frame/atlas_background.png')} 
                style={styles.background}
                imageStyle={{ resizeMode: 'stretch' }}>

                <ScrollView
                    style={{ flexGrow: 1 }}
                    contentContainerStyle={{ alignItems: 'stretch' }}>

                    {
                        base_items ? (
                            base_items.map((item) =>
                                <List.Accordion
                                    key={item.item_class}
                                    title={item.item_class}
                                    titleStyle={styles.itemClass}
                                    onPress={() => { console.log('accordian pressed') }}
                                    style={styles.accordianTitle}
                                    >
                                    {
                                        item.base_items.map((base, index) =>
                                        
                                            <List.Item
                                                key={index}
                                                style={styles.card}
                                                title={base.name}
                                                titleStyle={styles.itemBase}
                                                onPress={() => navigateToEndgameSelection(base)}
                                                right={() =>
                                                    <Image
                                                        style={styles.itemImage}
                                                        source={img_dictionary[base.visual_identity.id]}

                                                    />
                                                }
                                            />
                                        )
                                    }

                                </List.Accordion>
                            )

                        ) : <Text>Loading</Text>
                    }

                </ScrollView>
            </ImageBackground>
        </PaperProvider>
    );
}

ItemBase.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: () => 
            <Text 
                style={{
                    fontSize: 24,
                    fontFamily: 'Fontin-SmallCaps',
                    color: 'white'
                }}>
                Select Item Base
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

const styles = StyleSheet.create({
    accordianTitle: {
        backgroundColor: 'rgba(30, 33, 38, 0.9)'
        // backgroundColor: '#1E2126'
    },
    card: {
        paddingLeft: 30,
        // backgroundColor: '#15171a'
        backgroundColor: 'rgba(20, 23, 28, 0.4)'
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',

        backgroundColor: '#1E2126'
    },
    imageBackground: {
        flex: 6,
        justifyContent: 'center',
    },
    imageStyle: {
        alignItems: 'stretch',
    },
    itemClass: {
        fontSize: 20,
        fontFamily: 'Fontin-SmallCaps',
    },
    itemBase: {
        fontSize: 20,
        fontFamily: 'Fontin-SmallCaps',
    },
    itemImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    headerText: {
        fontSize: 20,
        fontFamily: 'Fontin-SmallCaps',
    }
});
