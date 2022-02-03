
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

class Lexer extends Object {

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
	peek(){
	
		peek_pos=this.position+1;
		if(peek_pos>this.text.length-1){
			return null;
		}
		else{
			return this.text[peek_pos];
		}
	}

	isalpha(character) {
	return (((character >= 'a') && (character <= 'z')) || ((character >= 'A') && (character <= 'Z')));
	}

	isdigit(character) {
	return ((character >= '0') && (character <= '9'));
	}

	isalnum(character){
	return (this.isalpha(character) || this.isdigit(character));
	
	}
	integer(){
		let result="";
		while(this.current_char!=null && !isNaN(this.current_char)){
		
			result+=this.current_char;
			this.advance();
		}
		return parseInt(result);
	
	}

	_id(){
		let result="";
		while(this.current_char!=null && this.isalnum(this.current_char)){
			result+=this.current_char;
			this.advance();
			token=ReservedKeywords.get(result,new Token(ID,result));
		}
		return token;
	}

	get_next_token(){
	while(this.current_char!=null){
		if(this.isWhiteSpace(this.current_char)){
		
			this.skip_whitespace();
		}

		if(this.isalpha(this.current_char)){
			return this._id();	
		}

		if(this.isdigit(this.current_char)){
			return new Token(INTEGER,this.integer());
		}

		if(this.current_char===":" && this.peek()==="="){
			this.advance();
			this.advance();
			return new Token(ASSIGN,":=");
		}

		if(this.current_char===";"){
		
			this.advance();
			return new Token(SEMI,";");
		}

		if(this.current_char==="+"){
		
			this.advance();
			return new Token(PLUS,"+");
		}

		if(this.current_char==="-"){
			this.advance();
			return new Token(MINUS,"-");
		
		}

		if(this.current_char==="*"){
			this.advance();
			return new Token(MUL,"*");
		 }

		 if(this.current_char==="/"){
		 	this.advance();
			return new Token(DIV,"/");
	
		 }

		 if(this.current_char==="("){
		 
		 	this.advance();
			return new Token(LPAREN,"(");
		}

		if(this.current_char===")"){
		
			this.advance();
			return new Token(RPAREN,")");
		}

		if(this.current_char==="="){
			this.advance();
			return new Token(EQUAL,"=");	
		}

		if(this.current_char==="<"){
			this.advance();
			return new Token(LESSTHAN,"<");
		} 

		if(this.current_char===">"){
			this.advance();
			return new Token(GREATERTHAN,">");
		}

		if(this.current_char==="∧"){
			this.advance();
			return new Token(AND,"∧");
		}

		if(this.current_char==="V"){
			this.advance();
			return new Token(OR,"V");
		}

		if(this.current_char==="¬"){
			this.advance();
			return new Token(NOT,"¬");
		}

		if(this.current_char==="{"){
			this.advance();
			return new Token(LBRACE,"{");
		}

		if(this.current_char==="}"){
			this.advance();
	 		return new Token(RBRACE,"}");
		}
	this.error();
	}
	return new Token(EOF,null);
	}


}

class AST extends Object{

}

class BinOp extends AST {

	constructor(left,op,right){
		super(left,op,right);
		this.left=left;
		this.token=this.op=op;
		this.right=right;
	}
} 

class Num extends AST {
	
	constructor(token){
		super(token);
		this.token=token;
		this.value=token.value;
	}
}

class UnaryOp extends AST {

	constructor(op,expr){
		super(op,expr);
		this.token=this.op=op;
		this.expr=expr;
		}	
	}


class Compound extends AST {
	constructor(){
		this.children=[];
	}
}

class Assign extends AST {
	constructor(left,op,right){
		super(left,op,right);
		this.left=left;
		this.token=this.op=op;
		this.right=right;
	}
}

class Var extends AST {
	constructor(token){
		super(token);
		this.token=token;
		this.value=token.value;
	}
}

class NoOp extends AST{

}

class If extends AST {
	constructor(bool,if_true,if_false){
		super(bool,if_true,if_false);
		this.bool=bool;
		this.if_true=if_true;
		this.if_false=if_false;
	
	}
}

class While extends AST {
	constructor(bool,if_true){
		super(bool,if_true);
		this.bool=bool;
		this.if_true=if_true;
	}
}

class Relation extends AST {
	constructor(left,op,right){
		super(left,op,right);
		this.left=left;
		this.token=this.op=op;
		this.right=right;
	}
}

class Comparision extends AST {
	constructor(left,op,right){
		super(left,op,right);
		this.left=left;
		this.token=this.op=op;
		this.right=right;
	}
}

class Parser extends Object {
	constructor(lexer){
		super(lexer);
		this.lexer=lexer;
		this.current_token=this.lexer.get_next_token();
	}
	
	error(){
		throw "Invalid syntax";
	}

	eat(token_type){
		if(this.current_token.type===token_type){
			this.current_token=this.lexer.get_next_token();
		}
		else{
			this.error();
		}
	}

	program(){
		node=this.compound_statement();
		return node;
	}

	compound_statement(){
		nodes=this.statement_list();
		root=new Compound();
		for(let i=0; i<nodes.length;i++){
			root.children.push(nodes[i]);
		}
		return root;
	}

	while_compound(){
		this.eat(WHILE);
		bool=this.boolean_relation();
		this.eat(DO);
		if(this.current_token.type===LBRACE){
			this.eat(LBRACE);
			if_true=this.compound_statement();
			this.eat(RBRACE);
		}
		else{
			if_true=this.statement();
		}

		node=While(bool,if_true);

		return node;
	}

	if_compound(){
		this.eat(IF);
		bool=this.boolean_relation();
		this.eat(THEN);
		if(this.current_token.type===LBRACE){
			this.eat(LBRACE);
			if_true=this.compound_statement();
			this.eat(RBRACE);
		}
		else{
			if_true=this.statement();
		}
		this.eat(ELSE);

		if(this.current_token.type===LBRACE){
			this.eat(LBRACE);
			if_false=this.compound_statement();
			this.eat(RBRACE);
		}
		else{
			if_false=this.statement();
		}

		node=If(bool,if_true,if_false);

		return node;
	}

	boolean_relation(){
		core(){
			token=this.current_token;
			if(token.type===NOT){
				this.eat(NOT);
				left=this.boolean_comparision();
				node=new Relation(left,token,null);
			}
			else{
				left=this.boolean_comparision();
				token=this.current_token;

				if(token_type===AND){
					this.eat(AND);
					right=this.boolean_comparision();
					node=Relation(left,token,right);
				}
				else if(token.type===OR){
					this.eat(OR);
					right=this.boolean_comparision();
					node=new Relation(left,token,right);
				}
				else{
					node=new Relation(left,null,null);
				}
			}
			return node;
		}

		if(this.current_token.type===LPAREN){
			this.eat(LPAREN);
			node=core();
			this.eat(RPAREN);
		}
		else{
			node=core();
		}

		return node;
	}

	boolean_comparision(){
		core(){
			if(this.current_token.type===TRUE){
				this.eat(TRUE);
				node=new Comparision(True,null,null);
			}
			else if(this.current_token.type===FALSE){
				this.eat(FALSE);
				node=new Comparision(False,null,null);
			}
			else{
				left=this.expr();
				token=this.current_token;
				if(token.type===EQUAL){
					this.eat(EQUAL);
				}
				else if(token.type===LESSTHAN){
					this.eat(LESSTHAN);
				}
				else if(token.type===GREATERTHAN){
					this.eat(GREATERTHAN);
				}
				right=this.expr();
				node= new Comparision(left,token,right);
			}
			return node;
		}
		if(this.current_token.type===LPAREN){
			this.eat(LPAREN);
			node=core();
			this.eat(RPAREN);
		}
		else{
			node=core();
		}

		return node;
	}

	statement_list(){
		node=this.statement();

		results=[];
		results.push(node);

		while(this.current_token.type===SEMI){
			this.eat(SEMI);
			results.push(this.statement());
		}

		if(this.current_token.type===ID){
			this.error();
		}

		return results;
	}
	
	statement(){
		if(this.current_token.type===ID){
			node=this.assignment_statement();
		}
		else if(this.current_token.type===IF){
			node=this.if_compound();
		}
		else if(this.current_token.type===WHILE){
			node=this.while_compound();
		}
		else if(this.current_token.type===SKIP){
			this.eat(SKIP);
			node=this.empty();
		}
		else{
			node=this.empty();
		}
		return node;
	}



}



//class Var extends AST{}
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


try {
readline.question(``, program => {
  lexer= new Lexer(program);
  console.log(`${program}`)
  readline.close();
  
});

}

catch(error){

	throw "Invalid Syntax";
}



