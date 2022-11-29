/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotAuthorizedScreen from '../screens/NotAuthorized';
import AuthorizeScreen from '../screens/Authorized';
import NotFoundScreen from '../screens/NotFound';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import AuthContext, { selectorIsAuth, selectorIsLoading } from '../context/AuthService';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const authState = React.useContext(AuthContext)
  const isAuth = selectorIsAuth(authState)

  return (
    <Stack.Navigator>
      {!isAuth && <Stack.Screen name="NotAuthorized" component={NotAuthorizedScreen} options={{ title: 'Please authorize' }} />}
      {isAuth && <Stack.Screen name="Authorized" component={AuthorizeScreen} options={{ title: 'Authorized' }} />}
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}
