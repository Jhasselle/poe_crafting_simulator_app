import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { DarkTheme, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import Store from '../store/store';

const goItemCraft = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'ItemCraft' })],
});

export function Loading(props) {

    const store = Store.getInstance()
    const item_class = props['navigation']['state']['params']['itemClass'];
    const item_base = props['navigation']['state']['params']['itemBase'];
    const endgame_type = props['navigation']['state']['params']['endgameType'];

    useEffect(() => {
        store.createItem(
            props['navigation']['state']['params']['itemClass'], 
            props['navigation']['state']['params']['itemBase'], 
            props['navigation']['state']['params']['endgameType'],
            navCallback)
    }, []);

    function navCallback(item_id){
        // props.navigation.dispatch(goItemCraft, {'item':item});
        props.navigation.navigate('ItemCraft', {'item_id':item_id});
    }

    function printTables() {
        store.printAllTables();
    }

    function createItem() {
        store.createItem(item_class, item_base, endgame_type);
    }

    function printItems() {
        store.printAllItems();
    }
    
    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>
                <Text>Creating Item</Text>
                <ActivityIndicator animating={true} color={Colors.red600} size='large'/>
                <Button onPress={printTables}>print all tables</Button>
                <Button onPress={createItem}>create item</Button>
                <Button onPress={printItems}>print items</Button>

            </View>
        </PaperProvider>
    
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2126'
    },
});
