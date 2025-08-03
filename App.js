import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import InputForm from './components/InputForm';
import ResponseBox from './components/ResponseBox';
import useRecorder from './hooks/useRecorder';
import styles from './styles';
import { sendTaskRequest } from './utils/api';

/**
 * Main App component for Meta Agent.
 * Modular, scalable, and ready for future extensibility.
 */
export default function App() {
  // State hooks for user input, API response, loading, and mode (for future extensibility)
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode] = useState('default'); // Placeholder for future command/mode support

  // Recorder hook for microphone input
  const {
    startRecording,
    stopRecording,
    isRecording,
    getTranscription,
  } = useRecorder();

  /**
   * Handles sending the user's task to the backend agent.
   * Uses the helper function for the API call.
   */
  const handleSendTask = async () => {
    if (!input.trim()) {
      setResponse('Please enter a command.');
      return;
    }
    setLoading(true);
    setResponse(''); // Clear previous response
    try {
      // In future, pass mode as well for multi-mode support
      const result = await sendTaskRequest(input, mode);
      setResponse(result || 'No response.');
    } catch (error) {
      setResponse(error?.message || 'Error contacting agent.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clears both input and response.
   */
  const handleClear = () => {
    setInput('');
    setResponse('');
  };

  /**
   * Handles microphone button press:
   * - Starts recording if not recording
   * - Stops and transcribes if already recording
   * - Inserts transcript into input
   */
  const handleMicPress = async () => {
    if (!isRecording) {
      try {
        await startRecording();
      } catch (err) {
        setResponse('Microphone error: ' + (err?.message || 'Could not start recording.'));
      }
    } else {
      try {
        await stopRecording();
        const transcript = await getTranscription();
        if (transcript) {
          setInput(prev => (prev ? prev + ' ' : '') + transcript);
        } else {
          setResponse('No speech detected.');
        }
      } catch (err) {
        setResponse('Transcription error: ' + (err?.message || 'Could not transcribe.'));
      }
    }
  };

  // Ensure mic button is always visible and not hidden by layout or padding.
  // Use KeyboardAvoidingView for better mobile UX.
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <Text style={styles.title}>🧠 Meta Agent</Text>
        <Text style={styles.subtitle}>Give commands. Build empires.</Text>

        <InputForm
          value={input}
          onChange={setInput}
          onSubmit={handleSendTask}
          loading={loading}
          onClear={handleClear}
        />

        {/* Microphone button: ensure it's visible and styled correctly */}
        <View style={styles.micButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording ? styles.micButtonActive : null,
              loading ? styles.micButtonDisabled : null,
            ]}
            onPress={handleMicPress}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
            testID="mic-button"
          >
            <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎤'}</Text>
          </TouchableOpacity>
        </View>

        <ResponseBox response={response} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}