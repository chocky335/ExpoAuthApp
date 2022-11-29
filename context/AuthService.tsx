import { TokenResponse } from "expo-auth-session";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

export type SupportedProvider = 'facebook' | 'google'

interface AuthorizingData<Provider = SupportedProvider> {
    provider: Provider,
    isLoading: true
}
interface AuthorizedData<Provider = SupportedProvider> {
    provider: Provider,
    token: TokenResponse,
    isLoading: boolean
}
interface FailedAuthorizingData<Provider = SupportedProvider> {
    provider: Provider,
    error: string,
    isLoading: false
}
type AuthorizeData<Provider = SupportedProvider> =
    AuthorizingData<Provider>
    | AuthorizedData<Provider>
    | FailedAuthorizingData<Provider>
    | null
    | 'init'

type AuthorizeContext<Provider = SupportedProvider> = {
    state: AuthorizeData<Provider>,
    startOAuth: (provider: Provider) => void,
    authorizeSucceed: (token: TokenResponse) => void,
    authorizeFailed: (error: string) => void,
    logout: () => void,
}

const defaultAuth = {
    state: null,
    startOAuth: () => {},
    authorizeSucceed: () => {},
    authorizeFailed: () => {},
    logout: () => {},
}

const AuthContext = React.createContext<AuthorizeContext>(defaultAuth);

const mapStateToContext = ({
    provider, error, token
}: {
    provider: SupportedProvider | null,
    error: string | null,
    token: TokenResponse | null,
}): AuthorizeContext['state'] => {
    if (provider && error) {
        return {
            provider,
            error,
            isLoading: false
        }
    }

    if (provider && token) {
        return {
            token,
            provider,
            isLoading: false
        }
    }

    if (provider) {
        return {
            provider,
            isLoading: true
          }
    }

    return null
}
const AUTH_STORE_KEY = '__Auth';

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [provider, setProvider] = useState<SupportedProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<TokenResponse | null>(null);

  const authorizeSucceed = useCallback((token: TokenResponse) => {
    const authValue = JSON.stringify({provider, token});
    
    if (Platform.OS === 'web') {
        AsyncStorage.setItem(AUTH_STORE_KEY, authValue)
    } else {
        SecureStore.setItemAsync(AUTH_STORE_KEY, authValue);
    }

    setToken(token)
  }, [provider]);

  const logout = useCallback(() => {
    if (Platform.OS === 'web') {
        AsyncStorage.removeItem(AUTH_STORE_KEY)
    } else {
        SecureStore.deleteItemAsync(AUTH_STORE_KEY);
    }

    setToken(null)
    setProvider(null)
    setError(null)
  }, []);


  useEffect(() => {
    const presistHandler = (persistedValue: string | null) => {
        if (persistedValue) {
            const {provider, token} = JSON.parse(persistedValue)
            setProvider(provider)
            setToken(token)
        }
    }

    if (Platform.OS === 'web') {
        AsyncStorage.getItem(AUTH_STORE_KEY).then(presistHandler)
    } else {
        SecureStore.getItemAsync(AUTH_STORE_KEY).then(presistHandler)
    }
  }, [])


  const contextValue = mapStateToContext({ provider, error, token })

  return (
    <AuthContext.Provider value={{
        state: contextValue,
        startOAuth: setProvider,
        authorizeSucceed,
        authorizeFailed: setError,
        logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
export const selectorIsAuth = ({state}: AuthorizeContext<SupportedProvider>) => state && state !== 'init' && 'token' in state
export const selectorIsLoading = ({state}: AuthorizeContext<SupportedProvider>) => state === 'init' || state?.isLoading
export const selectorLoadingProvider = ({state}: AuthorizeContext<SupportedProvider>): SupportedProvider | null => state && state !== 'init' && 'isLoading' in state && state.isLoading
    ? state.provider
    : null
export const selectorError = ({state}: AuthorizeContext<SupportedProvider>): string | null => state && state !== 'init' && 'error' in state
    ? state.error
    : null

export default AuthContext;