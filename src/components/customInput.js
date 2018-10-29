import React from 'react';
import { View, TextInput } from 'react-native'
import { inputStyles } from './App'

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

export default CustomInputList
