import { StyleSheet } from 'react-native';

const colors = {
  background: '#181818',
  topBarBackground: '#1f1f1f',
  topBarTextBold: 'white',
  topBarTextNormal: '#b3b3b3',
  buttonDefault: '#252525',
  buttonGreen: '#38a169',
  buttonRed: '#e53e3e',
  buttonText: 'white',
  buttonBlue: '#007bff', // New color for login button
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.topBarTextBold,
  },
  input: {
    width: 300, // Fixed width
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    width: 300, // Fixed width
    backgroundColor: colors.buttonDefault,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 10,
    color: colors.buttonGreen,
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  link: {
    marginTop: 10,
    color: colors.buttonGreen,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: colors.topBarBackground,
    borderRadius: 8,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: 'center', // Center the logo
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.topBarBackground,
    padding: 22,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  topBarExpanded: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 20,
    width: '320',
  },
  topBarTextBold: {
    color: colors.topBarTextBold,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 3,
  },
  topBarTextNormal: {
    color: colors.topBarTextNormal,
    fontSize: 18,
    padding: 3,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // marginTop: 24,
  },
  button: {
    width: '48%', // Adjust the width to fit two buttons per row
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginVertical: 8, // Add vertical margin for spacing between rows
    borderRadius: 8,
  },
  buttonDefault: {
    backgroundColor: colors.buttonDefault,
  },
  buttonGreen: {
    backgroundColor: colors.buttonGreen,
  },
  buttonRed: {
    backgroundColor: colors.buttonRed,
  },
  buttonIcon: {
    marginBottom: 8,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  textInput: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginHorizontal: 5,
  },
  editContainer: {
    width: '280',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelText: {
    color: colors.topBarTextNormal,
    fontSize: 16,
    width: 120,
  },
  Dropinput: {
    flex: 1,
    color: colors.topBarTextBold,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.topBarTextNormal,
    padding: 5,
    width: 200,
  },
  expandedInfo: {
    width: '100%',
    marginTop: 12,
  },
  infoText: {
    color: colors.topBarTextBold,
    fontSize: 16,
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: colors.buttonDefault,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.buttonGreen,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  saveButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  LogoutButton: {
    backgroundColor: colors.buttonRed,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  LogoutButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonBlue: {
    backgroundColor: colors.buttonBlue,
  },
});