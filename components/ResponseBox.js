import React from 'react';
import { Text, View } from 'react-native';
import styles from '../styles';

/**
 * Reusable response/output box.
 * Props:
 *   response: string (output text)
 */
export default function ResponseBox({ response }) {
  return (
    <View style={styles.outputBox}>
      <Text style={styles.outputText}>{response}</Text>
    </View>
  );
}
