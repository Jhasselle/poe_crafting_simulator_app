import * as React from 'react';
import { Appbar, Button, DarkTheme, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';


export function HomeHeader(props) {
    return (
        <Appbar style={styles.top}>
            <Text style={styles.title}>PoE Crafting Sim</Text>
            <Button>About</Button>
        </Appbar>
    );
}

const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-evenly'
    },
    top: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'space-evenly',
        backgroundColor: DarkTheme.colors.surface
    },
    title: {
        fontFamily: 'Fontin-SmallCaps',
        fontSize: 24
    }
});