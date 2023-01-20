// React Native Counter Example using Hooks!

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import { StatusBar } from "expo-status-bar";

// import CalculatorButtons from './components/calculatorButtons.tsx'

const symbolsArray = [
  "AC", "C", "√", "÷",
  "7", "8", "9", "×",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", "+/-", ".", "="
  ]

const App = () => {

  const handleInput = (symbol: string) => {
    console.log(symbol)
  }

  return (
    <View style={styles.container}>
      <View style={styles.calculatorScreen}>
        <Text>This is the screen</Text>
      </View>
      <View style={styles.calculatorKeypad}>
        {symbolsArray.map((symbol, index) => {
          return (
            <TouchableOpacity onPress={() => handleInput(symbol)} key={index} style={styles.calcBtn}>
              <Text>{symbol}</Text>
            </TouchableOpacity>
          )
        })
        }
      </View>
      
    </View>
  );
};

// React Native Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  },
  calculatorScreen:{
    margin: 'auto',
    minHeight: '37.5%',
  },
  calculatorKeypad:{
    flex: 1,
    flexWrap: 'wrap',
    minHeight: '62.5%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  calcBtn:{
    flexBasis: '24.9%',
    backgroundColor: '#FFFAE7',
    color: '#181D31',
    fontSize: 52,
  }
});

export default App;