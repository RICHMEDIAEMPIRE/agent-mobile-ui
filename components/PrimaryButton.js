import React from 'react';
import { Text, View } from 'react-native';
import styles from '../styles';

export default function PrimaryButton({ title, onPress, disabled }) {
  return (
    <View style={styles.primaryButtonContainer}>
      <Text
        style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
        onPress={disabled ? undefined : onPress}
        accessibilityRole="button"
      >
        {title}
      </Text>
    </View>
  );
}
