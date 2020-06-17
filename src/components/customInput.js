import { StyleSheet, TextInput, View } from "react-native";

import React from "react";

const CustomInputText = (props) => (
  <View
    style={[
      inputStyles.inputContainer,
      { shadowColor: props.theme === "dark" ? "#dcdcdc" : "#2e2e2e" },
    ]}
  >
    <TextInput {...props} />
  </View>
);

const CustomInputList = ({
  theme,
  items,
  handlePickerItemChange,
  handlePickerItemBlur,
}) => (
  <>
    {items.map(({ placeholder, value }) => (
      <CustomInputText
        key={placeholder}
        theme={theme}
        placeholder={placeholder}
        placeholderTextColor="#888"
        onChange={handlePickerItemChange}
        onBlur={handlePickerItemBlur}
        value={value}
        style={[
          inputStyles.inputText,
          { color: theme === "dark" ? "#dcdcdc" : "#2e2e2e" },
        ]}
      />
    ))}
  </>
);

export const inputStyles = StyleSheet.create({
  inputContainer: {
    width: 130,
    height: "auto",
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "transparent",
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    marginVertical: "0.125rem",
    overflow: "hidden",
  },
  inputText: {
    paddingVertical: "0.25rem",
    fontFamily: "bungee, cursive",
    lineHeight: "1rem",
    fontSize: "0.7rem",
    textAlign: "center",
  },
});

export default CustomInputList;
