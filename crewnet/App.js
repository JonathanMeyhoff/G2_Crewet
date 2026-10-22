//Appens startfil, hvor React kører og alt andet er forbundet her
//Bundlinjen funktion med de 3 faner er bugget her

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

//de 3 forskellige skærme/visninger er forbundet her.
import StackComponent from './components/StackComponent'; // en stack ikke en skærm, mne stadig forbundet her.
import SaelgTimerScreen from './screens/SaelgTimerScreen';
import OversigtScreen from './screens/OversigtScreen';
import { colors } from './styles/globalStyles';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // SafeAreaProvider måler den telefon som appen er åbnet i og de zoner den må vise i, så der ikke er indhold steder hvor telefonen ikke kan vise det.
    <SafeAreaProvider>
      <StatusBar style="light" /> 

      <NavigationContainer>
            {/*NavigationContainer holder styr på brugeren er i appen. Alt navigation ligger heri*/}
            {/*Det er her funktionerne kaldes i de forskellige visninger/faner*/}

        <Tab.Navigator
          screenOptions={({ route }) => ({
           // Den fane man er på i bundlinje menuen er en valgt farvel, så man kan se hvor man står.

            tabBarIcon: ({ color, size, focused }) => {
              let ikon = 'ellipse-outline';

              if (route.name === 'KoebStack') {
                ikon = focused ? 'cart' : 'cart-outline';
              } else if (route.name === 'SaelgTimer') {
                ikon = focused ? 'pricetag' : 'pricetag-outline';
              } else if (route.name === 'Oversigt') {
                ikon = focused ? 'stats-chart' : 'stats-chart-outline';
              }

              return <Ionicons name={ikon} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.daempet,
            tabBarStyle: {
              backgroundColor: colors.flade,
              borderTopColor: colors.streg,
            },
            headerStyle: { backgroundColor: colors.flade },
            headerTintColor: colors.tekst,
            headerTitleStyle: { fontWeight: '700' },
          })}
        >
          <Tab.Screen
            name="KoebStack"
            component={StackComponent}
            options={{ title: 'Køb vagter', headerShown: false }}
          />
          <Tab.Screen
            name="SaelgTimer"
            component={SaelgTimerScreen}
            options={{ title: 'Sælg timer' }}
          />
          <Tab.Screen
            name="Oversigt"
            component={OversigtScreen}
            options={{ title: 'Oversigt' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}