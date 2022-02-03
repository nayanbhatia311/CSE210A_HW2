
const INTEGER="INTEGER";
const PLUS="PLUS";
const MINUS="MINUS";
const MUL="MUL";
const DIV="DIV";
const LPAREN="(";
const RPAREN=")";
const ID="ID";
const ASSIGN="ASSIGN";
const SEMI="SEMI";
const EOF="EOF";
const EQUAL="EQUAL";
const LESSTHAN="LESSTHAN";
const GREATERTHAN="GREATERTHAN";
const AND="AND";
const OR="OR";
const NOT="NOT";
const IF="if";
const THEN="then";
const ELSE="else";
const LBRACE="{";
const RBRACE="}";
const WHILE="while";
const DO="do";
const TRUE="true";
const FALSE="false";
const SKIP="skip";

class Token{

	constructer(type,value){
	this.type=type;
	this.value=value;

}

}


 const ReservedKeywords={
          'if': new Token('if','if'),
          'then': new Token('then','then'),
          'else': new Token('else','else'),
          'while': new Token('while','while'),
          'do': new Token('do','do'),
          'true': new Token('true','true'),
          'false': new Token('false','false'),
          'skip': new Token('skip','skip')
}

const Lexer extends Object {

	constructor(text){
	super(text);
	this.text=text;
	this.position=0;
	this.current_char=this.text[this.position];
}

	error() {
	throw "invalid syntax";
	
	}
	isWhiteSpace(character){
		const whiteSpaceRegEx= /\s/;
		return whiteSpaceRegEx.text(character);
	
	}
	advance(){
	this.position+=1;
	if(this.position > this.text.length-1){
		this.current_char=null;
	
	}
	else{
		this.current_char=this.text[this.position];
	}
	}

	skip_whitespace(){
		while(this.current_char!=null && isWhiteSpace(this.current_char)){
			this.advance();
		}
	
	}


}


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


try {
readline.question(``, program => {
  console.log(`${program}`)
  readline.close();
  
});

}

catch(error){

	throw "Invalid Syntax";
}



