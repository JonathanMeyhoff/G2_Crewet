//Dette er oversigt visningen i menubaren, som er "MinBar's" data om køb og salg af timer. 
//Der er også en liste med "Vagter vi har købt" og "Timer vi har udbudt", hvor udbudte timer kan slettes. 

import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View, } from 'react-native'; // <------
import { onValue, ref, remove, update } from 'firebase/database'; // <------
import { db } from '../firebaseConfig';
import { MIN_BAR } from '../LokalTestData/minBar';
import { colors, globalStyles } from '../styles/globalStyles';
import { TILLAEG_TYPER } from './SaelgTimerScreen'; // <------

export default function OversigtScreen() {
    const [vagter, setVagter] = useState([]);
    const [indlaeser, setIndlaeser] = useState(true);
    const [aabenTillaeg, setAabenTillaeg] = useState(null); // <------
    const [redigerType, setRedigerType] = useState('Ingen'); // <------
    const [redigerBeloeb, setRedigerBeloeb] = useState(''); // <------

    //Lytter på samme måde som i "Køb vagter", men her hentes alle vagter uden at filtere endnu, da der både skal bruges solgte og købte.
    useEffect(() => {
        const vagterRef = ref(db, 'vagter');
        const unsubscribe = onValue(vagterRef, (snapshot) => {
            const data = snapshot.val();
            setVagter(
                data ? Object.entries(data).map(([id, vagt]) => ({ id, ...vagt })) : [] //Restrukturere objektet
            );
            setIndlaeser(false);
        });
        return () => unsubscribe();
    }, []);

    // Selve sletnings funktionen, reelt en delete fra CRUD. remove fjerner vagten permanent
    const sletVagt = async (vagt) => {

        await remove(ref(db, 'vagter/' + vagt.id)); // onValue opdager selv at vagten ikke er der og listen tegnes igen, så der behøves ikke opdateres.
    };

    const aabnTillaeg = (vagt) => { // <------
        if (aabenTillaeg === vagt.id) {
            setAabenTillaeg(null);
            return;
        }
        setRedigerType(vagt.tillaeg || 'Ingen');
        setRedigerBeloeb(vagt.tillaegBeloeb ? String(vagt.tillaegBeloeb) : '');
        setAabenTillaeg(vagt.id);
    };

    const gemTillaeg = async (vagt) => { // <------
        const beloeb = redigerType === 'Ingen' ? 0 : Number(redigerBeloeb);
        if (redigerType !== 'Ingen' && (isNaN(beloeb) || beloeb <= 0)) {
            Alert.alert('Ugyldigt tillæg', 'Skriv et beløb større end 0, eller vælg "Ingen".');
            return;
        }
        try {
            await update(ref(db, 'vagter/' + vagt.id), {
                tillaeg: redigerType,
                tillaegBeloeb: beloeb,
            });
            setAabenTillaeg(null);
        } catch (fejl) {
            Alert.alert('Kunne ikke gemme tillægget', 'Tjek forbindelsen og prøv igen.');
        }
    };

    // En funktion der spørger om du er sikker på at du vi bekræfte din slettelse af en udbudt vagt
    const bekraeftSlet = (vagt) => {
        Alert.alert(
            'Træk udbuddet tilbage?',
            vagt.medarbejder + ' · ' + vagt.dato + ' · ' + vagt.tid,
            [
                { text: 'Annuller', style: 'cancel' },
                { text: 'Slet', style: 'destructive', onPress: () => sletVagt(vagt) },
            ]
        );
    };

    if (indlaeser) { // Samme som i køb vagter, venter på firebase data hent
        return (
            <View style={globalStyles.midt}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    //Her opdeles listen i 2 lister udefra hvad der er udbudt og hvad der er købt, med info om køb eller salg
    const koebte = vagter.filter((vagt) => vagt.booket_af === MIN_BAR);
    const udbudte = vagter.filter((vagt) => vagt.virksomhed === MIN_BAR);
    const solgte = udbudte.filter((vagt) => vagt.status === 'booket');

    //Oversigts værdierne som hedder statStibe eller Topstriben, altså data på køb, salg og netto værdi. 
    const timerSolgt = solgte.reduce((sum, vagt) => sum + vagt.timer, 0);
    const timerKoebt = koebte.reduce((sum, vagt) => sum + vagt.timer, 0);
    const indtaegt = solgte.reduce((sum, v) => sum + v.timer * v.timeloen, 0);
    const udgift = koebte.reduce((sum, v) => sum + v.timer * v.timeloen + (v.tillaegBeloeb || 0), 0); // <------
    const netto = indtaegt - udgift;

    return (
        //Her bruges en ScrollView og ikke FlatList, da siden har to lister.
        <ScrollView
            style={globalStyles.skaerm}
            contentContainerStyle={globalStyles.liste}
        >
            {/* Topstriben med de tre nøgletal */}
            <View style={globalStyles.statStribe}>
                <View style={globalStyles.statBlok}>
                    <Text style={globalStyles.statTal}>{timerSolgt} t</Text>
                    <Text style={globalStyles.statLabel}>SOLGT</Text>
                </View>
                <View style={globalStyles.statBlok}>
                    <Text style={globalStyles.statTal}>{timerKoebt} t</Text>
                    <Text style={globalStyles.statLabel}>KØBT</Text>
                </View>
                <View style={globalStyles.statBlok}>
                    <Text style={globalStyles.statTal}>
                        {netto > 0 ? '+' : ''}
                        {netto} kr
                    </Text>
                    <Text style={globalStyles.statLabel}>NETTO</Text>
                </View>
            </View>

            <Text style={globalStyles.sektionTitel}>VAGTER VI HAR KØBT</Text>
            {/* Hvis listen er tom så vis teksten ellers tegn elementer */}
            {koebte.length === 0 ? (
                <Text style={globalStyles.tomTekst}>
                    I har ikke købt nogen vagter endnu
                </Text>
            ) : (
                koebte.map((vagt) => (
                    <View key={vagt.id} style={globalStyles.kort}>
                        <Text style={globalStyles.kortTitel}>{vagt.virksomhed}</Text>
                        <Text style={globalStyles.rolle}>{vagt.rolle}</Text>
                        <Text style={globalStyles.tid}>
                            {vagt.dato} · {vagt.tid}
                        </Text>
                        <Text style={globalStyles.tal}>
                            {vagt.timer} timer · {vagt.timeloen} kr/t
                        </Text>
                        <Text style={globalStyles.kortUnderTekst}>{/* <------ */}
                            {vagt.tillaegBeloeb > 0 ? 'Tillæg: ' + vagt.tillaeg + ' · ' + vagt.tillaegBeloeb + ' kr' : 'Tillæg: Ingen'}
                        </Text>
                        <Text style={globalStyles.kortUnderTekst}>
                            {vagt.medarbejder} kommer til jer
                        </Text>
                    </View>
                ))
            )}

            <Text style={globalStyles.sektionTitel}>TIMER VI HAR UDBUDT</Text>
            {udbudte.length === 0 ? (
                <Text style={globalStyles.tomTekst}>
                    I har ikke udbudt nogen timer endnu
                </Text>
            ) : (
                udbudte.map((vagt) => (
                    <View key={vagt.id} style={globalStyles.kort}>
                        {/* Her står interne medarbejder først, så baren kan se deres egne ansatte først.*/}
                        <Text style={globalStyles.kortTitel}>{vagt.medarbejder}</Text>
                        <Text style={globalStyles.rolle}>{vagt.rolle}</Text>
                        <Text style={globalStyles.tid}>
                            {vagt.dato} · {vagt.tid}
                        </Text>
                        <Text style={globalStyles.tal}>
                            {vagt.timer} timer · {vagt.timeloen} kr/t
                        </Text>

                        <Text style={globalStyles.kortUnderTekst}>{/* <------ */}
                            {vagt.tillaegBeloeb > 0 ? 'Tillæg: ' + vagt.tillaeg + ' · ' + vagt.tillaegBeloeb + ' kr' : 'Tillæg: Ingen'}
                        </Text>

                        {vagt.status === 'booket' && (
                            <Text style={globalStyles.kortUnderTekst}>
                                Købt af {vagt.booket_af}
                            </Text>
                        )}

                        {/*
                        Slet-knappen vises kun på vagter, ingen har booket endnu. */}
                        {vagt.status === 'ledig' && (
                            <View style={globalStyles.knapRaekke}>{/* <------ */}
                                <Pressable
                                    style={globalStyles.sletKnap}
                                    onPress={() => bekraeftSlet(vagt)}
                                >
                                    <Text style={globalStyles.sletTekst}>Træk tilbage</Text>
                                </Pressable>
                                <Pressable // <------
                                    style={globalStyles.tillaegKnap}
                                    onPress={() => aabnTillaeg(vagt)}
                                >
                                    <Text style={globalStyles.tillaegTekst}>Tillæg</Text>
                                </Pressable>
                            </View>
                        )}

                        {aabenTillaeg === vagt.id && ( // <------
                            <View>
                                <View style={globalStyles.tillaegValg}>
                                    {TILLAEG_TYPER.map((type) => {
                                        const valgt = redigerType === type;
                                        return (
                                            <Pressable
                                                key={type}
                                                onPress={() => setRedigerType(type)}
                                                style={[globalStyles.valgChip, valgt && globalStyles.valgChipAktiv]}
                                            >
                                                <Text style={[globalStyles.valgChipTekst, valgt && globalStyles.valgChipTekstAktiv]}>
                                                    {type}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                                {redigerType !== 'Ingen' && (
                                    <TextInput
                                        style={[globalStyles.input, globalStyles.tillaegInput]}
                                        value={redigerBeloeb}
                                        onChangeText={setRedigerBeloeb}
                                        placeholder="Beløb i kr"
                                        placeholderTextColor={colors.svag}
                                        keyboardType="number-pad"
                                    />
                                )}
                                <Pressable style={globalStyles.tillaegKnap} onPress={() => gemTillaeg(vagt)}>
                                    <Text style={globalStyles.tillaegTekst}>Gem tillæg</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                ))
            )}
        </ScrollView>
    );
}