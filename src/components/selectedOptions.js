import React from 'react'
import {
	TextInput,
	View,
	Text
} from 'react-native'
import CustomInputList, { inputStyles } from './customInput'

const SelectedOptions = ({ 
	selectedOption,
	textStyle,
	items,
	numRange,
	handleInputChange,
	handlePickerItemChange,
	handlePickerItemBlur
}) => {
	switch(selectedOption) {
		case 'T/F':
			return (
				<>
	        <Text style={textStyle}>
	          True / False
	        </Text>
	        <CustomInputList
	          items={items}
          	fixed
	        />
	      </>
			)
		case 'numbers':
			return (
				<>
	        <Text style={textStyle}>
	          Select Range of Numbers
	        </Text>
	        {['from', 'to'].map((adverb, i) => (
	          <View
	            key={adverb}
	            style={inputStyles.inputContainer}
	          >
	            <TextInput                      
	              name={adverb}
	              placeholder={`Number ${adverb}`}
	              onChange={handleInputChange}
	              value={numRange[i]}
	              style={inputStyles.inputText}
	              keyboardType="numeric"
	            />
	          </View>
	        ))}
	      </>
			)
		default:
			return (
				<>
	        <Text style={textStyle}>
	          Type Custom Items
	        </Text>
	        <CustomInputList
	          items={items}
	        handlePickerItemChange={handlePickerItemChange}
          handlePickerItemBlur={handlePickerItemBlur}
	        />
	      </>
			)
		}
	}
	
	export default SelectedOptions