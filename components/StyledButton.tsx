import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';

import React, { useMemo } from 'react';
import useColorScheme from '../hooks/useColorScheme';
import { MonoText } from './StyledText';


interface Props {
  isLoading?: boolean
  disabled?: boolean
  onPress?: () => void
  title: string
}

export default function PrimaryButton({
  disabled,
  isLoading,
  onPress,
  title
}: Props) {
  const colorScheme = useColorScheme()
  const colorStyle = useMemo(() => ({
    backgroundColor: colorScheme === 'dark' ? Colors.dark.button : Colors.light.button
  }), [colorScheme])
  const colorTextStyle = useMemo(() => ({
    color: colorScheme === 'dark' ? Colors.dark.buttonTint : Colors.light.buttonTint
  }), [colorScheme])
  const loadingColor = useMemo(() => colorScheme === 'dark' ? Colors.dark.loading : Colors.light.loading, [colorScheme])


  if (isLoading) {
    return (
      <TouchableOpacity disabled style={[styles.container,colorStyle]}>
        <ActivityIndicator color={loadingColor} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.container,colorStyle]}>
      <MonoText style={colorTextStyle}>{title}</MonoText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    minWidth: '30%',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
