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

let GlobalScope = {}

class Token {
	constructor(type, value){
		this.type=type;
		this.value=value;
	}
}

const ReservedKeywords = {
	if : new Token(IF, 'if'),
	then : new Token(THEN, 'then'),
	else : new Token(ELSE, 'else'),
	while : new Token(WHILE, 'while'),
	do : new Token(DO, 'do'),
	true : new Token(TRUE, 'true'),
	false : new Token(FALSE, 'false'),
	skip : new Token(SKIP, 'skip')
}

class Lexer extends Object {
	constructor(text){
		super(text);
		this.text = text;
		this.position = 0;
		this.current_char = this.text[this.position];
	}
	error() {
		throw "Invalid syntax";
	}
	isWhiteSpace(character){
		const whiteSpaceRegEx= /\s/;
		return whiteSpaceRegEx.test(character);
	}
	advance(){
		this.position += 1;
		if(this.position > this.text.length-1){
			this.current_char = null;
		} else {
			this.current_char = this.text[this.position];
		}
	}
	skipWhitespace(){
		while(this.current_char != null && this.isWhiteSpace(this.current_char)){
			this.advance();
		}
	}
	peek(){
		let peek_pos = this.position+1;
		if(peek_pos > this.text.length-1){
			return null;
		} else {
			return this.text[peek_pos];
		}
	}
	isAlpha(character) {
		return (((character >= 'a') && (character <= 'z')) || ((character >= 'A') && (character <= 'Z')));
	}
	isDigit(character) {
		return ((character >= '0') && (character <= '9'));
	}
	isAlnum(character){
		return (this.isAlpha(character) || this.isDigit(character));
	}
	integer(){
		let result = "";
		while(this.current_char!=null && this.isDigit(this.current_char)){
			result+=this.current_char;
			this.advance();
		}
		return parseInt(result);
	}
	get(object, key, default_value) {
		if (key in object) {
			return object[key];
		} else {
			return default_value;
		}
	}
	_id(){
		let result = "";
		let token = "";
		while(this.current_char!=null && this.isAlnum(this.current_char)){
			result += this.current_char;
			this.advance();
		}
		token = this.get(ReservedKeywords, result, new Token(ID, result));
		return token;
	}
	get_next_token() {
		while(this.current_char != null){
			if(this.isWhiteSpace(this.current_char)){
				this.skipWhitespace();
			}
			if(this.isAlpha(this.current_char)){
				return this._id();	
			}
			if(this.isDigit(this.current_char)){
				return new Token(INTEGER,this.integer());
			}
			if(this.current_char === ":" && this.peek() === "="){
				this.advance();
				this.advance();
				return new Token(ASSIGN,":=");
			}
			if(this.current_char === ";"){
				this.advance();
				return new Token(SEMI,";");
			}
			if(this.current_char === "+"){
				this.advance();
				return new Token(PLUS,"+");
			}
			if(this.current_char === "-"){
				this.advance();
				return new Token(MINUS,"-");
			}
			if(this.current_char === "*"){
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
			if(this.current_char==="∨"){
				this.advance();
				return new Token(OR,"∨");
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
		super();
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
		this.current_token = this.lexer.get_next_token();
	}
	
	error(){
		throw "Invalid syntax";
	}

	eat(token_type){
		if(this.current_token.type === token_type){
			this.current_token=this.lexer.get_next_token();
		}
		else{
			this.error();
		}
	}

	program(){
		let node=this.compound_statement();
		return node;
	}
	compound_statement(){
		let nodes = this.statement_list();
		let root = new Compound();
		for(let i = 0; i < nodes.length; i++){
			root.children.push(nodes[i]);
		}
		return root;
	}
	while_compound(){
		let node;
		let if_true;
		this.eat(WHILE);
		let bool = this.boolean_relation();
		this.eat(DO);
		if(this.current_token.type === LBRACE){
			this.eat(LBRACE);
			if_true = this.compound_statement();
			this.eat(RBRACE);
		}
		else{
			if_true=this.statement();
		}
		node = new While(bool,if_true);
		return node;
	}
	if_compound(){
		let node;
		let bool;
		let if_true;
		let if_false;
		this.eat(IF);
		bool = this.boolean_relation();
		this.eat(THEN);
		if(this.current_token.type === LBRACE){
			this.eat(LBRACE);
			if_true=this.compound_statement();
			this.eat(RBRACE);
		} else {
			if_true=this.statement();
		}
		this.eat(ELSE);
		if(this.current_token.type === LBRACE){
			this.eat(LBRACE);
			if_false = this.compound_statement();
			this.eat(RBRACE);
		}
		else{
			if_false = this.statement();
		}
		node = new If(bool,if_true,if_false);
		return node;
	}

	boolean_relation(){
		let node;
		let left;
		let right;
		function core(obj){
			let token = obj.current_token;
			if(token.type === NOT){
				obj.eat(NOT);
				left = obj.boolean_comparision();
				node = new Relation(left,token,null);
			} else {
				left = obj.boolean_comparision();
				token = obj.current_token;
				if(token.type === AND){
					obj.eat(AND);
					right = obj.boolean_comparision();
					node = new Relation(left, token, right);
				} else if(token.type === OR){
					obj.eat(OR);
					right = obj.boolean_comparision();
					node = new Relation(left,token,right);
				}
				else{
					node = new Relation(left, null, null);
				}
			}
			return node;
		}
		if(this.current_token.type === LPAREN) {
			this.eat(LPAREN);
			node = core(this);
			this.eat(RPAREN);
		} else {
			node = core(this);
		}
		return node;
	}

	boolean_comparision(){
		let node;
		let left;
		let right;
		function core(obj){
			let token = obj.current_token;
			if(token.type === TRUE){
				obj.eat(TRUE);
				node = new Comparision(true, null, null);
			} else if(token.type === FALSE){
				obj.eat(FALSE);
				node = new Comparision(false, null, null);
			} else {
				left = obj.expr();
				token = obj.current_token;
				if(token.type === EQUAL){
					obj.eat(EQUAL);
				} else if(token.type === LESSTHAN){
					obj.eat(LESSTHAN);
				} else if(token.type === GREATERTHAN){
					obj.eat(GREATERTHAN);
				}
				right = obj.expr();
				node = new Comparision(left, token, right);
			}
			return node;
		}
		if(this.current_token.type === LPAREN){
			this.eat(LPAREN);
			node = core(this);
			this.eat(RPAREN);
		} else{
			node = core(this);
		}
		return node;
	}

	statement_list(){
		let node = this.statement();
		let results=[];
		results.push(node);
		while(this.current_token.type === SEMI){
			this.eat(SEMI);
			results.push(this.statement());
		}
		if(this.current_token.type === ID){
			this.error();
		}
		return results;
	}
	
	statement(){
		let node;
		if(this.current_token.type === ID){
			node = this.assignment_statement();
		} else if(this.current_token.type === IF){
			node = this.if_compound();
		} else if(this.current_token.type === WHILE){
			node = this.while_compound();
		} else if(this.current_token.type === SKIP){
			this.eat(SKIP);
			node=this.empty();
		} else{
			node=this.empty();
		}
		return node;
	}
	
	assignment_statement(){
		let left = this.variable();
		let token = this.current_token;
		this.eat(ASSIGN);
		let right = this.expr();
		let node = new Assign(left, token, right);
		return node;
	}

	variable(){
		let node;
		node = new Var(this.current_token);
		this.eat(ID);
		return node;
	}
	
	empty(){
		return new NoOp();
	}

	expr(){
		let node;
		let token;
		node = this.term();
		while(this.current_token.type === PLUS || this.current_token.type === MINUS){
			token = this.current_token;
			if(token.type === PLUS){
				this.eat(PLUS);
			}
			else if(token.type === MINUS){
				this.eat(MINUS);
			}
			node = new BinOp(node, token, this.term());
		}
		return node;
	}

	term(){
		let node;
		let token;
		node = this.factor();
		while(this.current_token.type === MUL || this.current_token === DIV){
			token = this.current_token;
			if(token.type === MUL){
				this.eat(MUL);
			}
			else if(token.type === DIV){
				this.eat(DIV);
			}
			
			node=new BinOp(node, token, this.factor());
		}
		return node;
	}

	factor(){
		let token = this.current_token;
		let node;
		if(token.type === PLUS){
			this.eat(PLUS);
			node = new UnaryOp(token, this.factor());
			return node;
		} else if(token.type===MINUS){
			this.eat(MINUS);
			node = new UnaryOp(token,this.factor());
			return node;
		} else if(token.type===INTEGER){
			this.eat(INTEGER);
			return new Num(token);
		} else if(token.type===LPAREN){
			this.eat(LPAREN);
			node = this.expr();
			this.eat(RPAREN);
			return node;	
		} else{
			node = this.variable();
			return node;
		}
	}
	parse(){
		let node = this.program();
		if(this.current_token.type != EOF){
			this.error();
		}
		return node;
	}
}

class Interpreter extends Object{
	constructor(parser){
		super(parser);
		this.parser = parser;
	}
	 get(object, key, default_value) {
	 	let result = object[key];
		return (typeof result !== "undefined") ? result : default_value;
	}

	visit(node){
		if(node instanceof BinOp){
			return this.visit_BinOp(node);
		}
		if(node instanceof While){
			return this.visit_While(node);
		}
		if(node instanceof If){
			return this.visit_If(node);
		}
		if(node instanceof Relation){
			return this.visit_Relation(node);
		}
		if(node instanceof Comparision){
			return this.visit_Comparision(node);
		}
		if(node instanceof Num){
			return this.visit_Num(node);
		}
		if(node instanceof UnaryOp){
			return this.visit_UnaryOp(node);
		}
		if(node instanceof Compound){
			return this.visit_Compound(node);
		}
		if(node instanceof Assign){
			return this.visit_Assign(node);
		}
		if(node instanceof Var){
			return this.visit_Var(node);
		}
		if(node instanceof NoOp){
			return this.visit_NoOp(node);
		}
	}

	visit_While(node){
		while(this.visit(node.bool) == "true" || this.visit(node.bool) == true){
			this.visit(node.if_true);
		}
	}

	visit_If(node){
		let bool;
		bool=this.visit(node.bool);
		if(bool === 'true' || bool === true) {
			this.visit(node.if_true);
		}
		if(bool === 'false' || bool == false){
			this.visit(node.if_false);
		}
	}

	visit_Relation(node){
		if(node.op===null){
			return this.visit(node.left);
		}
		if(node.op.type===AND){
			return this.visit(node.left) && this.visit(node.right);
		}
		if(node.op.type===OR){
			return this.visit(node.left) || this.visit(node.right);
		}
		if(node.op.type===NOT){
			return !this.visit(node.left);
		}
	}

	visit_Comparision(node){
		if(node.op===null){
			return node.left;
		}
		if(node.op.type===EQUAL){
			return this.visit(node.left)===this.visit(node.right);
		}
		if(node.op.type===LESSTHAN){
			return this.visit(node.left)<this.visit(node.right);
		}
		if(node.op.type===GREATERTHAN){
			return this.visit(node.left)>this.visit(node.right);
		}
		if(node.op.type===TRUE){
			return true;
		}
		if(node.op.type===FALSE){
			return false;
		}
	}
	
	visit_BinOp(node){
		if(node.op.type===PLUS){
			return this.visit(node.left)+this.visit(node.right);
		}
		if(node.op.type===MINUS){
			return this.visit(node.left)-this.visit(node.right);
		}
		if(node.op.type===MUL){
			return this.visit(node.left)*this.visit(node.right);
		}
		if(node.op.type===DIV){
			return this.visit(node.left)/this.visit(node.right);
		}
	}

	visit_Num(node){
		return node.value;
	}

	visit_UnaryOp(node){
		let op=node.op.type;
		if(op===PLUS){
			return +this.visit(node.expr);
		}
		if(op===MINUS){
			return -this.visit(node.expr);
		}
	}

	visit_Compound(node){
		for(let i=0;i<node.children.length;i++){
			this.visit(node.children[i]);
		}	
	}

	visit_Assign(node){
		GlobalScope[node.left.value] = this.visit(node.right);	
	}
	visit_Var(node){
		let var_name = node.value;
		return this.get(GlobalScope, var_name, 0 );
	}
	
	visit_NoOp(node){
		return null;
	}

	interpret(){
		let tree = this.parser.parse();
		if(tree === null){
			return '';
		}
		return this.visit(tree);
	}
}



//class Var extends AST{}
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


try {
	readline.question(``, program => {
		let lexer = new Lexer(program);
		parser = new Parser(lexer);
		interpreter = new Interpreter(parser);
		result = interpreter.interpret();
		states = []
		if ( Object.keys(GlobalScope).length == 0) {
			console.log("{}");
			return;
		}

		const ordered = Object.keys(GlobalScope).sort().reduce(
			(obj, key) => { 
			  obj[key] = GlobalScope[key]; 
			  return obj;
			}, 
			{}
		  );

		for (let k in ordered) {
			states.push(k + " → " + GlobalScope[k]);
		}
		console.log("{" + states.join(", ") + "}");
		readline.close();
	});
} catch(error){
	throw "Invalid Syntax";
}

