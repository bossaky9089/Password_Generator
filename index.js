const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols="`~!@#$%^&*()_+=-:;'?/>.<,";

// intial values 
let password="";
let passwordLength=10;
let checkCount=0;

// intially strength circle have greyish color
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
}
handleSlider();

function setIndicator(color){
    indicator.style.background=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,10);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbols(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt[randNum];
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked==true)hasUpper=true;
    if(lowercaseCheck.checked==true)hasLower=true;
    if(numbersCheck.checked==true)hasNum=true;
    if(symbolsCheck.checked==true)hasSym=true;
    if(hasLower && hasUpper && (hasNum || hasSym) && passwordLength>=8)setIndicator('#0f0');
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6)setIndicator('#ff0');
    else setIndicator('#f00')
}

async function copyContent(){
    try{
         await navigator.clipboard.writeText(passwordDisplay.value);
         copyMsg.innerText="copied"
    }
    catch(e){
         copyMsg.innerText="failed"
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}
// set time out function wait for 2 second and then it will remove the class after 2 seconds.

function shufflePassword(array){
    // fisher-Yates method applies only on array.
     for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
     }

     let str="";
     array.forEach((el)=>(
        str+=el
     ))
     return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
});


inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount===0)return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    password="";
    let funcArr=[];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbols.checked)
        funcArr.push(generateSymbols);
    // if all checkbox are checked 
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    // remaining addition 
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randomIndex]();
    }
    //shuffle the password
    password=shufflePassword(Array.from(password));
    //showing in UI
    passwordDisplay.value=password;
    //calculating the strength of password
    calcStrength();
})
