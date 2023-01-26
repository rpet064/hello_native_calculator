import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
const operatorArray = ["+", "-", "×", "÷"]
const colouredButtons = {
  "blueBtn": ["AC", "C", "√"],
  "purpleBtn": operatorArray,
  "redBtn": ["="]
}

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

  // This function renders buttons with varying css on text colour and background colour.
  // Its alternative for nth child which cannot be applied in React Native  
  const handleCalculatorKeyboard = () => {
    return (
      symbolsArray.map((symbol, index) => {

        // Red Buttons with white text
        if (colouredButtons.blueBtn.includes(symbol)) {
          return (
            <TouchableOpacity onPress={() => handleUserInput(symbol)} key={index} style={styles.calcBtnBlue}>
              <Text style={styles.buttonTextLight}>{symbol}</Text>
            </TouchableOpacity>
          )

        // Purple Buttons with white text
        } else if (colouredButtons.purpleBtn.includes(symbol)) {
          return (
            <TouchableOpacity onPress={() => handleUserInput(symbol)} key={index} style={styles.calcBtnPurple}>
              <Text style={styles.buttonTextLight}>{symbol}</Text>
            </TouchableOpacity>
          )

        // Red Buttons with white text
        } else if (colouredButtons.redBtn.includes(symbol)) {
          return (
            <TouchableOpacity onPress={() => handleUserInput(symbol)} key={index} style={styles.calcBtnRed}>
              <Text style={styles.buttonTextLight}>{symbol}</Text>
            </TouchableOpacity>
          )

        // Other Buttons with black text & black background
        } else {
          return (
            <TouchableOpacity onPress={() => handleUserInput(symbol)} key={index} style={styles.calcBtn}>
              <Text style={styles.buttonTextDark}>{symbol}</Text>
            </TouchableOpacity>
          )
        }

      })

    )
  }

  // Checks length of inputs and changes style (class) of large text
  // on calcuator screen to style (class) with smaller font size
  // largeScreenTextNoOverflow -> largeScreenTextOverflow -> ExtraLargeScreenTextNoOverflow
  const handleCalculatorMainScreen = () => {
    if (firstCalculatorInput.length + secondCalculatorInput.length > 4) {
      if (firstCalculatorInput.length + secondCalculatorInput.length > 7) {
        return (
          <Text
            style={styles.extraLargeScreenTextOverflow}> {firstCalculatorInput} {operator} {secondCalculatorInput}
          </Text>
        )
      } else {
        return (
          <Text
            style={styles.largeScreenTextOverflow}> {firstCalculatorInput} {operator} {secondCalculatorInput}
          </Text>
        )
      }
    } else {
      return (
        <Text
          style={styles.largeScreenTextNoOverflow}> {firstCalculatorInput} {operator} {secondCalculatorInput}
        </Text>)
    }
  }

  // manages the app inputs when the screen is full (max is 15 integers excl an operator)
  const handleInputExceedsMaximum = (userInput: string) => {
    if (userInput === "AC") {
      resetCalculator()
    } else if (userInput === "=") {
      solveEquation("")
    } else if (userInput === "C") {
      deletePrevInput()
    } else if (userInput === "√"){
      onSquareRoot()
    } else if (userInput === "+/-"){
      changeSign()
    } else {

      // will trigger alert if user tries to add more numbers
      alert("More integers cannot be added to calculator")
    }
  }

  // this function stores the last equation 
  const updatePrevArray = (firstNum: number, secondNum: number) => {
    var prev_equation_string = ''

    // Store the first input if there are no previous inputs
    var prev_equation = [firstNum, " ", operator, " ", secondNum, " = "]
    prev_equation_string = prev_equation.toString().replaceAll(',', '')
    setPrevInput(prev_equation_string)
  }

  // equation is solved - added to previous answer array, answer is added as first
  // input and the other inputs are cleared for a preceeding calculation
  const solveEquation = async (newOperator: string) => {
    if (secondCalculatorInput.length !== 0) {

      let firstNum, secondNum: number
      firstNum = parseFloat(firstCalculatorInput.join(''))
      secondNum = parseFloat(secondCalculatorInput.join(''))

      updatePrevArray(firstNum, secondNum)
      setShowAnswer(true)
      
      // Find answer, change to array, then add to state
      var answer: string
      answer = handleCalculations(firstNum, secondNum)
      var answerArray = answer.split('')
      setFirstCalculatorInput(answerArray)

      clearNumbers(newOperator)
    }
  }

  // Manages the final calculation 
  const handleCalculations = (firstNum: number, secondNum: number) => {
    let answer: number = 0
    if (operator === "+") {
      answer = firstNum + secondNum
    } else if (operator === "-") {
      answer = firstNum - secondNum
    } else if (operator === "÷") {
      answer = firstNum / secondNum
    } else if (operator === "×") {
      answer = firstNum * secondNum
    }
    // bug in js floats returns strange answers - rounded to hide decimal inconsistency
    let roundedAnswer = answer.toFixed(5)

    // check decimal needed (not .00) - answer from multiplying large numbers causes displayed text to overflow div
    if (roundedAnswer.split('.')[1] === "00000") {
      roundedAnswer = roundedAnswer.split('.')[0]
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
    let arrayIntoString: string

    // Removes last inputted number from first input array
    if (operator === "") {
      arrayIntoString = firstCalculatorInput.join('').slice(0, -1)
      let stringIntoArray: Array<string> = arrayIntoString.split('')
      setFirstCalculatorInput(stringIntoArray)

      // Removes last inputted number from second input array
    } else if (secondCalculatorInput.length > 0) {
      arrayIntoString = secondCalculatorInput.join('').slice(0, -1)
      let stringIntoArray: Array<string> = arrayIntoString.split('')
      setSecondCalculatorInput(stringIntoArray)

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
    let originalNumber, originalNumberNoNegative = 0
    let dividedNumberString = ""
    let dividedNumberArray: string[]

    if (operator === '') {
      if (firstCalculatorInput.length) {

        // Check if there is a negative number
        if (firstCalculatorInput.includes("-")){
          originalNumber = parseInt(firstCalculatorInput.toString().replaceAll(',', ''))
          originalNumberNoNegative = parseInt(firstCalculatorInput.toString().replaceAll(',', '').replace('-', ''))

          // Solves, rounds to 2d.p, adds negative sign back in and puts back into array
          dividedNumberString = (Math.sqrt(originalNumberNoNegative)).toFixed(2).toString()

          dividedNumberArray = dividedNumberString.split('')
          dividedNumberArray.unshift("-")
          setFirstCalculatorInput(dividedNumberArray)
        } else {
          originalNumber = parseInt(firstCalculatorInput.toString().replaceAll(',', ''))
          
          // Solves, rounds to 2d.p & puts back into array
          dividedNumberString = (Math.sqrt(originalNumber)).toFixed(2).toString()
          dividedNumberArray = dividedNumberString.split('')
          setFirstCalculatorInput(dividedNumberArray)
        }
      }
    } else {

         // Check if there is a negative number
        if (secondCalculatorInput.includes("-")){
          originalNumber = parseInt(secondCalculatorInput.toString().replaceAll(',', ''))
          originalNumberNoNegative = parseInt(secondCalculatorInput.toString().replaceAll(',', '').replace('-', ''))

          // Solves, rounds to 2d.p, adds negative sign back in and puts back into array
          dividedNumberString = (Math.sqrt(originalNumberNoNegative)).toFixed(2).toString()

          dividedNumberArray = dividedNumberString.split('')
          dividedNumberArray.unshift("-")
          setFirstCalculatorInput(dividedNumberArray)
        } else {
          originalNumber = parseInt(secondCalculatorInput.toString().replaceAll(',', ''))
          
          // Solves, rounds to 2d.p & puts back into array
          dividedNumberString = (Math.sqrt(originalNumber)).toFixed(2).toString()
          dividedNumberArray = dividedNumberString.split('')
          setSecondCalculatorInput(dividedNumberArray)
        }
      }
    // Assign prev calculation to show on calculator screen
    let prevInputString = " √ " + originalNumber
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

  // takes operator input
  const onInputOperator = (userInput: string) => {
    if (operator === '') {

      // checks if a number has been inputted into equation
      // before adding an operator
      if (firstCalculatorInput.length === 0) {
        alert('please enter a number first')
      } else {
        setOperator(userInput)
      }
    } else {
      
      // Submits for solving and saves second operator for new calculation
      setOperator(userInput)
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

    // checks that the equation isn't too big (max length excluding operator is 15)
    if (firstCalculatorInput.length + secondCalculatorInput.length < 14) {

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
      handleInputExceedsMaximum(userInput)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.calculatorScreen}>
        <View>
          <Text style={styles.smallScreenText}>{prevInput}</Text>
        </View>
        <View>
          {handleCalculatorMainScreen()}
        </View>
      </View>
      <View style={styles.calculatorKeypad}>
        {handleCalculatorKeyboard()}
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
  calculatorScreen: {
    margin: 'auto',
    minHeight: '41%',
    backgroundColor: 'black',
    minWidth: '100%',
    alignItems: 'center',
  },
  smallScreenText: {
    color: 'white',
    padding: 18.66,
    position: 'relative',
    top: 100,
    fontSize: 30,
  },
  largeScreenTextNoOverflow: {
    color: 'white',
    padding: 18.66,
    position: 'relative',
    top: 97.5,
    fontSize: 85,
  },
  largeScreenTextOverflow: {
    color: 'white',
    padding: 18.66,
    position: 'relative',
    alignItems: 'center',
    top: 100,
    fontSize: 63.1,
  },
  extraLargeScreenTextOverflow: {
    color: 'white',
    padding: 18.66,
    position: 'relative',
    alignItems: 'center',
    top: 100,
    fontSize: 35,
  },
  calculatorKeypad: {
    flex: 1,
    flexWrap: 'wrap',
    minHeight: '59%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  calcBtn: {
    flexBasis: '25%',
    backgroundColor: '#FFFAE7',
    color: '#181D31',
    alignItems: 'center',
    minHeight: 100,
    padding: 16.95,
    borderWidth:1.05, 
    borderColor:'black', 
    borderStyle:'solid'

  },
  calcBtnBlue: {
    flexBasis: '25%',
    backgroundColor: '#0779E4',
    color: '#181D31',
    alignItems: 'center',
    minHeight: 100,
    padding: 17.45,
    borderWidth:1.05, 
   borderColor:'black', 
   borderStyle:'solid'
  },
  calcBtnPurple: {
    flexBasis: '25%',
    backgroundColor: '#9951FF',
    color: '#181D31',
    alignItems: 'center',
    minHeight: 100,
    padding: 18.66,
    borderWidth:1.05, 
    borderColor:'black', 
    borderStyle:'solid'
    
  },
  calcBtnRed: {
    flexBasis: '25%',
    backgroundColor: '#C21010',
    color: '#181D31',
    alignItems: 'center',
    minHeight: 100,
    padding: 18.66,
    borderWidth:1.05, 
    borderColor:'black', 
    borderStyle:'solid'
  },
  buttonTextDark: {
    fontSize: 45,
    fontWeight: '500',
  },
  buttonTextLight: {
    fontSize: 45,
    color: '#FFFAE7',
    fontWeight: '500',
  }
})

export default App