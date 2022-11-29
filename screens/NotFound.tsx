import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import AuthContext, { selectorIsAuth } from '../context/AuthService';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';


export default function NotAuthorizedScreen({navigation}: RootStackScreenProps<'NotFound'>) {
  const authContext = useContext(AuthContext)
  const isAuth = selectorIsAuth(authContext)
  const colorScheme = useColorScheme()
  const loadingColor = useMemo(() => colorScheme === 'dark' ? Colors.dark.loading : Colors.light.loading, [colorScheme])
  console.log('NotAuthorizedScreen')
  React.useEffect(() => {
    if (isAuth) {
      navigation.replace('Authorized')
    } else {
      navigation.replace('NotAuthorized')
    }
    
  }, [isAuth]);


  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={loadingColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
