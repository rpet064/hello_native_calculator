// React Native Counter Example using Hooks!

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button, StatusBar,} from 'react-native';
// import CalculatorButtons from './components/calculatorButtons.tsx'

const symbolsArray = [
  "AC", "C", "√", "÷",
  "7", "8", "9", "×",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", "+/-", ".", "="
  ]


const App = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.calculatorScreen}>
        <Text>This is the screen</Text>
      </View>
      <View style={styles.calculatorKeypad}>
        {symbolsArray.map((symbol, index) => {
          return (
            <TouchableOpacity onPress={() => console.log({symbol})} key={index} style={styles.calcBtn}>
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
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 10,
    borderWidth:2,
  },
  calculatorScreen:{
    minHeight: 169.6,
    margin: 'auto',
  },
  calculatorKeypad:{
    minHeight: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '0 0.1%',
  },
  calcBtn:{
    flex: 4,
    backgroundColor: '#FFFAE7',
    color: '#181D31',
    minHeight: 68,
    fontSize: 52,
    border: '#181D31 1px solid',
  }
});

export default App;