//Tilføjelsen i G2 til denne visning/fane består af en knap "Vis på kort", hvor brugeren tages til lokationen af baren
// Den visning der kommer når man trykker på et liste elemnt og ser vagtdetaljer. Er ikke en selvstændigvisning da det er en stack oven på listen køb vagter
//Det er her selve handlen mellem barer sker, hvor man booker en bartender.

import { Alert, Text, View } from 'react-native';
import { ref, update } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { globalStyles } from '../../styles/globalStyles';
import ButtonComponent from '../../components/ButtonComponent';
import { MIN_BAR } from '../../LokalTestData/minBar';

export default function VagtDetaljerScreen({ navigation, route }) { //Den bruger de informationer der ligger i route(som er listen),som ligger der fra man hentede listen, i stedet for at lave et kald til Firebase 
    const { vagt } = route.params;

    const bookCrew = async () => { //Async og await så funktionen venter på at skrivning til Firebase er sket før at den går videre med næste del af koden                 

        const vagtRef = ref(db, 'vagter/' + vagt.id); // Ref gør at vi kan pege på den specifikke vagt ude fra vagt.id, som Firebase gav alle vagter.

        await update(vagtRef, { //Opdaterer de valgte felter
            status: 'booket',
            booket_af: MIN_BAR,
        });
        navigation.goBack();
    };

    const visPaaKort = () => { // Dette er den en af de nye G2 knapper, den gør at den knap jeg har lavet, kan vise baren på kortet. Den henter en vagts bar og barens lokation fra firebase  <------ 
        navigation.navigate('Kort', { bar: vagt.virksomhed, tid: Date.now() });
    };

    return (
        <View style={globalStyles.skaermMedPadding}>
            <Text style={globalStyles.overskrift}>{vagt.virksomhed}</Text>
            <Text style={globalStyles.rolle}>{vagt.rolle}</Text>

      {/* Herunder er bare de informatiobner der er om en vagt i vagtdetaljer*/}
            <View style={globalStyles.raekke}>
                <Text style={globalStyles.label}>DATO</Text>
                <Text style={globalStyles.vaerdi}>{vagt.dato}</Text>
            </View>
            <View style={globalStyles.raekke}>
                <Text style={globalStyles.label}>TIDSRUM</Text>
                <Text style={globalStyles.vaerdi}>{vagt.tid}</Text>
            </View>
            <View style={globalStyles.raekke}>
                <Text style={globalStyles.label}>TIMER</Text>
                <Text style={globalStyles.vaerdi}>{vagt.timer} timer</Text>
            </View>
            <View style={globalStyles.raekke}>
                <Text style={globalStyles.label}>TIMELØN</Text>
                <Text style={globalStyles.vaerdi}>{vagt.timeloen} kr/t</Text>
            </View>
            {/* G2: Ny række med tillægget, vises altid på samme måde som de andre oplysninger, også når der ikke er noget. */}
            <View style={globalStyles.raekke}>{/* <------ */}
                <Text style={globalStyles.label}>TILLÆG</Text>
                <Text style={globalStyles.vaerdi}>
                    {vagt.tillaegBeloeb > 0 ? vagt.tillaeg + ' · ' + vagt.tillaegBeloeb + ' kr' : 'Ingen'}
                </Text>
            </View>
            <View style={globalStyles.raekke}>
                {/* I alt er nu timer gange løn plus tillæg. || 0 gør at vagter uden tillæg stadig virker  <----------- */}
                <Text style={globalStyles.label}>I ALT</Text>
                <Text style={globalStyles.vaerdi}>{vagt.timer * vagt.timeloen + (vagt.tillaegBeloeb || 0)} kr</Text>
            </View>

            {/* Herunder er det element, der adskiller CrewNet fra en åben vikarapp. Køberen kan se, hvem der giver god for bartenderen. Reelt set også bare mere information*/}
            <View style={globalStyles.verifikation}>
                <Text style={globalStyles.verifikationLabel}>DET CREW I FÅR</Text>
                <Text style={globalStyles.navn}>{vagt.medarbejder}</Text>
                <Text style={globalStyles.verifikationTekst}>
                    {vagt.verificeredeTimer} verificerede timer bag baren
                </Text>
                <Text style={globalStyles.verifikationTekst}>
                    {vagt.virksomhed} står inde for bartenderens kompetencer.
                </Text>
            </View>

            {/* CrewNet tanken i funktion. At en anden bar betaler en anden virksomhed for medarbejderens timer */}
            <Text style={globalStyles.note}>
                Medarbejderen får sin normale løn. I betaler {vagt.virksomhed} for timerne.
            </Text>

            {/* Knappen der sender en videre til kortet, se visPaaKort ovenfor  <------------- */}
            <ButtonComponent title="Vis på kort" onPress={visPaaKort} />
            <ButtonComponent title="Book Crew" onPress={bookCrew} />
            <ButtonComponent title="Tilbage" onPress={() => navigation.goBack()} />
        </View>
    );
}