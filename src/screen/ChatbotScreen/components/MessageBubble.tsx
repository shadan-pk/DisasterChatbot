import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formattedTime = message.timestamp ? 
    (message.timestamp instanceof Date ? 
      message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
      new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ) : '';

  return (
    <View style={[
      styles.messageBubble,
      message.sender === 'user' ? styles.userMessage : styles.botMessage,
      message.isEmergency && message.sender === 'user' ? styles.emergencyUserMessage : null,
      message.isEmergency && message.sender === 'bot' ? styles.emergencyBotMessage : null,
    ]}>
      {message.isEmergency && (
        <View style={styles.emergencyBadge}>
          <Ionicons name="warning" size={12} color="#fff" />
          <Text style={styles.emergencyBadgeText}>EMERGENCY</Text>
        </View>
      )}
      <Text style={[
        styles.messageText,
        message.isEmergency ? styles.emergencyMessageText : null
      ]}>
        {message.text}
      </Text>
      <Text style={styles.timestamp}>
        {formattedTime}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  emergencyUserMessage: {
    backgroundColor: '#FFCDD2',
  },
  emergencyBotMessage: {
    backgroundColor: '#FFEBEE',
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  emergencyBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
  },
  emergencyMessageText: {
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: '#7F7F7F',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default MessageBubble;