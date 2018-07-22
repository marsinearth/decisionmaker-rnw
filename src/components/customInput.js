import React, { Fragment } from 'react';
import { View, TextInput, StyleSheet } from 'react-native'

const CustomInputText = props => (
  <View>
    <TextInput {...props} />
  </View>
)

const CustomInputList = ({ 
  items,
  handlePickerItemChange, 
  handlePickerItemBlur
}) => (
  <Fragment>
    {items.map(({ placeholder, value }) => (
      <CustomInputText
        key={placeholder}
        placeholder={placeholder}        
        onChange={handlePickerItemChange}
        onBlur={handlePickerItemBlur}
        value={value}
        // blur={removeInputText}
      />
    ))}
  </Fragment>
)

export default CustomInputList
