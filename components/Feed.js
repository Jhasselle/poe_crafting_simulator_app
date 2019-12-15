import React, { useState, useEffect, useRef } from 'react';
import { TouchableHighlight, Dimensions, ScrollView, StyleSheet, Button, View } from 'react-native';
import { List, Avatar, Card, DarkTheme, Text, Paragraph, TextInput, Title, Divider } from 'react-native-paper';
import { BaseItemCard } from './BaseItemCard';
// import Store from './Store';


export function Feed({navigation, items, inEditMode, selectedItems, setSelectedItems}) {

    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (inEditMode) {
            console.log(selectedItems)
        }
    },[items, inEditMode]);

    function selectItem (uid) {
    
        if (selectedItems) {
            let selectedItemsCopy = selectedItems.slice()

            // Add to list
            if (!selectedItemsCopy.includes(uid)) {
                setSelectedItems([...selectedItems, uid])
            }
            // Remove from list
            else {
                for (let i = 0; i < selectedItemsCopy.length; i++) {
                    if (selectedItemsCopy[i] == uid) {
                        selectedItemsCopy.splice(i, 1)
                        break
                    }
                }
                setSelectedItems(selectedItemsCopy)
            }
        }
    } 

    return (
        <View style={{ flex: 5 }}>
            <ScrollView
                ref={scrollViewRef}
                style={{ flexGrow: 1 }}
                contentContainerStyle={{ alignItems: 'stretch' }}>

                {items && items.length != 0? (
                    items.map((item) =>
                        <BaseItemCard 
                            key={item.uid} 
                            item={item} 
                            navigation={navigation}
                            inEditMode={inEditMode}
                            selectItem={selectItem}
                        />
                    ).reverse()
                    ): <EmptyFeed navigation={navigation}/>
                }
                
            </ScrollView>
        </View>
    );
};

function EmptyFeed ({navigation}) {
    return (
        <TouchableHighlight style={styles.itemBox} onPress={() => navigation.navigate('ItemBase')}>
            <Text style={styles.itemTitle}>Tap to add item</Text> 
        </TouchableHighlight>
    )
}

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    itemBox: {
        flex: 2,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        // backgroundColor: DarkTheme.colors.surface,
        width: width,
        height: height - 100,
    },
    itemTitle: {
        position: 'absolute',
        flex: 1,
        fontSize: 24,
        fontFamily: 'Fontin-SmallCaps',
    },
})


