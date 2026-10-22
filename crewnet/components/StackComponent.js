//Denne fil gør det muligt at gå fra listen med vagter ind i en specifik vagtedetalje, uden at der er link i bundmenuen. 
//Den gør også at man kan se bundlinje menuen når man er inde på en vagtedetalje

import { createStackNavigator } from '@react-navigation/stack';
import KoebVagterScreen from '../screens/KoebVagterScreen';
import VagtDetaljerScreen from '../screens/StackScreens/VagtDetaljerScreen';
import { colors } from '../styles/globalStyles';


const Stack = createStackNavigator(); //createStackNavigator fungere som en bunke af skærme der kan ligge oven på hinanden, hor man kan lægge en ny på bunken ved at trykke på et link

export default function StackComponent() {
    return (

        // Ingen NavigationContainer her, da der må kun være en i hele appen og den ligger i App.js.
        <Stack.Navigator
            initialRouteName="KoebVagter"
            screenOptions={{
                
                headerStyle: { backgroundColor: colors.flade }, //Fanens orginale header fjernes og erstattes af den valget vagdetaljes
                headerTintColor: colors.tekst,
                headerTitleStyle: { fontWeight: '700' },
                cardStyle: { backgroundColor: colors.baggrund },
            }}
        >
            {/* Hver stack er en unik skærm i bunken */}
            <Stack.Screen
                name="KoebVagter"
                component={KoebVagterScreen}
                options={{ title: 'Køb vagter' }}
            />
            <Stack.Screen
                name="VagtDetaljer"
                component={VagtDetaljerScreen}
                options={{ title: 'Vagtdetaljer' }}
            />
        </Stack.Navigator>
    );
}


