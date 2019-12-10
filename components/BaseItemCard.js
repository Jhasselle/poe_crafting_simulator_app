import React, { useEffect } from 'react';
import { TouchableHighlight } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

export function BaseItemCard(props) {
    useEffect(()=>{
        // console.log('BaseItemCard item:', props.item)
    })
        
    return (
        <TouchableHighlight onPress={() => props.navigation.navigate('Loading', {'item_uid': props.item.uid})}>
            <Card>
                <Card.Title 
                    title={props.item.name + ' ' + props.item.item_base.name} 
                    // right={()=>

                    // }
                    // subtitle={props.item.item_base}
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
