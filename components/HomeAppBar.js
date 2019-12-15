import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Appbar, Button, DarkTheme, IconButton } from 'react-native-paper';
import { useFocusEffect } from 'react-navigation-hooks';

export function HomeBottomAppBar({ navigation, inEditMode, setInEditMode, deleteItems}) {

    useEffect(()=>{

    }, [inEditMode])
    
    const confirm_delete = () => {
        setInEditMode(false)
    }

    return (

        <Appbar style={styles.bottom}>
            {
                inEditMode
                    ? <>
                    {/* cancel */}
                        <IconButton
                            icon="cancel"
                            onPress={() => setInEditMode(false)}
                            style={styles.iconButton}
                        />
                     {/* confirm delete */}
                        <IconButton
                            icon="check"
                            onPress={deleteItems}
                            style={styles.iconButton}
                        />
                    </>

                    : <>
                        <IconButton
                            icon="plus"
                            onPress={() => navigation.navigate('ItemBase')}
                            style={styles.iconButton}
                        />
                        <IconButton
                            icon="delete"
                            onPress={() => setInEditMode(true)}
                            style={styles.iconButton}
                        />
                    </>


            }
        </Appbar>
    );
}



const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-evenly',
        backgroundColor: DarkTheme.colors.surface
    },
    top: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'space-evenly'
    },
    iconButton: {
        flexGrow: 1
    }
});