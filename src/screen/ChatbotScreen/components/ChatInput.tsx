import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  inputText: string;
  isLoading: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onEmergencyPress: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  isLoading,
  onChangeText,
  onSend,
  onEmergencyPress,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={styles.emergencyMenuButton}
        onPress={onEmergencyPress}
      >
        <Ionicons name="warning" size={24} color="red" />
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        multiline
        maxLength={500}
      />
      
      <TouchableOpacity 
        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!inputText.trim() || isLoading}
      >
        <Ionicons name="send" size={20} color={inputText.trim() ? "#fff" : "#A0A0A0"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  emergencyMenuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});

export default ChatInput;
