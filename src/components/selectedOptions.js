import CustomInputList, { inputStyles } from "./customInput";
import { Text, TextInput, View } from "react-native";

import React from "react";

const SelectedOptions = ({
  theme,
  selectedOption,
  textStyle,
  items,
  numRange,
  handleInputChange,
  handlePickerItemChange,
  handlePickerItemBlur,
}) => {
  switch (selectedOption) {
    case "T/F":
      return (
        <>
          <Text style={textStyle}>{"True / False"}</Text>
          <CustomInputList items={items} theme={theme} fixed />
        </>
      );
    case "numbers":
      return (
        <>
          <Text style={textStyle}>{"Select Range of Numbers"}</Text>
          {["from", "to"].map((adverb, i) => (
            <View
              key={adverb}
              style={[
                inputStyles.inputContainer,
                { shadowColor: theme === "dark" ? "#dcdcdc" : "#2e2e2e" },
              ]}
            >
              <TextInput
                name={adverb}
                placeholder={`Number ${adverb}`}
                onChange={handleInputChange}
                value={numRange[i]}
                style={[
                  inputStyles.inputText,
                  {
                    color: theme === "dark" ? "#dcdcdc" : "black",
                  },
                ]}
                keyboardType="numeric"
              />
            </View>
          ))}
        </>
      );
    default:
      return (
        <>
          <Text style={textStyle}>{"Type Custom Items"}</Text>
          <CustomInputList
            items={items}
            theme={theme}
            handlePickerItemChange={handlePickerItemChange}
            handlePickerItemBlur={handlePickerItemBlur}
          />
        </>
      );
  }
};

export default SelectedOptions;
