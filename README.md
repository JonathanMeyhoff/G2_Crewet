# CrewNet – version 2

App til Godkendelsesopgave 2 i Innovation og Ny Teknologi, HA(it.) på CBS. Bygger videre på CrewNet fra Godkendelsesopgave 1 ([G1_AppRepo](https://github.com/JonathanMeyhoff/G1_AppRepo)).

CrewNet er en app hvor barer køber og sælger arbejdstimer af hinanden, altså B2B. En bar med stille perioder kan udbyde sine overskudstimer, og en bar der mangler folk kan købe dem. Fordi det er ansatte med dokumenteret erfaring, kan køberen se præcis hvem de får.

Appen er bygget fra en barmangers side.

## Demovideo

INDSÆT LINK TIL DEMOVIDEO

## Nyt i G2
Alt ny kode er kommenteret og markeret med en pil "<-------" for at adskilde det fra G1, kommentarerne. Dette er gjort med henblik på at det måske ikke er den samme person som gennemser koden.

**Kort** — en ny fane i bundmenuen. Kortet viser en nål pr. bar med antal ledige bartendere. Ens egen bar har en guld nål. Øverst kan man skifte mellem Helsingør og København, og kortet starter ved ens egen bar.

**Tillæg til bartenderen** — en bar kan give et tillæg på sine egne vagter for at gøre dem mere attraktive. Man vælger en af følgende typer: "Ingen, Transport, Akut eller Kort varsel" og skriver selv beløbet.
- I **Sælg timer** vælges tillægget når vagten oprettes.
- I **Oversigt** ligger knappen "Tillæg" ved siden af Træk tilbage, så man kan tilføje eller rette tillægget, hvis vagten ikke bliver taget.
- På **Vagtdetaljer** står tillægget sammen med de andre oplysninger og er lagt til den samlede beregning
- **Netto** i Oversigt tager tillægget med på de vagter man har købt.

**Vis på kort** — en ny knap på Vagtdetaljer, som skifter til kortet og zoomer ind på den bar vagten kommer fra. Så kan man se hvor langt bartenderen skal rejse.

Ændringerne bygger på interviews med bartendere, som er den side af platformen der bliver udlånt. Baggrunden står i rapporten.

Kode uden pil er fra G1

## Data i Firebase

Alt data ligger i Firebase Realtime Database, så listerne og kortet opdateres live.

- `vagter` — som i G1, plus de nye felter `tillaeg` (type) og `tillaegBeloeb` (kr).
- `barer` — nyt i G2. En post pr. bar med `latitude`, `longitude` og `omraade`. Barens navn er nøglen, så kortet kan finde baren ud fra vagtens `virksomhed`.

Forbindelsen står i `crewnet/firebaseConfig.js` og peger på et kørende Firebase-projekt, så appen virker uden at man selv skal sætte noget op.

## Sådan kører man projektet + Krav

Man skal have to ting inden:

- **Node.js** (version 20 eller nyere) på computeren — hentes på nodejs.org.
  Tjek med `node -v` i terminalen.
- **Expo Go** i nyeste version på telefonen — findes gratis i App Store og Google Play.

Så klones projektet og startes:

git clone https://github.com/JonathanMeyhoff/G2_Crewet.git
cd G2_Crewet/crewnet
npm install
npx expo start

Scan QR-koden med Expo Go på telefonen.
