import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import InputForm from './components/InputForm';
import ResponseBox from './components/ResponseBox';
import useRecorder from './hooks/useRecorder';
import styles from './styles';
import { sendTaskRequest } from './utils/api';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode] = useState('default');

  const {
    startRecording,
    stopRecording,
    isRecording,
    getTranscription,
  } = useRecorder();

  const handleSendTask = async () => {
    if (!input.trim()) {
      setResponse('Please enter a command.');
      return;
    }
    setLoading(true);
    setResponse('');
    try {
      const result = await sendTaskRequest(input, mode);
      setResponse(result || 'No response.');
    } catch (error) {
      setResponse(error?.message || 'Error contacting agent.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResponse('');
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🧠 Meta Agent</Text>
      <Text style={styles.subtitle}>Give commands. Build empires.</Text>

      <InputForm
        value={input}
        onChange={setInput}
        onSubmit={handleSendTask}
        loading={loading}
        onClear={handleClear}
      />

      {/* Microphone button in a visible container */}
      <View style={styles.micButtonContainer}>
        <TouchableOpacity
          style={styles.micButton}
          onPress={handleMicPress}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎤'}</Text>
        </TouchableOpacity>
      </View>

      <ResponseBox response={response} />
    </SafeAreaView>
  );
}
