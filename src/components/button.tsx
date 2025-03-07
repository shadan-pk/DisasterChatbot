import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface ButtonProps {
  icon: string;
  text: string;
  highlight?: "green" | "red";
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ icon, text, highlight, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        highlight === "green" ? styles.buttonGreen :
        highlight === "red" ? styles.buttonRed :
        styles.buttonDefault
      ]}
      onPress={onPress} // Ensure onPress is passed to TouchableOpacity
    >
      <Icon name={icon} size={30} color="white" style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#007bff",
  },
  buttonGreen: { backgroundColor: "green" },
  buttonRed: { backgroundColor: "red" },
  buttonDefault: { backgroundColor: "#007bff" },
  icon: { marginRight: 10 },
  text: { color: "white", fontSize: 16 },
});
