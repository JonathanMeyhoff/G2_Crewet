//Dette er G2's nye fane og visning. Det er selve kort funktionen, så bygger på barers lokationer, som er gemt i FireBase. Kortet viser en markør pr. bar som viser de vagter en bar har tilgængelige. 

import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // MapView er selve kortet og Marker er nålene på kortet. Kommer fra react-native-maps, som også bruges i øvelsens vejledning.
import { onValue, ref } from 'firebase/database';
import { db } from '../firebaseConfig';
import { colors, globalStyles } from '../styles/globalStyles';
import { MIN_BAR } from '../LokalTestData/minBar';



// Fastlægger hvilket område kortet skal vise - ALtså hvor meget der er zoomet ind. Dette kunne være dynamisk til bartenderens lokation, hvis appen blev udvidet til større områder eller flere. Her bruges latitude og longitude som  midten af kortet, hvor  Delta  er hvor stort et område der vises
const OMRAADER = {
    Helsingør: {
        latitude: 56.0360,
        longitude: 12.6090,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    },
    København: {
        latitude: 55.6800,
        longitude: 12.5500,
        latitudeDelta: 0.25,
        longitudeDelta: 0.25,
    },
};

export default function KortScreen({ route }) { // I denne funktion findes barerne og deres lokationer, hvor barens navn bruges som nøgle i Firebase. Kun de ledige vagter fra andre barer vises, helt lige som listen i "Køb vagter". <------
    const [barer, setBarer] = useState({});
    const [vagter, setVagter] = useState([]);
    const [indlaeser, setIndlaeser] = useState(true);
    const [valgtOmraade, setValgtOmraade] = useState(null);
    const kortRef = useRef(null);

    useEffect(() => {
        const stopBarer = onValue(ref(db, 'barer'), (snapshot) => {
            setBarer(snapshot.val() || {}); // || {} håndtere at appen ikke crasher, hvis der ingen barer er i databasen ved at lave det som en mulig tilstand.
            setIndlaeser(false);
        });

        const stopVagter = onValue(ref(db, 'vagter'), (snapshot) => {
            const data = snapshot.val();
            const liste = data
                ? Object.entries(data).map(([id, vagt]) => ({ id, ...vagt }))
                : [];
            setVagter(
                liste.filter((vagt) => vagt.status === 'ledig' && vagt.virksomhed !== MIN_BAR) // På samme måde som i "Køb vagter" laves et filter der kun viser vagter der ikke er booket og ikke er ens egne.

            );
        });

        return () => {
            stopBarer();
            stopVagter();
        };
    }, []);

    // Når man trykker på "Vis på kort" flyttes kortet hen til baren og zoomer ind. tid gør at det også virker hvis man trykker på den samme bar to gange 
    useEffect(() => { 
        const bar = barer[route.params?.bar];
        if (!bar) return;
        setValgtOmraade(OMRAADER[bar.omraade] ? bar.omraade : 'København');
        kortRef.current?.animateToRegion(
            { latitude: bar.latitude, longitude: bar.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
            600
        );
    }, [route.params?.tid, indlaeser]);

    if (indlaeser) {  // Loader indtil ay Firebase har svaret, ligesom i de andre visninger.
        return (
            <View style={globalStyles.midt}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    const minBar = barer[MIN_BAR]; // Her defineres hvad min bar er, som er givet efter det faste valg i LokalTestData, dette vil kunne være dynamisk hvis man lavede en bruger definition <------ 
    const startBar = barer[route.params?.bar] || minBar; 
    const startOmraade = startBar 
        ? {
              latitude: startBar.latitude,
              longitude: startBar.longitude, 
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
          }
        : OMRAADER['København'];
    const aktivtOmraade = valgtOmraade || minBar?.omraade;

    const skiftOmraade = (navn) => { // Dette er en knap der er lavet til demoen, det var let implementeret med fokus på at kunen vise de 2 ormåder. Havde været for simplet til G2 opgaven.
        setValgtOmraade(navn);
        kortRef.current?.animateToRegion(OMRAADER[navn], 600);
    };

    return (
        <View style={globalStyles.skaerm}>
        <MapView ref={kortRef} style={globalStyles.kortSkaerm} initialRegion={startOmraade}>

            {/* Herunder laves en markør for hver bar i databasen. Navnet på baren er nøglen der vruges i FireBase og hvor bar er lokationen og området som er defineret per bar i FireBase også. */}
            {Object.entries(barer).map(([navn, bar]) => {
                const barensVagter = vagter.filter((vagt) => vagt.virksomhed === navn); // Tæller hvor mange ledige vagter den enkelte bar har.
                const erMinBar = navn === MIN_BAR;

           
                if (!erMinBar && barensVagter.length === 0) return null; // Barer uden ledige vagter vises ikke, da kortet skal bruges til at finde vagter. Ens egen bar vises dog altid, da det giver en form for UX og overskuelighed.

      
                const antalTekst =
                    barensVagter.length === 1 ? '1 ledig bartender' : barensVagter.length + ' ledige bartendere'; // Lille rettelse så der ikke står "1 ledige vagter", men tages forbehold for ental

                return (
                    <Marker
                        key={navn}
                        coordinate={{ latitude: bar.latitude, longitude: bar.longitude }}
                        title={navn}
                        description={erMinBar ? 'Din bar' : antalTekst + ' · ' + bar.omraade} //Her defineres teksten i boksen når man trykker på en given nål
                        pinColor={erMinBar ? colors.accent : 'red'} // Egen bar har appens en guld farve, så den er tydlig og skilder sig ud fra de andre.
                        tracksViewChanges={false} // Gør kortet hurtigere, da nålene ikke tegnes forfra hele tiden. Bruges fra vejledningen (tror det sikre at den ikke søger efter opdateringer hele tiden?) 
                    />
                );
            })}
        </MapView>

        <View style={globalStyles.omraadeVaelger}>
            {Object.keys(OMRAADER).map((navn) => {
                const aktiv = aktivtOmraade === navn;
                return (
                    <Pressable
                        key={navn}
                        style={[globalStyles.valgChip, aktiv && globalStyles.valgChipAktiv]}
                        onPress={() => skiftOmraade(navn)}
                    >
                        <Text style={[globalStyles.valgChipTekst, aktiv && globalStyles.valgChipTekstAktiv]}>
                            {navn}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
        </View>
    );
}
