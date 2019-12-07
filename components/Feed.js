import React, { useState, useEffect, useRef } from 'react';
import { TouchableHighlight, Dimensions, ScrollView, StyleSheet, Text, Button, View } from 'react-native';
import { List, Avatar, Card, Paragraph, TextInput, Title, Divider } from 'react-native-paper';
import { BaseItemCard } from './BaseItemCard';
// import Store from './Store';



export function Feed(props) {

    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
    },[props]);

    return (
        <View style={{ flex: 5 }}>
            <ScrollView
                ref={scrollViewRef}
                style={{ flexGrow: 1 }}
                contentContainerStyle={{ alignItems: 'stretch' }}>

                {props.items ? (
                    props.items.map((item) =>
                        <BaseItemCard key={item.id} item={item} navigation={props.navigation}/>
                    )): <Text>Empty</Text> 
                }
                
            </ScrollView>
        </View>
    );
};


