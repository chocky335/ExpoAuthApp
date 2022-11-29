
import { StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import React from 'react';
import { TokenResponse } from 'expo-auth-session';

import PrimaryButton from './StyledButton';

interface Props<Provider = 'facebook' | 'google'> {
  isLoading?: boolean
  provider: Provider
  authConfig?: Provider extends 'facebook'
    ? Partial<Facebook.FacebookAuthRequestConfig>
    : Partial<Google.GoogleAuthRequestConfig>
  authHook: Provider extends 'facebook'
    ? typeof Facebook.useAuthRequest
    : typeof Google.useAuthRequest
  successCallback: (result: TokenResponse) => void
  errorCallback: (err: string) => void
  startOAuth: (provider: Provider) => void
}

export default function AuthButton({
  provider,
  authConfig,
  authHook,
  successCallback,
  errorCallback,
  isLoading,
  startOAuth
}: Props) {
  const [request, response, promptAsync] = authHook(authConfig);

  React.useEffect(() => {
    if (response?.type === 'dismiss' || response?.type === 'cancel') {
      errorCallback(`${provider.toUpperCase()} Authentication was ${response?.type}ed`)
    }
    if (response?.type === 'success' && response.authentication) {
      successCallback(response.authentication)
    }
    if (response?.type === 'error' && response.error) {
      errorCallback(response.error.message)
    }
  }, [response]);
  const onPress = React.useCallback(() => {
    startOAuth(provider)
    promptAsync()
  }, [provider, startOAuth, promptAsync]);


  return (
    <PrimaryButton isLoading={isLoading} disabled={!request} onPress={onPress} title={`Login with ${provider}`} />
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.light.buttonTint
  },
});
