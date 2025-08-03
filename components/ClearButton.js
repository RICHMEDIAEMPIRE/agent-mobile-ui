import React from 'react';
import { Text } from 'react-native';
import styles from '../styles';

export default function ClearButton({ onPress, disabled }) {
  return (
    <Text
      style={[styles.clearButton, disabled && styles.clearButtonDisabled]}
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
    >
      Clear
    </Text>
  );
}
