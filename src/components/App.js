import React, { PureComponent, Fragment } from 'react'
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
import Slotmachine from './slotmachine'
import { findReactElement } from '../utils'
import cogito from '../assets/cogito_loading.gif'

/* const Link = props => (
  <Text
    {...props}
    accessibilityRole="link"
    style={[styles.link, props.style]}
  />
); */

export default class App extends PureComponent {
  state = {
    selectedOption: 'custom',
    question: '',
    maxInputIndex: 1,
    fromNum: undefined,
    toNum: undefined,
    items: [{
      placeholder: 'item 1',
      value: ''
    }],
    answer: '',
    disabled: true
  }

  componentDidUpdate(prevProps, prevState) {
    const { items, items: { length: itemsLen }, selectedOption, fromNum, toNum } = this.state
    const { items: { length: prevItemsLen }} = prevState
    let { disabled } = this.state
    if (itemsLen !== prevItemsLen) {
      if (selectedOption === 'custom') {
        disabled = items[0].value.trim() === ''
      } else {
        disabled = !fromNum || !toNum
      }
      this.setState({ disabled })
    }    
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
    const { currentTarget: { placeholder, value } = {}} = e
    const inputIndex = items.findIndex(input => input.placeholder === placeholder)
    if (String(value).trim() === '' && inputIndex !== items.length - 1) {
      this.setState(
        produce(draft => {
          draft.items.splice(inputIndex, 1)
        })
      )
    } else if (String(value).trim() !== '' && inputIndex === items.length - 1) {
      this.addInputItem(placeholder)
    }
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

  addInputItem = placeholder => {
    let { maxInputIndex } = this.state
    const itemIndex = Number(placeholder.slice(-1))
    if (itemIndex > maxInputIndex) {
      maxInputIndex = itemIndex
    }
    const newItem = {
      placeholder: `item ${++maxInputIndex}`,
      value: ''
    }
    this.setState(
      produce(draft => {
        draft.items.push(newItem)
      })
    )
  }

  answerOn = answer => {
    this.setState({ answer })
  }

  render() {
    const { 
      items, 
      selectedOption, 
      fromNum, 
      toNum, 
      question, 
      answer,
      disabled 
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
          <Text 
            style={styles.title}
            accessibilityRole="heading"
            aria-level="2"
          >
            Decision Maker{"\n"} on React Native for Web
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
              placeholderTextColor="orange"
              onChange={this.handleInputChange}
              value={question}
              multiline
              style={styles.questionText}
            />
          </View>        
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>
              Answer
            </Text>
            <TextInput
              editable={false}
              value={answer}
            />
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
          <Slotmachine
            option={selectedOption}
            items={items}
            fromNum={fromNum}
            toNum={toNum}
            onSubmitClick={this.handleSubmit}
            disabled={disabled}
            answer={this.answerOn}
          />
          {/* <Picker>
            {items.map((item, i) =>(
              <Picker.Item 
                key={i}
                label="label"
                value="value"
              />
            ))}
          </Picker>*/}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: "auto"
  },
  logo: {
    height: 130
  },
  header: {
    height: 'auto',    
  },
  title: {
    fontFamily: 'bungee, cursive',
    fontWeight: 'bold',
    fontSize: "1.5rem",
    marginVertical: "1em",
    textAlign: "center",
    color: 'slategray'
  },
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    justifyContent: 'center',
    // alignItems: 'center',
    borderWidth: 0,
  },
  questionText: {
    width: '100%',
    minHeight: 68,
    wordWrap: 'break-word',
    justifyContent: 'center',
    paddingVertical: '1rem',
    lineHeight: '2rem',
    fontFamily: 'bungee, cursive',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    outline: 'none',
    textAlign: 'center'
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text: {
    fontFamily: 'bungee, cursive',
    lineHeight: "1.125rem",
    fontSize: "0.85rem",
    marginVertical: "0.3rem",
    color: '#888',
    textAlign: "center"    
  },
  link: {
    color: "#1B95E0"
  },
  code: {
    fontFamily: "monospace, monospace"
  }
});
