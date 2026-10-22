// Listeskærmen "Køb vagter", også et element i bundlinje menuen. Henter vagterne løbende fra Firebase Realtime Database, så en ændring i Firebase sker næsten med det samme.
// Viser de overskydende vagter/timer der er lagt op af andre barer.

import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { onValue, ref } from 'firebase/database';
import { db } from '../firebaseConfig';
import { colors, globalStyles } from '../styles/globalStyles';
import { MIN_BAR } from '../LokalTestData/minBar';

export default function KoebVagterScreen({ navigation }) {

    const [vagter, setVagter] = useState([]); //useState laver en variabel som skærmen husker. 
    const [indlaeser, setIndlaeser] = useState(true); 

    // useEffect kører den kode, der har med omverdenen at gøre, såsom databasen, som er Firebase i denne app. Men kun første gang skærmen vises.
    useEffect(() => {

        const vagterRef = ref(db, 'vagter');

        // onValue lytter. Den kaldes når skærmen indlæses og  hver gang noget i 'vagter' ændrer sig.
        const unsubscribe = onValue(vagterRef, (snapshot) => {

            // Her modtages dataen som et objekt, ikek et array, som en liste skal bruge.
            const data = snapshot.val();

            //FlatLister skal bruge arrays. Her laves objekterne om til brugbar arrays. 
            const liste = data
                ? Object.entries(data).map(([id, vagt]) => ({ id, ...vagt }))
                : [];

            // et filter der gør at der kun vises de vagter som ingen har booket endnu
            setVagter(
                liste.filter(
                  (vagt) => vagt.status === 'ledig' && vagt.virksomhed !== MIN_BAR
                )
              );

            setIndlaeser(false);
        });

        // Her lukkes lytteren så den ikke er i baggrunden efter.
        return () => unsubscribe();
    }, []);

    if (indlaeser) { //Uden denne funktion vil skærmen sige "Ingen vagter", før firebase kan give sit svar på listens indhold. Med denne loader den ind til Firebase svarer.
        return (
            <View style={globalStyles.midt}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (vagter.length === 0) {
        return (
            <View style={globalStyles.midt}>
                <Text style={globalStyles.tomTekst}>Ingen ledige vagter lige nu</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.skaerm}>

            {/* FlatList tegner kun de visninger man kan se på skærmen, altså den vagt man har trykket på. */}
            <FlatList
                data={vagter}
                keyExtractor={(item) => item.id}
                contentContainerStyle={globalStyles.liste}
                renderItem={({ item }) => (

                    //Her gøres hele liste elementet til en knap og sender vagten med over på detaljeskærmen i stedet for at hente den igen
                    <Pressable
                        style={globalStyles.kort}
                        onPress={() => navigation.navigate('VagtDetaljer', { vagt: item })}
                    >
                        <Text style={globalStyles.kortTitel}>{item.virksomhed}</Text>
                        <Text style={globalStyles.rolle}>{item.rolle}</Text>
                        <Text style={globalStyles.tid}>
                            {item.dato} · {item.tid}
                        </Text>
                        <Text style={globalStyles.tal}>
                            {item.timer} timer · {item.timeloen} kr/t
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    );
}