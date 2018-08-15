import React, { PureComponent } from 'react'
import { View, Text, TouchableHighlight, ScrollView, StyleSheet } from 'react-native'
import Picker from 'rmc-picker/es/Picker'
import Popup from 'rmc-picker/es/Popup'
import 'rmc-picker/assets/index.css'
import 'rmc-picker/assets/popup.css'
// import InfiniteScroll from 'react-infinite-scroller'
import produce from 'immer'

const generateArray = async ({ data, startIdx, endIdx, limit, num }) => {
  let init = 0
  const array = []
  for (let j = 0; j <= limit; j++) {
    for (
      let i = endIdx >= startIdx ? 0 : num;
      endIdx >= startIdx ? i <= num : i > 0;
      endIdx >= startIdx ? i++ : i--
    ) {
      array.push({
        label: init,
        datum: data[i]
      });
      init++
    }
  }
  return array
}

const PickerComp = ({ items, value, onChangeValue }) => (
  <Picker
    selectedValue={value}
    onValueChange={onChangeValue}
  >
    {items.map(({ label, datum }) => (
      <Picker.Item key={label} value={label}>
        {datum}
      </Picker.Item>
    ))
    }
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

    }
  }

  onReady = async () => {
    const processedData = this.dataPrepare()
    const generatedItems = await generateArray(processedData)
    const itemsLength = generatedItems.length
    const value = await this.calibrateValue(itemsLength, processedData.num)
    this.setState({ value, items: generatedItems })
  }
  onOk = () => {
    const { items, value } = this.state
    const selectedValue = items[value].datum
    this.props.answer(selectedValue)
  }

  onChangeValue = value => {
    this.setState({ value })
  }

  onLoadMore = () => {
    const { num, ...processedData } = this.dataPrepare()
    const generatedItems = generateArray({...processedData})
    this.setState(
      produce(draft => {
        draft.items.concat(generatedItems)
        const itemsLength = draft.items.length
        const value = this.calibrateValue(itemsLength, num)
        draft.value = value
      })
    )
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
      num = data.length - 1
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
        ![...Array(startIdx + 1).keys()].includes(key)
      ))
      console.log('data: ', data);
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
              />
            }
            title="Roll & Pick!!!"
            value={value}
            onOk={this.onOk}
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
