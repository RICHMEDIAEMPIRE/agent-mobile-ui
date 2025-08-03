import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../styles';

/**
 * Reusable input form for commands or tasks.
 */
export default function InputForm({ value, onChange, onSubmit, loading, onClear }) {
  return (
    <View>
      <Text style={styles.label}>Command</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChange}
          editable={!loading}
          placeholder="What do you want to build today?"
          placeholderTextColor="#99bbff"
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="sentences"
          returnKeyType="send"
          onSubmitEditing={onSubmit}
        />
        <TouchableOpacity
          onPress={onClear}
          disabled={loading || !value}
        >
          <Text style={[
            styles.clearButton,
            (loading || !value) && styles.clearButtonDisabled
          ]}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          style={[
            styles.primaryButtonContainer,
            loading && styles.primaryButtonDisabled
          ]}
        >
          <Text style={styles.primaryButton}>
            {loading ? 'Processing...' : 'Execute'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
