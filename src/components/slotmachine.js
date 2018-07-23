import React, { PureComponent } from 'react'
import Picker from 'rmc-picker/lib/Picker.web'
import Popup from 'rmc-picker/lib/Popup.web'
import InfiniteScroll from 'react-infinite-scroller'
import produce from 'immer'

const generateArray = ({ data, startIdx, endIdx, limit }) => {
  let init = 0
  const array = []
  for (let j = 0; j < limit; j++) {
    for (
      let i = startIdx;
      endIdx >= startIdx ? i < endIdx : i > endIdx;
      endIdx >= startIdx ? i++ : i--
    ) {
      array.push({
        label: String(data[i]),
        value: String(init++)
      });
    }
  }
  return array
}

class InfinitePicker extends PureComponent {
  render() {
    const { items } = this.props
    return (
      <Picker>
        {items}
      </Picker>
    )
  }
}

export default class Slotmachine extends PureComponent {
  state = {
    items: [],
    value: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { items: { length: itemsLength }} = this.state
    const { items: { length: prevItemsLength }} = prevState
    if (itemsLength !== prevItemsLength) {

    }
  }

  onReady = () => {
    const { num, ...processedData } = this.dataPrepare()
    console.log('num: ', num)
    const generatedItems = generateArray({...processedData})
    const itemsLength = generatedItems.length
    const value = this.calibrateValue(itemsLength, num)
    this.setState({ items: generatedItems, value })
  }

  onOK = value => {
    const item = this.state.items[value]
    this.setState({ value }, () => {
      this.props.answer(item['label'])
    })
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

  calibrateValue = (dataLength, num) => {
    const comp = Math.floor(Math.floor(dataLength / num) * num / 2)
    return String(comp - comp % num)
  }

  dataPrepare = () => {
    const { option, items, toNum, fromNum } = this.props
    let data, num, startIdx, endIdx, limit
    if (option === 'custom') {
      data = items.map(item => item.value)
      num = data.length
      startIdx = 0
      endIdx = num
      limit = Math.floor(1000 / num)
    } else {
      num = Math.abs(toNum - fromNum) + 1
      startIdx = fromNum
      endIdx = toNum
      limit = Math.floor(1000 / Math.abs(endIdx - startIdx))
      data = Array.from(Array(limit).keys())
    }
    const returnObj = { data, startIdx, endIdx, limit, num }
    return returnObj
  }

  render() {
    const { disabled } = this.props
    const { items, value } = this.state
    return (
      <div>
        <Popup
          className="fortest"
          transitionName="rmc-picker-popup-slide-fade"
          maskTransitionName="rmc-picker-popup-fade"
          picker={<Picker>{items}</Picker>}
          title="Roll & Pick!!!"
          value={value}
          onOk={this.onOK}
          disabled={disabled}
        >
          <button disabled={disabled} onClick={this.onReady}>
            {'Ready'}
          </button>
        </Popup>
      </div>
    )
  }
}
