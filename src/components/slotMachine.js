import "rmc-picker/assets/index.css";
import "rmc-picker/assets/popup.css";

import { BottomButton, item } from "./App";
import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import React, { PureComponent } from "react";

import { MAX_ITEM_LIST_NUM } from "../utils";
import Picker from "rmc-picker/es/Picker";
import Popup from "rmc-picker/es/Popup";

// import throttle from "lodash.throttle";

// TODO: gotta deal with the structure of this.state.items. you can't deal with the negative labels in current structure

type PickerCompProps = {
  items: item[],
  value: string,
  onChangeValue: () => void,
  onLoadMore: () => void,
};

type slotMachineProps = {
  theme: "light" | "dark",
  option: string,
  items: item[],
  numRange: number[],
  disabled: boolean,
  answer: () => void,
};

const generateArray = async ({ data, startIdx, endIdx, limit, num, more }) => {
  let init = endIdx >= startIdx ? 0 : num;
  const generatedArray = [];
  for (let j = 0; j <= limit; j++) {
    for (
      let i = endIdx >= startIdx ? 0 : num;
      endIdx >= startIdx ? i < num : i > 0;
      endIdx >= startIdx ? i++ : i--
    ) {
      generatedArray.push({
        label: more ? `more${init}` : init,
        datum: data[i],
      });
      init++;
    }
  }
  return { generatedArray, num };
};

const PickerComp = ({
  items,
  value,
  onChangeValue,
}: // onLoadMore,
PickerCompProps) => (
  <Picker
    selectedValue={value}
    onValueChange={onChangeValue}
    // onScrollChange={
    //   throttle(
    //     (scrollHeight) => {
    //       console.log('%c scrollHeight: ', 'background-color:purple; color:#FFF;', scrollHeight)
    //       if (scrollHeight <= 20) {
    //         console.log('%c items[0].label: ', 'background-color:purple; color:#FFF;', items[0].label)
    //         onLoadMore('prev')
    //       } else if (scrollHeight >= items.length - 20) {
    //         console.log('%c items.length - 200: ', 'background-color:purple; color:#FFF;', items.length - 200)
    //         onLoadMore('next')
    //       }
    //     },
    //     2000,
    //     { trailing: false }
    //   )
    // }
  >
    {items.map(({ label, datum }, index) => (
      <Picker.Item key={index} value={label}>
        {datum}
      </Picker.Item>
    ))}
  </Picker>
);

export default class SlotMachine extends PureComponent<slotMachineProps> {
  state = {
    items: [],
    value: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      items: { length: itemsLength },
    } = this.state;
    const {
      items: { length: prevItemsLength },
    } = prevState;
    if (itemsLength !== prevItemsLength) {
      console.log(
        "%c prevItemsLength: ",
        "background-color:purple; color:#FFF;",
        prevItemsLength
      );
      console.log(
        "%c itemsLength: ",
        "background-color:magenta; color:#FFF;",
        itemsLength
      );
    }
  }

  onReset = (cbFunc) => {
    this.setState({ items: [] }, cbFunc);
  };

  onItemsCalculate = async (order, more = false) => {
    const { num, ...processedData } = await this.dataPrepare();
    const { length: itemsLen } = this.state.items;
    let newNum = itemsLen + num;
    if (order === "prev") {
      newNum = -(Math.abs(itemsLen) + num);
    }
    return await generateArray({ num: newNum, ...processedData, more });
  };

  onReady = () => {
    Keyboard.dismiss();
    this.onReset(() => {
      this.onItemsCalculate().then(({ generatedArray, num }) => {
        const itemsLength = generatedArray.length;
        const value = this.calibrateValue(itemsLength, num);
        this.setState({ value, items: generatedArray });
      });
    });
  };

  onOk = () => {
    const { items, value } = this.state;
    const { [value]: { datum } = {} } = items;
    this.props.answer(datum);
  };

  onChangeValue = (value) => {
    this.setState({ value });
  };

  onLoadMore = async (order) => {
    const { generatedArray } = await this.onItemsCalculate(order, true);
    console.log("generatedArray: ", generatedArray);
    this.setState(
      (prevState) => {
        if (order === "prev") {
          return {
            items: [...generatedArray, ...prevState.items],
          };
        } else {
          return {
            items: [...prevState.items, ...generatedArray],
          };
        }
      },
      () => {
        console.log(
          "after setState of items on onLoadMore: ",
          this.state.items
        );
      }
    );
  };

  calibrateValue = (dataLength, num) => {
    let calcNum;
    if (num === 0) {
      calcNum = 1;
    } else {
      calcNum = num;
    }
    const comp = Math.floor((Math.floor(dataLength / calcNum) * calcNum) / 2);
    return comp - (comp % calcNum);
  };

  dataPrepare = async () => {
    const {
      option,
      items,
      numRange: [from, to],
    } = this.props;
    let data, num, startIdx, endIdx, limit;
    if (option !== "numbers") {
      const refinedItems = option === "custom" ? items.slice(0, -1) : items;
      data = await refinedItems.map((item) => item.value);
      num = data.length;
      startIdx = 0;
      endIdx = num;
      limit =
        num === 0 ? MAX_ITEM_LIST_NUM : Math.floor(MAX_ITEM_LIST_NUM / num);
    } else {
      num = Math.abs(to - from) + 1;
      startIdx = Number(from);
      endIdx = Number(to);
      if (endIdx === startIdx) {
        limit = MAX_ITEM_LIST_NUM;
      } else {
        limit = Math.floor(MAX_ITEM_LIST_NUM / Math.abs(endIdx - startIdx));
      }
      data = await [...Array(endIdx + 1).keys()].filter(
        (key) => ![...Array(startIdx).keys()].includes(key)
      );
    }
    return { data, startIdx, endIdx, limit, num };
  };

  render() {
    const { disabled, theme } = this.props;
    const { items, value } = this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          <Popup
            transitionName="rmc-picker-popup-slide-fade"
            maskTransitionName="rmc-picker-popup-fade"
            maskClosable={false}
            content={PickerComp({
              items,
              value,
              onChangeValue: this.onChangeValue,
              // onLoadMore: this.onLoadMore
            })}
            title="Roll & Pick!!!"
            value={value}
            onOk={this.onOk}
            onDismiss={this.onDismiss}
            disabled={disabled}
            triggerType="onPressOut"
          >
            <BottomButton
              title="Ready"
              onPress={this.onReady}
              confirmColor={theme === "dark" ? "#c1c1c1" : "#444"}
              disabled={disabled}
            />
          </Popup>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
});
