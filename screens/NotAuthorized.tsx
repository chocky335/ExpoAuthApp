import React, { useContext } from 'react';
import { Platform, StyleSheet } from 'react-native';

import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';

import AuthButton from '../components/AuthButton';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import env from '../env.json';
import AuthContext, { selectorError, selectorLoadingProvider } from '../context/AuthService';
import { MonoText } from '../components/StyledText';


WebBrowser.maybeCompleteAuthSession();


const googleAuthConfig = {
  androidClientId: env.GOOGLE_ANDROID_ID,
  webClientId: env.GOOGLE_WEB_ID,
}
const facebookAuthConfig = {
  clientId: env.FACEBOOK_ID,
  responseType: ResponseType.Token,
}

export default function NotAuthorizedScreen({}: RootStackScreenProps<'NotAuthorized'>) {
  const authContext = useContext(AuthContext)
  const {authorizeSucceed, authorizeFailed, startOAuth} = authContext
  const loadingProvider = selectorLoadingProvider(authContext)
  const isFacebookLoading = loadingProvider === 'facebook'
  const isGoogleLoading = loadingProvider === 'google'
  const error = selectorError(authContext)

  React.useEffect(() => {
    if (Platform.OS !== 'web') WebBrowser.warmUpAsync();

    return () => {
      if (Platform.OS !== 'web') WebBrowser.coolDownAsync();
    };
  }, []);


  return (
    <View style={styles.container}>
      {error && <MonoText>Error: {error}</MonoText>}
      {error && <View style={styles.separator} />}
      <AuthButton
        provider="google"
        authConfig={googleAuthConfig}
        authHook={Google.useAuthRequest}
        successCallback={authorizeSucceed}
        errorCallback={authorizeFailed}
        startOAuth={startOAuth}
        isLoading={isGoogleLoading}
      />

      <View style={styles.separator} />

      <AuthButton
        provider="facebook"
        authConfig={facebookAuthConfig}
        authHook={Facebook.useAuthRequest}
        successCallback={authorizeSucceed}
        errorCallback={authorizeFailed}
        startOAuth={startOAuth}
        isLoading={isFacebookLoading}
      />
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
