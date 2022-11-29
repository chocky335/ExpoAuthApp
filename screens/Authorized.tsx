import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import PrimaryButton from '../components/StyledButton';
import { MonoText } from '../components/StyledText';

import { View } from '../components/Themed';
import AuthContext from '../context/AuthService';
import useEmail from '../hooks/useEmail';
import { RootStackScreenProps } from '../types';

export default function AuthorizedScreen({}: RootStackScreenProps<'Authorized'>) {
  const email = useEmail()
  const {state, logout} = useContext(AuthContext)
  const provider = state && typeof state !== 'string' && state.provider || ''

  return (
    <View style={styles.container}>
      <MonoText>Provider: {provider}</MonoText>
      <MonoText>{email}</MonoText>
      <PrimaryButton onPress={logout} title={'Logout'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
