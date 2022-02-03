const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


try {
readline.question(``, program => {
  console.log(`${program}`)
  readline.close()
});

}

catch(error){

	throw "Invalid Syntax";
}



