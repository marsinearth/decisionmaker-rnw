import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native'

const CustomInputText = props => (
  <View style={inputStyles.inputContainer}>
    <TextInput {...props} />
  </View>
)

const CustomInputList = ({ 
  items,
  handlePickerItemChange, 
  handlePickerItemBlur
}) => (
  <>
    {items.map(({ placeholder, value }) => (
      <CustomInputText
        key={placeholder}
        placeholder={placeholder}        
        placeholderTextColor="#888"
        onChange={handlePickerItemChange}
        onBlur={handlePickerItemBlur}
        value={value}
        style={inputStyles.inputText}
      />
    ))}
  </>
)

export const inputStyles = StyleSheet.create({
  inputContainer: {
    width: 130,
    height: 'auto',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'transparent',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    marginVertical: '0.125rem',
    overflow: 'hidden'
  },
  inputText: {
    paddingVertical: '0.25rem',
    fontFamily: 'bungee, cursive',
    lineHeight: "1rem",
    fontSize: "0.7rem",
    textAlign: "center"  
  }
})

export default CustomInputList
