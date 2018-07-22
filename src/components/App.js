import React, { Component, Fragment } from 'react'
import { 
  Image, 
  StyleSheet, 
  Text, 
  TextInput,
  View, 
  Picker 
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import produce from 'immer'
import CustomInputList from './customInput'
import { findReactElement } from '../utils'
import cogito from '../assets/cogito_loading.gif'

/* const Link = props => (
  <Text
    {...props}
    accessibilityRole="link"
    style={[styles.link, props.style]}
  />
); */

 

export default class App extends Component {
  state = {
    selectedOption: 'custom',
    question: '',
    maxInputIndex: 1,
    fromNum: undefined,
    toNum: undefined,
    nums: [],
    items: [{
      placeholder: 'item 1',
      value: ''
    }],
    answer: ''
  }

  handlePickerItemChange = e => {
    const { placeholder: name, value } = e.currentTarget
    this.setState(
      produce(draft => {
        draft.items.forEach(({ placeholder }, i) => {
          if (placeholder === name) {
            draft.items[i].value = value
          }
        })
      })
    )
  }
  
  handlePickerItemBlur = e => {
    const { items } = this.state
    let maxIndex = 1
    const blankIndices = []
    items.forEach(({ placeholder, value }, i) => {
      if (String(value).trim() === '') { // find blank value of the items
        blankIndices.push(i)
      }
      const itemIndex = Number(placeholder.slice(-1))
      if (itemIndex > maxIndex) { // replace the bigger item number to get the maximum number
        maxIndex = itemIndex
      }
    })
    this.setState(
      produce(draft => {
        if (items.length > 1 && blankIndices.length > 1) {
          blankIndices.forEach((blankIndex, i, arr) => { // remove blank value items
            if (i !== arr.length - 1) {
              draft.items.splice(blankIndex, 1)
            }
          })
        } else if (blankIndices.length === 0) {
          const newItem = {
            placeholder: `item ${maxIndex + 1}`,
            value: ''
          }
          draft.items.push(newItem) // add a new item with 1 higher than the maximum item number         
        } 
      })
    )
  }

  handleInputChange = e => { // question and fromNum, toNum
    const re = new RegExp('^\\d*$', 'g')
    const { name, value } = e.currentTarget;
    let filteredValue = value
    if (name.endsWith('Num') && !re.test(value)) {
      filteredValue = this.state[name]    
    }
    this.setState({ [name]: filteredValue })
  }
  
  handleSelectType = e => {
    const { currentTarget } = e
    const extractedCurrentTarget = findReactElement(currentTarget) 
    const { props: { name } = {}} = extractedCurrentTarget
    this.setState({ selectedOption: name })
  }

  answerOn = answer => {
    this.setState({ answer });
  }

  render() {
    const { 
      items, 
      selectedOption, 
      fromNum, 
      toNum, 
      question, 
      answer 
    } = this.state
    return (
      <View style={styles.app}>
        <View style={styles.header}>
          <Image
            accessibilityLabel="React logo"
            source={cogito}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>
            Decision Maker on React Native for Web
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.text}>
            The question
          </Text>
          <View style={styles.questionContainer}>
            <TextInput
              name="question"
              placeholder="type your question here"
              onChange={this.handleInputChange}
              value={question}
              multiline
              numberOfLines={1}
            />
          </View>        
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>
              Answer
            </Text>
          </View>
          <View style={styles.typeContainer}>
            <CheckBox
              title="Custom"
              name="custom"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={selectedOption === 'custom'}
              onPress={this.handleSelectType}
            />
            <CheckBox
              title="Numbers"
              name="numbers"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={selectedOption === 'numbers'}
              onPress={this.handleSelectType}
            />
          </View>
          <View style={styles.inputListContainer}>
            {selectedOption === 'custom' ? (
              <Fragment>
                <Text style={styles.inputListTitleText}>
                  Type Custom Items
                </Text>
                <CustomInputList
                  items={items}
                  handlePickerItemChange={this.handlePickerItemChange}
                  handlePickerItemBlur={this.handlePickerItemBlur}
                />
              </Fragment>
            ) : (
              <Fragment>
                <Text style={styles.inputListTitleText}>
                  Select Range of Numbers
                </Text>
                <TextInput
                  name="fromNum"
                  placeholder="Number from"
                  onChange={this.handleInputChange}
                  value={fromNum}
                />
                <TextInput
                  name="toNum"
                  placeholder="Number to"
                  onChange={this.handleInputChange}
                  vlue={toNum}
                />
              </Fragment>
            )}
          </View> 
          <Picker>
            {items.map((item, i) =>(
              <Picker.Item 
                key={i}
                label="label"
                value="value"
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    marginHorizontal: "auto",
    maxWidth: 500
  },
  logo: {
    height: 130
  },
  header: {
    height: 'auto',    
  },
  title: {
    fontWeight: 'bold',
    fontSize: "1.5rem",
    marginVertical: "1em",
    textAlign: "center",
    color: 'slategray'
  },
  mainContainer: {
    padding: 20
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text: {
    lineHeight: "1.5em",
    fontSize: "1.125rem",
    marginVertical: "1em",
    textAlign: "center"
  },
  link: {
    color: "#1B95E0"
  },
  code: {
    fontFamily: "monospace, monospace"
  }
});
