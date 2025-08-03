import axios from 'axios';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AgentHome() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendTask = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://192.168.1.10:3000/api/task', { task: input });
      setResponse(res.data.response || JSON.stringify(res.data));
    } catch (err) {
      setResponse(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Meta Agent</Text>
      <TextInput
        style={styles.input}
        placeholder="What should I build or do?"
        placeholderTextColor="#aaa"
        value={input}
        onChangeText={setInput}
        multiline
      />
      <Button title={loading ? 'Working...' : 'Execute'} onPress={sendTask} disabled={loading || !input} />
      <ScrollView style={styles.output}>
        <Text style={styles.outputText}>{response}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f2c',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#6db3f2',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e2a47',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  output: {
    marginTop: 20,
    backgroundColor: '#1e2a47',
    padding: 15,
    borderRadius: 8,
    maxHeight: 300,
  },
  outputText: {
    color: '#d1e8ff',
    fontFamily: 'monospace',
  },
});
