import React, { useState, useEffect, useRef } from 'react';
import { TouchableHighlight, Dimensions, ScrollView, StyleSheet, Button, View } from 'react-native';
import { List, Avatar, Card, Text, Paragraph, TextInput, Title, Divider } from 'react-native-paper';
import { BaseItemCard } from './BaseItemCard';
// import Store from './Store';



export function Feed(props) {

    const scrollViewRef = useRef(null);

    useEffect(() => {
    },[props]);

    return (
        <View style={{ flex: 5 }}>
            <ScrollView
                ref={scrollViewRef}
                style={{ flexGrow: 1 }}
                contentContainerStyle={{ alignItems: 'stretch' }}>

                {props.items && props.items.length != 0? (
                    props.items.map((item) =>
                        <BaseItemCard key={item.uid} item={item} navigation={props.navigation}/>
                    ).reverse()
                    ): <Text style={{fontSize: 20}}>No Items</Text> 
                }
                
            </ScrollView>
        </View>
    );
};


