# CrewNet

App til Godkendelsesopgave 1 i Innovation og Ny Teknologi, HA(it.) på CBS.

CrewNet er en app hvor barer køber og sælger arbejdstimer af hinanden, altså B2B. 

Problemet er todelt. Den ene side er de timer der går til spilde når der er stille og barer betaler for bartendere de ikke har brug for. Den anden er den akutte mangel, som kan 
opstå på en fredag aften, hvor de eneste muligheder er at ringe til dem man kender eller en vikar man aldrig har set før.
CrewNet understøtter salget af timer fra den ene bar til den anden og fordi det er ansatte med dokumenteret erfaring, kan køberen se præcis hvem de får.

Appen er bygget fra barchefens side. 

## Demovideo

https://www.youtube.com/watch?v=9DlxpMa-04k

## Hvad appen kan

**Køb vagter** — liste over ledige vagter fra andre barer. Trykker man på en vagt, ser man detaljerne, hvem medarbejderen er, hvor mange verificerede timer
vedkommende har, og hvilken bar der giver god for personen. Herfra bookes vagten også.

**Sælg timer** — er en formular hvor baren lægger sine egne overskudstimer op. Man vælger en af sine ansatte, en rolle, dato, tidsrum, antal timer og timeløn. Beløbet regnes
ud mens man skriver.

**Oversigt** — hvad baren har købt, hvad den har udbudt, og nøgletal for solgte timer, købte timer og netto. Et udbud der ikke er solgt kan trækkes tilbage. En
solgt vagt kan ikke, for så er det en aftale med en anden bar.

Alt data ligger i Firebase Realtime Database, så listerne opdaterers live på alle enheder når en vagt oprettes eller bookes.

## Teknologi
- React Native med Expo og Expo Go
- React Navigation — bundfaner med en stack under fanen Køb vagter
- Firebase Realtime Database

Forbindelsen står i `crewnet/firebaseConfig.js` og peger på et kørende Firebase-projekt, så appen virker uden at man selv skal sætte noget op.

## Sådan kører man projektet + Krav 

Man skal have to ting inden:

- **Node.js** (version 18 eller nyere) på computeren — hentes på nodejs.org.
  Tjek med `node -v` i terminalen.
- **Expo Go** på telefonen — findes gratis i App Store og Google Play.

Så klones projektet og startes:

```bash
git clone https://github.com/JonathanMeyhoff/G1_AppRepo.git
cd G1_AppRepo/crewnet
npm install
npx expo start
```

Scan QR-koden med Expo Go på telefonen.

