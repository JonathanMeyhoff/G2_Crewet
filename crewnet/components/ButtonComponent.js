import { Pressable, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

//ButtonComponent funktionen lægger et felt med tekst og styling sammen. Funktionen efterlader plads til at funkstionselementerne kan udfyldes senere. 
export default function ButtonComponent({ title, onPress }) {
    return (
      <Pressable style={globalStyles.knap} onPress={onPress}>
        <Text style={globalStyles.knapTekst}>{title}</Text>
      </Pressable>
    );
  }