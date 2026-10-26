// Et samlet sted for styles koden, der bruges alle steder i appen. Alt samlet et sted så det kun skal ændres en gang i stedet for i hver fil.

import { StyleSheet } from 'react-native';

// Farver der får appen til næsten at ligne en Rekom app, bare for inspiration, så det passer til bruger segmentet.
export const colors = {
    baggrund: '#12100F',     // varm næsten-sort, ikke ren #000
    flade: '#1C1917',        // kort og bjælker løftet fra baggrunden
    fladeHoej: '#262220',    // det næste lag, fx inputfelter
    tekst: '#F5F1EC',        // knækket hvid, mildere end ren hvid
    daempet: '#A39B92',
    svag: '#756D66',
    streg: '#322D2A',
    accent: '#E8B44A',       // messing, tænkt som flasker og varmt lys bag baren
    accentSvag: '#2A2116',   // accentens mørke variant til blokke
    fare: '#5A2A2A',         // kanten på slet-knappen
    fareTekst: '#E08A8A',    // teksten på slet-knappen
};

const kortBase = {
    backgroundColor: colors.flade,
    borderWidth: 1,
    borderColor: colors.streg,
    borderRadius: 8,
};


export const globalStyles = StyleSheet.create({
    // ---------- Skærmens ramme ----------
    
    kortSkaerm: { flex: 1 },
    omraadeVaelger: { 
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        gap: 8,
    },
    knapRaekke: { flexDirection: 'row', gap: 8 }, // <------
    tillaegKnap: { // <------
        alignSelf: 'flex-start',
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.accent,
        minHeight: 40,
        justifyContent: 'center',
    },
    tillaegTekst: { color: colors.accent, fontSize: 13 }, // <------
    tillaegValg: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }, // <------
    tillaegInput: { marginTop: 10 }, // <------
    
    
// Alt herunder er det samme som fra G1, altså denn styling der blev brugt til CrewNet v.1 <------- 

    skaerm: {
        flex: 1,
        backgroundColor: colors.baggrund,
    },
    skaermMedPadding: {
        flex: 1,
        backgroundColor: colors.baggrund,
        padding: 20,
    },
    midt: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.baggrund,
    },

    // ---------- Lister og kort ----------
    liste: { padding: 16 },
    kort: {
        ...kortBase, 
        padding: 14,
        marginBottom: 12,
    },
    kortTitel: { fontSize: 16, fontWeight: '700', color: colors.tekst },
    rolle: { fontSize: 13, color: colors.daempet, marginTop: 2 },
    tid: { fontSize: 14, color: colors.tekst, marginTop: 8 },
    tal: {
        fontSize: 14,
        color: colors.tekst,
        marginTop: 4,
        fontVariant: ['tabular-nums'], 
    },
    kortUnderTekst: { fontSize: 12, color: colors.daempet, marginTop: 8 },
    sektionTitel: {
        fontSize: 11,
        letterSpacing: 1.2,
        color: colors.svag,
        marginBottom: 10,
        marginTop: 4,
    },

    // ---------- Vagtdetalje skærmen ----------
    overskrift: { fontSize: 22, fontWeight: '700', color: colors.tekst },
    raekke: {
        flexDirection: 'row',
        justifyContent: 'space-between', //Skubber label til venstre og værdi til højre
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.streg,
    },
    label: { fontSize: 12, letterSpacing: 1, color: colors.svag },
    vaerdi: { fontSize: 15, color: colors.tekst, fontVariant: ['tabular-nums'] },

    // ---------- Verifikationsblok ----------
    verifikation: {
        marginTop: 20,
        padding: 14,
        backgroundColor: colors.accentSvag,
        borderLeftWidth: 3, 
        borderLeftColor: colors.accent,
        borderRadius: 6,
    },
    verifikationLabel: { fontSize: 11, letterSpacing: 1, color: colors.accent },
    navn: { fontSize: 17, fontWeight: '700', color: colors.tekst, marginTop: 4 },
    verifikationTekst: { fontSize: 13, color: colors.tekst, marginTop: 3 },

    // ---------- Formular på Sælg timer ----------
    feltLabel: {
        fontSize: 11,
        letterSpacing: 1,
        color: colors.svag,
        marginBottom: 6,
        marginTop: 14,
    },
    input: {
        backgroundColor: colors.fladeHoej,
        borderWidth: 1,
        borderColor: colors.streg,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: colors.tekst,
        fontSize: 15,
        minHeight: 48, 
    },
    inputRaekke: { flexDirection: 'row', gap: 10 },
    inputHalv: { flex: 1 },

    valgRaekke: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, //flexWrap gør at de bryder til næste linje i stedet for at blive mast
    valgChip: {
        backgroundColor: colors.fladeHoej,
        borderWidth: 1,
        borderColor: colors.streg,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 48,
        justifyContent: 'center',
    },
    valgChipAktiv: {
        borderColor: colors.accent,
        backgroundColor: colors.accentSvag,
    },
    valgChipTekst: { color: colors.daempet, fontSize: 14 },
    valgChipTekstAktiv: { color: colors.tekst, fontWeight: '600' },
    valgChipUnder: { color: colors.svag, fontSize: 11, marginTop: 2 },

    opsummering: {
        ...kortBase,
        padding: 14,
        marginTop: 20,
    },
    opsummeringTal: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.tekst,
        fontVariant: ['tabular-nums'],
    },
    hjaelpetekst: { fontSize: 12, color: colors.daempet, marginTop: 4 },

    // ---------- Oversigt ----------
    statStribe: {
        ...kortBase,
        flexDirection: 'row',
        paddingVertical: 14,
        marginBottom: 20,
    },
    statBlok: { flex: 1, alignItems: 'center' }, 
    statTal: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.tekst,
        fontVariant: ['tabular-nums'],
    },
    statLabel: {
        fontSize: 10,
        letterSpacing: 1,
        color: colors.svag,
        marginTop: 4,
    },

    // ---------- Knapper ----------
    knap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 8,
        backgroundColor: colors.accent,
        marginTop: 12,
        minHeight: 48,
    },
    knapTekst: { color: colors.baggrund, fontSize: 16, fontWeight: '600' },

    sletKnap: {
        alignSelf: 'flex-start', 
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.fare,
        minHeight: 40,
        justifyContent: 'center',
    },
    sletTekst: { color: colors.fareTekst, fontSize: 13 },

    // ---------- Diverse ----------
    note: { fontSize: 12, color: colors.daempet, marginTop: 12, lineHeight: 17 },
    tomTekst: { color: colors.daempet },
});