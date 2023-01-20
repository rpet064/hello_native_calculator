// React Native Counter Example using Hooks!

import React, {useState} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native'
import { StatusBar } from "expo-status-bar"

const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
const operatorArray = ["+", "-", "×", "÷"]

const symbolsArray = [
  "AC", "C", "√", "÷",
  "7", "8", "9", "×",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", "+/-", ".", "="
  ]

const App = () => {

  const [firstCalculatorInput, setFirstCalculatorInput] = useState<string[]>([])
  const [secondCalculatorInput, setSecondCalculatorInput] = useState<string[]>([])
  const [prevInput, setPrevInput] = useState<string>("")
  const [operator, setOperator] = useState("")
  const [showAnswer, setShowAnswer] = useState<boolean>(false)


  // this function stores the last equation 
  const updatePrevArray = (firstNum: number, secondNum: number) => {
    var prev_equation_string = ''

    // Store the first input if there are no previous inputs
    var prev_equation = [firstNum, "  ", operator, "  ", secondNum, "  ", "  =  "]
    prev_equation_string = prev_equation.toString().replaceAll(',', '')
    setPrevInput(prev_equation_string)
  }

  // equation is solved - added to previous answer array, answer is added as first
  // input and the other inputs are cleared for a preceeding calculation
  const solveEquation = async (newOperator: string) => {
    if (secondCalculatorInput.length !== 0) {

      let firstNum: number
      firstNum = parseFloat(firstCalculatorInput.join(''))

      let secondNum: number
      secondNum = parseFloat(secondCalculatorInput.join(''))

      updatePrevArray(firstNum, secondNum)
      setShowAnswer(true)
      var answer: string
      answer = handleCalculations(firstNum, secondNum)
      setFirstCalculatorInput([answer])
      clearNumbers(newOperator)
    }
  }

  const handleCalculations = (firstNum: number, secondNum: number) => {
   let answer: number = 0
  if (operator === "+"){
    answer =  firstNum + secondNum;
  } else if (operator === "-"){
    answer =  firstNum - secondNum;
  } else if (operator === "÷"){
    answer =  firstNum / secondNum;
  } else if (operator === "×"){
    answer =  firstNum * secondNum;
  }
  // bug in js floats returns strange answers - rounded to hide decimal inconsistency
  let roundedAnswer = answer.toFixed(5);
      
  // check decimal needed (not .00) - answer from multiplying large numbers causes displayed text to overflow div
  if (roundedAnswer.split('.')[1] === "00000"){
    roundedAnswer = roundedAnswer.split('.')[0];
  }
  return roundedAnswer.toString()
}

  // this function will clear the second input and check if user has already
  // inputted operator for new equation
  const clearNumbers = (newOperator: string) => {

    if (newOperator === operator) {
      setOperator(newOperator)
    } else {
      setOperator("")
    }
    setSecondCalculatorInput([])
  }

  // clear calculator input arrays
  const resetCalculator = () => {
    setFirstCalculatorInput([])
    setOperator('')
    setSecondCalculatorInput([])
    setPrevInput("")
    setShowAnswer(false)
  }

  // This function checks 
  const deletePrevInput = () => {
    // Removes last inputted number from first input array
    if (operator === "") {

      let new_input: Array<string>
      new_input = firstCalculatorInput.splice(-1)
      setFirstCalculatorInput(new_input)


    // Removes last inputted number from second input array
    } else if (secondCalculatorInput.length > 0) {

      let new_input: Array<string>
      new_input = secondCalculatorInput.splice(-1)
      setSecondCalculatorInput(new_input)

    // Catches exception where user wants to delete the operator
    } else {
      setOperator("")
    }
  }

  // this function checks if the first or second number is currently 
  // being inputted, then adds to array accordingly
  const onInputNumber = (userInput: string) => {
    if (operator === "") {

      // ignores 0 inputs on first input && check if answer is inside first input array
      if ((userInput !== "0") && (showAnswer)) {

        // if answer is inside, overwrite and set array to false (answer has been written over)
        setFirstCalculatorInput([userInput])
        setPrevInput("")
        setShowAnswer(false)

        // add input to first input array
      } else {
        setFirstCalculatorInput(firstCalculatorInput => [...firstCalculatorInput, userInput])
      }

      // Add to second array, as first array and operator have already been inputted
    } else {

      if (secondCalculatorInput.length === 0) {
        setSecondCalculatorInput([userInput])
      } else {
        setSecondCalculatorInput(secondCalculatorInput => [...secondCalculatorInput, userInput])
      }
    }
  }

  const onSquareRoot = () => {

    // error when negative number is square rooted
    let originalNumber = 0
    let dividedNumberString = ""
    if (operator === '') {
      if (firstCalculatorInput.length) {
        originalNumber = parseInt(firstCalculatorInput.toString().replaceAll(',', ''))
        dividedNumberString = (Math.sqrt(originalNumber)).toFixed(2).toString()
        setFirstCalculatorInput([dividedNumberString])
      }
    } else {

      // Needs fixing
      if (secondCalculatorInput.length) {
        originalNumber = parseInt(firstCalculatorInput.toString().replaceAll(',', ''))
        dividedNumberString = (Math.sqrt(originalNumber)).toFixed(2).toString()
        setSecondCalculatorInput([dividedNumberString])
      }
    }
    let prevInputString = " √ "  + originalNumber
    setPrevInput(prevInputString)
  }

  // handle number input logic - this function checks if the first or second number is currently
  // being inputted, then checks if array is empty
  const onInputDecimal = (userInput: string) => {
    if (operator === '') {
      if (!firstCalculatorInput.length) {

        // add 0. to first array (as it's empty)
        setFirstCalculatorInput(['0.'])

      } else if (!firstCalculatorInput.includes(".")) {

        // add decimal like normal to first array
        onInputNumber(userInput)
      }

    } else {
      if (!secondCalculatorInput.length) {

        // add 0. to second array (as it's empty)
        setSecondCalculatorInput(['0.'])

      } else if (!secondCalculatorInput.includes(".")) {

        // add decimal like normal to second array
        onInputNumber(userInput)
      }
    }
  }

  // handle operator input logic
  const onInputOperator = (userInput: string) => {
    if (operator === '') {
      if (firstCalculatorInput.length === 0) {
        alert('please enter a number first')
      } else {
        setOperator(userInput)
      }
    } else {
      solveEquation(userInput)
    }
  }

  // handle sign change logic - checks if currently first or second array, then checks
  // the sign at the front of the array (if the number is positive or negative) - the values
  //  are taken from the hook and then added back in as useState hooks are immutable
  const changeSign = () => {
    if (operator === '') {
      var originalArray = firstCalculatorInput
      if (firstCalculatorInput[0] === "-") {

        // remove "-" from front of first array making it "positive"
        originalArray = originalArray.slice(1)
        setFirstCalculatorInput([...originalArray])
      } else {

        // add "-" to front of first array making it "negative"
        originalArray.unshift("-")
        setFirstCalculatorInput([...originalArray])
      }
    } else {
      var originalArray = secondCalculatorInput
      if (secondCalculatorInput[0] === "-") {

        // remove "-" from front of second array making it "positive"
        originalArray = originalArray.slice(1)
        setSecondCalculatorInput([...originalArray])
      } else {

        // add "-" to front of second array making it "negative"
        originalArray.unshift("-")
        setSecondCalculatorInput([...originalArray])
      }
    }
  }

  // this const catches userinput from button and triggers correct function accordingly
  const handleUserInput = (userInput: string) => {

    // checks that the equation isn't too big (max length excluding operator is 16)
    if (firstCalculatorInput.length + secondCalculatorInput.length < 10) {

      if (numArray.includes(userInput)) {
        onInputNumber(userInput)
      } else if (operatorArray.includes(userInput)) {
        onInputOperator(userInput)
      } else if (userInput === "AC") {
        resetCalculator()
      } else if (userInput === "+/-") {
        changeSign()
      } else if (userInput === "C") {
        deletePrevInput()
      } else if (userInput === ".") {
        onInputDecimal(".")
      } else if (userInput === "=") {

        // No additional operator has been selected, so will send an empty
        // string to replace the existing operator
        solveEquation("")
      } else if (userInput === "√") {
        onSquareRoot()
      }
    } else {

      // clears screen when is full
      if (userInput === "AC") {
        resetCalculator()
      } else if (userInput === "=") {
        solveEquation("")
      } else {

        // will trigger alert if user tries to add more numbers
        alert("More integers cannot be added to calculator")
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.calculatorScreen}>
        <View>
          <Text style={styles.smallScreenText}>{prevInput}</Text>
        </View>
        <View>
          <Text style={styles.largeScreenText}>{firstCalculatorInput}  {operator}  {secondCalculatorInput}</Text>
        </View>
      </View>
      <View style={styles.calculatorKeypad}>
        {symbolsArray.map((symbol, index) => {
          return (
            <TouchableOpacity onPress={() => handleUserInput(symbol)} key={index} style={styles.calcBtn}>
              <Text style={styles.buttonText}>{symbol}</Text>
            </TouchableOpacity>
          )
        })
        }
      </View>
      
    </View>
  )
}

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
    minHeight: '41%',
    backgroundColor: 'black',
    minWidth: '100%',
  },
  smallScreenText: {
    color: 'white',
    padding: 18.66,
    position: 'relative',
    top: 110,
    left: 100,
    fontSize: 20,
  },
  largeScreenText: {
    color: 'white',
    padding: 18.66,
    position: 'relative',
    top: 110,
    left: 30,
    fontSize: 40,
  },
  calculatorKeypad:{
    flex: 1,
    flexWrap: 'wrap',
    minHeight: '59%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  calcBtn:{
    flexBasis: '25%',
    backgroundColor: '#FFFAE7',
    color: '#181D31',
    alignItems: 'center',
    minHeight: 100,
    padding: 18.66,

  },
  buttonText:{
    fontSize: 45,
  }
})

export default App