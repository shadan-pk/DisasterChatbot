import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const sendMessage = () => {
    if (input.trim()) {
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');
      // AI Response Logic Here
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
            {item.text}
          </Text>
        )}
      />
      <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Ask about disasters..." />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  userText: { textAlign: 'right', color: 'blue' },
  botText: { textAlign: 'left', color: 'green' },
});

export default ChatScreen;
