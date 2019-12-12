import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';


export function HomeBottomAppBar(props) {
    return (
        <Appbar style={styles.bottom}>
            <Appbar.Action icon="plus" onPress={() => props.navigation.navigate('ItemBase')} />
            <Appbar.Action icon="delete" onPress={() => console.log('Pressed delete')} />
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
        justifyContent: 'space-evenly'
    },
});