import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppBar, Button, Colors, Text, DarkTheme, Provider as PaperProvider  } from 'react-native-paper';
import { HomeBottomAppBar, HomeTopAppBar } from '../components/HomeAppBar';
import { Feed } from '../components/Feed';
import Store from '../store/store';

export function StoreTest(props) {

    const store = Store.getInstance()

    const [items, setItems] = useState(null)

    useEffect(()=>{
        console.log('StoreTest useEffect')
        store.getAllItems(setItems)
    },[])

    const test_affix_generation = () => {
        let tags = [ 
            "int_armour",
            "focus",
            "shield",
            "armour",
            "default"
        ]
        Store.generateItemMods(tags)
    }

    const test_focus = async () => {
        await store.focusItem(1)
    }

    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>
                <Text>Store Test</Text>
                <Button onPress={test_affix_generation}>test affix generation</Button>
                <Button onPress={test_focus}>test focus item</Button>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 50,
        paddingBottom: 50,
        backgroundColor: '#1E2126'
    },
});
