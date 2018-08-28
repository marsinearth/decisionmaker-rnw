import React, { PureComponent } from 'react'
import { View, Text, TouchableHighlight, ScrollView, StyleSheet } from 'react-native'
import Picker from 'rmc-picker/es/Picker'
import Popup from 'rmc-picker/es/Popup'
import 'rmc-picker/assets/index.css'
import 'rmc-picker/assets/popup.css'
// import throttle from 'lodash.throttle'

// TODO: gotta deal with the structure of this.state.items. you can't deal with the negative labels in current structure

const generateArray = async ({ data, startIdx, endIdx, limit, num }) => {
  let init = endIdx >= startIdx ? 0 : num
  const generatedArray = []
  for (let j = 0; j <= limit; j++) {
    for (
      let i = endIdx >= startIdx ? 0 : num;
      endIdx >= startIdx ? i < num : i > 0;
      endIdx >= startIdx ? i++ : i--
    ) {
      generatedArray.push({
        label: init,
        datum: data[i]
      });
      init++
    }
  }
  return { generatedArray, num }
}

const PickerComp = ({ items, value, onChangeValue, onLoadMore }) => (
  <Picker
    selectedValue={value}
    onValueChange={onChangeValue}
    /* onScrollChange={
        throttle(
          (scrollHeight) => {
            // console.log('%c scrollHeight: ', 'background-color:purple; color:#FFF;', scrollHeight)
            if (scrollHeight <= items[0].label + 200) {
              console.log('%c items[0].label: ', 'background-color:purple; color:#FFF;', items[0].label)
              onLoadMore('prev')
            } else if (scrollHeight >= items.length - 200) {
              console.log('%c items.length - 200: ', 'background-color:purple; color:#FFF;', items.length - 200)
              onLoadMore('next')
            }
          },
          2000000,
          { trailing: false }
        )        
    }*/
  >
    {items.map(({ label, datum }, index) => (
      <Picker.Item key={index} value={label}>
        {datum}
      </Picker.Item>
    ))}
  </Picker>
)

export default class Slotmachine extends PureComponent {
  state = {
    items: [],
    value: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    const { items: { length: itemsLength }} = this.state
    const { items: { length: prevItemsLength }} = prevState
    if (itemsLength !== prevItemsLength) {
      console.log('%c prevItemsLength: ', 'background-color:purple; color:#FFF;', prevItemsLength)
      console.log('%c itemsLength: ', 'background-color:magenta; color:#FFF;', itemsLength)
    }
  }

  onReset = () => {
    this.setState({ items: [] })
  }

  onDismiss = () => {
    this.onReset()
  }

  onItemsCalculate = async (order) => {
    const { num, ...processedData } = this.dataPrepare()
    const { length: itemsLen } = this.state.items
    let newNum = itemsLen + num
    if (order === 'prev') {
      newNum = -(Math.abs(itemsLen) + num)
    }
    return await generateArray({ num: newNum, ...processedData })
  }

  onReady = async () => {    
    const { generatedArray, num } = await this.onItemsCalculate()
    const itemsLength = generatedArray.length
    const value = await this.calibrateValue(itemsLength, num)
    this.setState({ value, items: generatedArray })
  }

  onOk = () => {
    this.onReset()
    const { items, value } = this.state
    const selectedValue = items[value].datum
    this.props.answer(selectedValue)
  }

  onChangeValue = value => {
    this.setState({ value })
  }

  onLoadMore = async (order) => {
    const { generatedArray } = await this.onItemsCalculate(order)
    console.log('generatedArray: ', generatedArray)
    this.setState(prevState => {
      if (order === 'prev') {
        return { 
          items: [
            ...generatedArray,
            ...prevState.items
          ]   
        }     
      } else {
        return {
          items: [
            ...prevState.items,
            ...generatedArray
          ]
        }
      }  
    }, () => {
      console.log('after setState of items on onLoadMore: ', this.state.items)
    })
  }

  calibrateValue = async (dataLength, num) => {
    let calcNum;
    if (num === 0) {
      calcNum = 1
    } else {
      calcNum = num
    }
    const comp = Math.floor(Math.floor(dataLength / calcNum) * calcNum / 2)
    return comp - comp % calcNum
  }

  dataPrepare = () => {
    const { option, items, numRange: [from, to] } = this.props
    let data, num, startIdx, endIdx, limit
    if (option === 'custom') {
      data = items.slice(0, -1).map(item => item.value)
      num = data.length
      startIdx = 0
      endIdx = num
      limit = num === 0 ? 1000 : Math.floor(1000 / num)
    } else {
      num = Math.abs(to - from) + 1
      startIdx = Number(from)
      endIdx = Number(to)
      if (endIdx === startIdx) {
        limit = 1000
      } else {
        limit = Math.floor(1000 / Math.abs(endIdx - startIdx))
      }    
      data = [...Array(endIdx + 1).keys()].filter(key => (
        ![...Array(startIdx).keys()].includes(key)
      ))
    }
    return { data, startIdx, endIdx, limit, num }
  }

  render() {
    const { disabled } = this.props
    const { items, value } = this.state
    return (
      <ScrollView>
        <View style={styles.container}>
          <Popup
            className="fortest"
            transitionName="rmc-picker-popup-slide-fade"
            maskTransitionName="rmc-picker-popup-fade"
            maskClosable={false}
            content={
              <PickerComp
                items={items}
                value={value}
                onChangeValue={this.onChangeValue}
                onLoadMore={this.onLoadMore}
              />
            }
            title="Roll & Pick!!!"
            value={value}
            onOk={this.onOk}
            onDismiss={this.onDismiss}
            disabled={disabled}
          >
            <TouchableHighlight
              activeOpacity={0.5} 
              underlayColor="#a9d9d4"
              disabled={disabled} 
              onPress={this.onReady}
            >
              <View style={styles.readyBtnContainer}>
                <Text style={[styles.readyBtnText, { color: disabled ? '#888' : 'black' }]}>
                  {'Ready'}
                </Text>
              </View>
            </TouchableHighlight>
          </Popup>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  readyBtnContainer: {
    width: 60,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#999',
    paddingVertical: '0.25rem',
    cursor: 'pointer',
    outline: 'none'
  },
  readyBtnText: {
    fontFamily: 'bungee, cursive',
    lineHeight: "1rem",
    fontSize: "0.7rem",
    textAlign: "center"  
  }
})
