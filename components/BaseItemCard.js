import React, { useEffect } from 'react';
import { TouchableHighlight } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

export function BaseItemCard(props) {
    useEffect(()=>{
        // console.log('BaseItemCard', props)
    },[])
    
    return (
        <TouchableHighlight onPress={() => props.navigation.navigate('ItemCraft', {item_id: props.item.uid})}>
            <Card>
                <Card.Title 
                    title={props.item.name + ' ' + props.item.base.Name} 
                    // subtitle={props.item.base}
                    // left={() => 
                    //     <Avatar.Image 
                    //         size={40} 
                    //         source={props.item.src} 
                    //     />
                    // } 
                />
            </Card>
        </TouchableHighlight>
    );
}
