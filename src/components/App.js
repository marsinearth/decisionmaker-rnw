import React, { Component, Fragment } from "react"
import { 
  Image, 
  StyleSheet, 
  Text, 
  TextInput,
  View, 
  Picker 
} from "react-native"
import { CheckBox } from 'react-native-elements'
import CustomInputText from './customInput'
import cogito from '../assets/cogito_loading.gif'

/* const Link = props => (
  <Text
    {...props}
    accessibilityRole="link"
    style={[styles.link, props.style]}
  />
); */

 const InputList = ({ inputs, handleChange, removeInputText }) => (
  <Fragment>
    {inputs.map(index => (
      <CustomInputText
        name={index}
        key={index}
        change={handleChange}
        blur={removeInputText}
      />
    ))}
  </Fragment>
)

export default class App extends Component {
  state = {
    selectedOption: '',
    question: '',
    inputs: ['input-0'],
    maxInputIndex: 1,
    nums: {},
    items: [],
    answer: ''
  }

  addInputText = () => {
    const { maxInputIndex } = this.state
    const newInput = `input-${maxInputIndex}`
    this.setState(prevState => ({
      inputs: prevState.inputs.concat([newInput]),
      maxInputIndex: maxInputIndex + 1,
    }))
  }

  removeInputText = (field, value) => {
    const { inputs } = this.state
    if (field !== inputs[0] && value.length === 0) {
      const currItems = Object.assign({}, this.state.items);
      delete currItems[field];
      const initVal = currItems['input-0'].length === 0 ? 1 : 0;
      if (inputs.length - Object.keys(currItems).length + initVal > 1) {
        inputs.splice(inputs.indexOf(field), 1);
      }
      this.setState({
        inputs,
        items: currItems,
      })
    }
  }

  handleChange = (type, field, value) => {
    const currItems = Object.assign({}, this.state.items);
    const inputLen = this.state.inputs.length;
    currItems[field] = value;
    this.setState({ items: currItems }, () => {
      const itemsLen = Object.keys(currItems).length;
      if (field.length >= 0 && inputLen === itemsLen) this.addInputText();
    })
  }

  handleInputChange = e => {
    const currName = e.target.name;
    if (currName.indexOf('Num') > -1) {
      const currNums = Object.assign({}, this.state.nums);
      currNums[e.target.name] = Math.floor(e.target.value);
      this.setState({ nums: currNums })
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  answerOn = answer => {
    this.setState({ answer });
  }

  render() {
    const { inputs, items } = this.state
    const inputListProps = { 
      inputs,
      handleChange: this.handleChange, 
      removeInputText: this.removeInputText 
    };
   
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
              checked={this.state.selectedOption}
            />
            <CheckBox
              title="Numbers"
              name="custom"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={this.state.selectedOption}
            />
          </View>
          <View style={styles.inputListContainer}>
            <Text style={styles.inputListTitleText}>
              Type Custom Items
            </Text>
            {/* <InputList {...inputListProps} /> */}
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
    color: 'slategray'
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginVertical: "1em",
    textAlign: "center"
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
