import React, { PureComponent, Fragment, createRef } from 'react'
import { 
  Image, 
  StyleSheet, 
  Text, 
  TextInput,
  View,
  TouchableHighlight
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import produce from 'immer'
import ErrorBoundary from './errorBoundary'
import CustomInputList from './customInput'
import SlotMachine from './slotmachine'
import { findReactElement } from '../utils'
import cogito from '../assets/cogito_loading.gif'

const initialItems = [{
  placeholder: 'item 1',
  value: ''
}]

export const BottomButton = ({ title, onPress, disabled, confirmColor, leftMargin, onPressOut }) => (
  <View style={leftMargin}>
    <TouchableHighlight
      activeOpacity={0.5} 
      underlayColor="#d7dbdd"
      disabled={disabled} 
      onPress={onPress}
      onPressOut={onPressOut}
    >
      <View style={styles.readyBtnContainer}>
        <Text style={[styles.readyBtnText, { color: disabled ? '#888' : confirmColor }]}>
          {title}
        </Text>
      </View>
    </TouchableHighlight>
  </View>
)

export default class App extends PureComponent {
  state = {
    selectedOption: 'custom',
    question: '',
    maxInputIndex: 1,
    numRange: ['', ''],
    items: initialItems,
    answer: '',
    disabled: true
  }

  questionRef = createRef()

  componentDidUpdate(prevProps, prevState) {
    const { items, items: { length: itemsLen }, numRange, numRange: [from, to] } = this.state
    const { items: { length: prevItemsLen }, numRange: [prevFrom, prevTo]} = prevState
    if (itemsLen !== prevItemsLen) {
      this.setState({ disabled: items[0].value.trim() === '' })
    }
    if (from !== prevFrom || to !== prevTo) {
      this.setState({ disabled: numRange.some(range => range === '') })
    }  
  }

  handlePickerItemChange = e => {
    const { items } = this.state
    const { placeholder, value } = e.currentTarget
    const inputIndex = items.findIndex(input => input.placeholder === placeholder)
    if (inputIndex === items.length - 1) {
      this.addInputItem(placeholder)
    }
    this.setState(
      produce(draft => {
        draft.items.forEach((input, i) => {
          if (input.placeholder === placeholder) {
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
    } 
  }

  handleInputChange = e => { // question and numRange
    const re = new RegExp('^\\d*$', 'g')
    const { name, value } = e.currentTarget
    this.setState(
      produce(draft => {
        if (name === 'from') {
          if (re.test(value)) {
            draft.numRange[0] = value
          }
        } else if (name === 'to') {
          if (re.test(value)) {
            draft.numRange[1] = value
          }
        } else {
          draft[name] = value
        }        
      })
    )
  }
  
  handleSelectType = e => {
    const { currentTarget } = e
    const extractedCurrentTarget = findReactElement(currentTarget) 
    let name = 'custom'
    if (process.env.NODE_ENV === 'production') {
      ({ memoizedProps: { name }} = extractedCurrentTarget)
    } else {
      ({ props: { name }} = extractedCurrentTarget)
    }
    this.setState({ selectedOption: name })
  }

  addInputItem = placeholder => {
    let { maxInputIndex } = this.state
    const placeHolderArray = placeholder.split(' ')
    const itemIndex = Number(placeHolderArray[1])
    if (itemIndex > maxInputIndex) {
      maxInputIndex = Number(itemIndex)
    }
    const newItem = {
      placeholder: `item ${maxInputIndex + 1}`,
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

  resetItems = () => {
    const { selectedOption } = this.state
    if (selectedOption === 'numbers') {
      this.setState({ numRange: ['', ''] })
    } else {
      this.setState({ items: initialItems })
    }    
  }

  render() {
    const { 
      items, 
      selectedOption, 
      numRange,
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
            Decision Maker on
            {"\n"}
            React Native for Web
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.text}>
            The question
          </Text>
          <View style={styles.questionContainer}>
            <TextInput
              name="question"
              ref={this.questionRef}
              placeholder="type your question here"
              placeholderTextColor="orange"
              onChange={this.handleInputChange}
              multiline
              value={question}
              style={styles.questionText}
              // onLayout={this.onLoadQuestion}
            />
          </View>    
          {answer !== '' && (
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>
                {answer}
              </Text>
            </View>
          )}
          <Text style={styles.text}>
            Select Type
          </Text>          
          <View style={styles.selectTypeContainer}>
            {['custom', 'numbers'].map(type => (
              <CheckBox
                key={type}
                title={type}
                name={type}
                containerStyle={styles.selectTypeButtonStyle}
                textStyle={styles.selectTypeTextStyle}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#888"
                checked={selectedOption === type}
                onPress={this.handleSelectType}
              />
            ))}
          </View>
          <ErrorBoundary>
            <View style={styles.inputListContainer}>
              {selectedOption === 'custom' ? (
                <Fragment>
                  <Text style={styles.text}>
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
                  <Text style={styles.text}>
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
                        onChange={this.handleInputChange}
                        value={numRange[i]}
                        style={inputStyles.inputText}
                      />
                    </View>
                  ))}
                </Fragment>
              )}
            </View>
          </ErrorBoundary>
          <View style={styles.readyBtnsContainer}>
            <SlotMachine
              option={selectedOption}
              items={items}
              numRange={numRange}
              onSubmitClick={this.handleSubmit}
              disabled={disabled}
              answer={this.answerOn}
            />
            <BottomButton
              title="Reset"
              onPress={this.resetItems}
              confirmColor="#AD5A51"
              disabled={disabled}
              leftMargin={styles.leftMargin}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 35
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
    margin: "1em",
    textAlign: "center",
    color: 'slategray'
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  questionText: {
    width: '80%',
    wordWrap: 'break-word',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: '2rem',
    minHeight: '2rem',
    lineHeight: '2rem',
    fontFamily: 'bungee, cursive',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    outline: 'none',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  answerContainer: {
    marginTop: '1rem'
  },
  answerText: {
    fontFamily: 'bungee, cursive',
    fontSize: "0.85rem",
    fontWeight: 'bold',
    marginVertical: "0.3rem",
    color: '#f08080',
    textAlign: "center"   
  },
  selectTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  selectTypeButtonStyle: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  selectTypeTextStyle: {
    fontFamily: 'bungee, cursive',
    fontSize: "1rem",
    textAlign: "center"    
  },
  text: {
    fontFamily: 'bungee, cursive',
    lineHeight: "1.125rem",
    fontSize: "0.85rem",
    marginVertical: "0.3rem",
    color: '#888',
    textAlign: "center"    
  },
  inputListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '0.5rem',
  },
  readyBtnsContainer: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  readyBtnContainer: {
    width: 60,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#999',
    padding: '0.2rem',
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box'
  },
  leftMargin: {
    marginLeft: 10
  },
  readyBtnText: {
    fontFamily: 'bungee, cursive',
    lineHeight: "1rem",
    fontSize: "0.7rem",
    textAlign: "center"  
  }
})

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