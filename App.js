import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Splash } from './screens/Splash';
import { Loading } from './screens/Loading';
import { Home } from './screens/Home';
import { ItemBase } from './screens/ItemBase';
import { ItemEndgameSelection } from './screens/ItemEndgameSelection'
import { ItemCraft } from './screens/ItemCraft';
import { About } from './screens/About';
// import { StoreTest } from './screens/StoreTest';

const AppNavigator = createStackNavigator({
        Splash: {
            screen: Splash,
            navigationOptions: {
                header: null,
            }
        },
        Loading: {
            screen: Loading,
            navigationOptions: {
                header: null,
            }
        },
        Home: {
            screen: Home,
            // navigationOptions: {
            //     header: null,
            // }
        },
        ItemBase: {
            screen: ItemBase
        },
        ItemEndgameSelection: {
            screen: ItemEndgameSelection
        },
        ItemCraft: {
            screen: ItemCraft,
            navigationOptions: {
                header: null,
            }
        },
        About: {
            screen: About
        },
        
    },
    {
        initialRouteName: 'Splash'
    }
);

export default createAppContainer(AppNavigator);

