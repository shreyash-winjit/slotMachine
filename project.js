const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 5
};

const SYMBOLS_VALUES = {
    "A": 5,
    "B": 4, 
    "C": 3, 
    "D": 2
}

const deposit = () => {
    while(true){
        const depositAmount = prompt("enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <=0)
        {
            console.log("invalid deposit amount. try again!!")
        }
        else
        {
            return numberDepositAmount;
        }
    }
}

const getLines = () => {
    while(true){
        const numberOfLines = prompt("enter the number of lines to bet on (1-3): ");
        const lines = parseFloat(numberOfLines);

        if(isNaN(lines) || lines < 1 || lines > 3)
        {
            console.log("invalid number of lines. try again!!")
        }
        else
        {
            return lines;
        }
    }
}

const getBet = (balance, lines) =>{
    while(true)
    {
        const bet = prompt("enter the bet per line: ");
        const numberBet = parseFloat(bet);
        if(isNaN(numberBet) || numberBet <=0 || numberBet>balance/lines)
        {
            console.log("invalid bet, try again!!");
        }
        else{
            return numberBet;
        }
    }
}

const spin = () => {
    const symbols = [] //create a list of the symbols where each symbol occurs its respective count number of times
    for ([symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    const reels = []; // each element of reels is an array which represents the column
    for( let i = 0; i < COLS; i++){
        reels.push([]); //pushing here so it will work if we change the number of cols globally
        const reelSymbols = [...symbols]; //create a working copy of the symbols arrays we can modify 
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels)=> {
    let transposeReels = [];
    for(let i =0 ;i<ROWS;i++)
    {
        transposeReels.push([]);
        for (let j=0;j<COLS;j++)
        {
            transposeReels[i].push(reels[j][i]);
        }
    }
    return transposeReels;
};

const printSlots = (reels) => {
    for (const row of reels){
        rowString = "";
        for(const[i, symbol] of row.entries()){
            rowString += symbol;
            if(i != row.length-1)
            rowString += " | ";
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row<lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();
    while(true){
        console.log(`Your current balance  is $${balance}`);
        const lines = getLines();
        const bet = getBet(balance, lines);
        balance -= bet*lines;
        const reels = spin();
        const reelsTransposed = transpose(reels);
        printSlots(reelsTransposed);
        const winnings = getWinnings(reelsTransposed, bet, lines);
        balance += winnings;
        console.log(`You won $${winnings}`)

        if(balance<=0){
            console.log("You ran out of money!!");
            break;
        }
        let playAgain = prompt("Do you want to play another round (y/n)? ");
        if(playAgain != 'y') break;
    }
}

game();
// console.log(reels);
// console.log(reelsTransposed);

