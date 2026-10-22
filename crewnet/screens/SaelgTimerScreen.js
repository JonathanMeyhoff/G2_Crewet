//Sælg timer er visningen hvor man kan oprette et udbud af de overflødige timer man ha rsom bar. 
//Det er her der bliver oprettet et nyt element(en vagt) i listen, altså en ny vagt i Firebase, som kommer på andres barers visning.

import { useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View, } from 'react-native';
import { push, ref } from 'firebase/database';
import { db } from '../firebaseConfig';
import { MIN_BAR } from '../LokalTestData/minBar';
import { MINE_MEDARBEJDERE } from '../LokalTestData/medarbejdere';
import { colors, globalStyles } from '../styles/globalStyles';
import ButtonComponent from '../components/ButtonComponent';

// De roller en bar kan udbyde deres medarbejdere som. Ligger her fordi de kun bruges på denne skærm. 
const ROLLER = ['Bartender', 'Cocktailbartender', 'Barback'];

export default function SaelgTimerScreen() {

    //Her opdaterers værdierne man skriver ind.
    const [medarbejder, setMedarbejder] = useState(MINE_MEDARBEJDERE[0]);
    const [rolle, setRolle] = useState(ROLLER[0]);
    const [dato, setDato] = useState('');
    const [fra, setFra] = useState('');
    const [til, setTil] = useState('');
    const [timer, setTimer] = useState('');
    const [timeloen, setTimeloen] = useState('');

    //En funktion til at slå knappen "Udbyd vagt" midlertidigt fra mens man skrive så man ikke kan nå at trykke to gange og oprette vagten dobbelt.
    const [gemmer, setGemmer] = useState(false);

    // TextInput giver altid tekst, også når man skriver tal, så funktionen gør at firebase for et tal og ikke en string. 
    const timerTal = Number(timer);
    const loenTal = Number(timeloen);
    const ialt = timerTal * loenTal;

    //Nulstille formularen når vagten er lagt op så man kan lave den næste med det samme
    const nulstil = () => {
        setDato('');
        setFra('');
        setTil('');
        setTimer('');
        setTimeloen('');
        setMedarbejder(MINE_MEDARBEJDERE[0]);
        setRolle(ROLLER[0]);
    };

    const udbydVagt = async () => {
        // Validering af det der er i formularen, altid før det ryger over til Firebase, så der ikke er halve vagter i listen.
        if (!dato.trim() || !fra.trim() || !til.trim()) {
            Alert.alert('Manglende felter', 'Udfyld dato og tidsrum.');
            return;
        }

        // Hvis der er bogstaver hvor der skal være tal eller tal er 0, så fejl.
        if (isNaN(timerTal) || timerTal <= 0) {
            Alert.alert('Ugyldigt antal timer', 'Skriv et tal større end 0.');
            return;
        }

        // Hvis der er bogstaver hvor der skal være tal eller tal er 0, så fejl.
        if (isNaN(loenTal) || loenTal <= 0) {
            Alert.alert('Ugyldig timeløn', 'Skriv et tal større end 0.');
            return;
        }

        try {
            setGemmer(true);

            //Opretter en ny vagt i Firebase som selv finder et unikt ID
            await push(ref(db, 'vagter'), {
                virksomhed: MIN_BAR,
                rolle: rolle,
                dato: dato.trim(),
                tid: fra.trim() + '-' + til.trim(),
                timer: timerTal,
                timeloen: loenTal,
                medarbejder: medarbejder.navn,
                verificeredeTimer: medarbejder.verificeredeTimer,
                status: 'ledig',
                booket_af: '',
            });

            nulstil();
            Alert.alert('Vagten er udbudt', 'Den er nu synlig for andre barer.');
        } catch (fejl) {
            Alert.alert('Kunne ikke gemme', 'Tjek forbindelsen og prøv igen.');
            console.log('Fejl ved oprettelse:', fejl);
        } finally {
            // finally kører uanset om det virkede eller ej, så knappen aldrig sidder fast i "gemmer" status.
            setGemmer(false);
        }
    };

    return (
        // at trykke uden for felterne lukker tastaturet så man kan se indhold man har skrevet.
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                style={globalStyles.skaerm}
                contentContainerStyle={globalStyles.liste}
                // Gør at man kan trykke på en knap mens tastaturet er åbent
                keyboardShouldPersistTaps="handled"
            >
                <Text style={globalStyles.sektionTitel}>
                    UDBYD DE TIMER I IKKE KAN BRUGE
                </Text>

                    {/* ---------- Nedestående punkter er bare en masse data om de valg man kan tage/vælge/skrive i formularen ---------- */}

                <Text style={globalStyles.feltLabel}>VÆLG MEDARBEJDER</Text>
                <View style={globalStyles.valgRaekke}>
                    {MINE_MEDARBEJDERE.map((person) => {

                        const valgt = person.navn === medarbejder.navn;
                        return (
                            <Pressable
                                key={person.navn}
                                onPress={() => setMedarbejder(person)}
                                style={[
                                    globalStyles.valgChip,
                                    valgt && globalStyles.valgChipAktiv,
                                ]}
                            >
                                <Text
                                    style={[
                                        globalStyles.valgChipTekst,
                                        valgt && globalStyles.valgChipTekstAktiv,
                                    ]}
                                >
                                    {person.navn}
                                </Text>
                                <Text style={globalStyles.valgChipUnder}>
                                    {person.verificeredeTimer} t
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
                <Text style={globalStyles.hjaelpetekst}>
                    Kun jeres egne ansatte kan udbydes.
                </Text>

                <Text style={globalStyles.feltLabel}>ROLLE</Text>
                <View style={globalStyles.valgRaekke}>
                    {ROLLER.map((r) => {
                        const valgt = r === rolle;
                        return (
                            <Pressable
                                key={r}
                                onPress={() => setRolle(r)}
                                style={[
                                    globalStyles.valgChip,
                                    valgt && globalStyles.valgChipAktiv,
                                ]}
                            >
                                <Text
                                    style={[
                                        globalStyles.valgChipTekst,
                                        valgt && globalStyles.valgChipTekstAktiv,
                                    ]}
                                >
                                    {r}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <Text style={globalStyles.feltLabel}>DATO</Text>
                <TextInput
                    style={globalStyles.input}
                    value={dato}
                    onChangeText={setDato}
                    placeholder="Fre 3. okt"
                    placeholderTextColor={colors.svag}
                />

                <Text style={globalStyles.feltLabel}>TIDSRUM</Text>
                <View style={globalStyles.inputRaekke}>
                    <TextInput
                        style={[globalStyles.input, globalStyles.inputHalv]}
                        value={fra}
                        onChangeText={setFra}
                        placeholder="17:00"
                        placeholderTextColor={colors.svag}
                    />
                    <TextInput
                        style={[globalStyles.input, globalStyles.inputHalv]}
                        value={til}
                        onChangeText={setTil}
                        placeholder="23:00"
                        placeholderTextColor={colors.svag}
                    />
                </View>

                <View style={globalStyles.inputRaekke}>
                    <View style={globalStyles.inputHalv}>
                        <Text style={globalStyles.feltLabel}>ANTAL TIMER</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={timer}
                            onChangeText={setTimer}
                            placeholder="6"
                            placeholderTextColor={colors.svag}
                            // Giver taltastatur på telefoner
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={globalStyles.inputHalv}>
                        <Text style={globalStyles.feltLabel}>TIMELØN (KR)</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={timeloen}
                            onChangeText={setTimeloen}
                            placeholder="195"
                            placeholderTextColor={colors.svag}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                <View style={globalStyles.opsummering}>
                    <Text style={globalStyles.opsummeringTal}>
                        {/* Viser kun et beløb når begge tal er rigtige */}
                        {ialt > 0 ? 'I får ' + ialt + ' kr for vagten' : 'I får — kr for vagten'}
                    </Text>
                    <Text style={globalStyles.hjaelpetekst}>
                        {medarbejder.navn} får sin normale løn fra jer.
                    </Text>
                </View>

                {/* Knappen skifter tekst mens der gemmes */}
                <ButtonComponent
                    title={gemmer ? 'Gemmer…' : 'Udbyd vagt'}
                    onPress={gemmer ? () => { } : udbydVagt}
                />
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}