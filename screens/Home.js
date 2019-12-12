import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppBar, Button, Colors, DarkTheme, Provider as PaperProvider  } from 'react-native-paper';
import { HomeHeader } from '../components/HomeHeader'
import { HomeBottomAppBar } from '../components/HomeAppBar';
import { Feed } from '../components/Feed';
import Store from '../store/store';

export function Home(props) {

    const store = Store.getInstance()
    const [items, setItems] = useState(null)

    useEffect(()=>{
        // store.nukeDatabase()
        props.navigation.addListener( 
            'willFocus',
            () => {
                store.getAllItems(setItems)
            }
        );
        store.getAllItems(setItems)
    },[props])

    return (
        <PaperProvider theme={DarkTheme}>
                <HomeHeader />
                <View style={styles.background}>
                    <Feed items={items} navigation={props.navigation}/>
                    {/* for debugging */}
                    {/* <Button color={Colors.red600} onPress={()=> store.nukeDatabase()}>nuke</Button> */}
                </View>
                <HomeBottomAppBar navigation={props.navigation}/>
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
