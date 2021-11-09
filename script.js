class Calculator {
    //instantiate with output
    constructor(previousOutputText, currentOutputText){
        this.previousOutputText = previousOutputText;
        this.currentOutputText = currentOutputText;
        this.clear(); //sets everything to default values when new calculator is created      
    }

    // clear all output, and reset operation!
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.end = false;
        this.updateDisplay();
    }

    //remove single number
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0,-1);
    }

    //add number selection to output
    appendNumber(number){
        if (number === '.' && this.currentOperand.toString().includes('.')) return; //prevent multiple periods

        //if equalButton was used, then reset Calculator
        if(this.end === true){
            this.clear();
        }
        
        this.currentOperand = this.currentOperand.toString() + number.toString(); //deal with JS trying to sum numbers, instead of concat
    }

    // when equalButton is pressed, new numbers are NOT appended
    // but operations can continue
    logicalEnd() {       
        // deal with empty state scenario
        // deal with interim state scenario (e.g. computing halfway, but press 'Equal')
        if(this.operation === undefined || !this.currentOperand.length) return;
        
        this.end = true;   
    }

    //applies to /*-+ buttons
    chooseOperation(operation){       
        //prevent situation where empty state shows operator in calculator
        if(this.previousOperand === '' && this.currentOperand === '' || this.previousOperand === '' && this.currentOperand === '.') return;
        
        //no reset, as user wishes to continue computations 
        if(this.end === true){
            this.end = false; 
        }

        //update previousOperand if differing operation is selected
        if(this.currentOperand === '') {
            this.operation = operation; 
            this.updateDisplay();
        }
        //otherwise, perform calculation
        else
        {
            if(this.previousOperand !== '') {
                // since previous isn't blank, perform computation
                // for the purpose of updating 'previousOperand'
                this.chooseOperationCompute();
            }
    
            //reference for further calculation, although it's reset in compute()
            //facilitates equalButton
            this.operation = operation; 
    
            this.previousOperand = this.currentOperand; //shift the output, since computed
            this.currentOperand = '';
        }
    }
    
    //differentiate computes between chooseOperation() and equalButton
    chooseOperationCompute() {
        this.compute();
    }
    equalButtonCompute(){
        this.logicalEnd(); //run before compute() because of logic checks within logicalEnd()
        this.compute();
        this.updateDisplay();
    }

    // called by chooseOperation() and equalButton onclick
    compute(){
        let computation
        const previous = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        //compute if valid numbers
        //addresses situation where Equals is clicked, but currentOperand is empty
        if(isNaN(previous) || isNaN(current)) return;
        
        switch(this.operation) {
            case '+':
                computation = previous + current;
                break
            
            case '-':
                computation = previous - current;
                break
            
            case '*':
                computation = previous * current;
                break
            
            case '/':
                computation = previous / current;
                break
            
            default:
                return
        }
        
        // console.log("computation: " + computation%1); //use mod 1 to determine float!
        this.currentOperand = computation;
        this.operation = undefined; //reset the operation /*-+ once done computing
        this.previousOperand = '';
    }

    //beautify the number
    getDisplayNumber(number) {
        const stringNumber = number.toString(); //use string to perform split
        const integerDigits = parseFloat(stringNumber.split('.')[0]) //take the first item
        const decimalDigits = stringNumber.split('.')[1]

        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        }else{
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0})
        }
         
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        }else{
            return integerDisplay;
        }
    }

    joke(){
        this.previousOutputText.innerText = 'I\'d tell a joke,';
        this.currentOutputText.innerText = 'but it never ends.';
    }

    //called by every button click!
    updateDisplay(){
        // function utilises currentOperand and previousOperand, which are working values within Calculator class
        
        this.currentOutputText.innerText = 
            this.getDisplayNumber(this.currentOperand);

        // rmb tt this.operation holds onto /*-+ signs
        if(this.operation != null){
            this.previousOutputText.innerText = 
            `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        }else{
            this.previousOutputText.innerText = ''
        }

        // deal with infinity
        if(this.currentOperand === Infinity || this.previousOperand === Infinity) {
            this.joke();
        }
    }

    numberButton(text){
        this.appendNumber(text);
        this.updateDisplay();
    }

    deleteButton() {
        calculator.delete();
        calculator.updateDisplay();
    }

    operationButton(text){
        calculator.chooseOperation(text);
        calculator.updateDisplay();
    }

    operate(e){
        // console.log(e);
        switch(e.key) {
            case '0':
            case '1':    
            case '2':    
            case '3':    
            case '4':    
            case '5':    
            case '6':    
            case '7':    
            case '8':    
            case '9': 
            case '.':   
                calculator.numberButton(e.key)
                break
            
            case 'Delete':
                calculator.deleteButton();
                break
            
            case '*':
            case '/':
            case '+':
            case '-':
                calculator.operationButton(e.key);
                break
            
            case 'Escape':
                calculator.clear();
                break

            case 'Enter':
                calculator.equalButtonCompute();
                break
        
            default:
                return
        }
    }
}


// select all the relevant buttons and output
// using DATA attributes, which helps differentiate from CSS classes
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOutputText = document.querySelector('[data-previous-output]');
const currentOutputText = document.querySelector('[data-current-output]');

// make a new calculator
// with blank text as website loads
const calculator = new Calculator(previousOutputText, currentOutputText)

// take number in button and append it
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.numberButton(button.innerText);
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.operationButton(button.innerText);
    })
})

equalButton.addEventListener('click', button => {
    calculator.equalButtonCompute();
})


allClearButton.addEventListener('click', button => {
    calculator.clear();
})

deleteButton.addEventListener('click', button => {
    calculator.deleteButton();
})

window.addEventListener('keydown', calculator.operate);

