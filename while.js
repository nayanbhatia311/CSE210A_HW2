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
const LBRACKET='[';
const RBRACKET=']';

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
	customError() {
		throw "Invalid syntax";
	}
	isWhiteSpace(character){
		const whiteSpaceRegEx= /\s/;
		return whiteSpaceRegEx.test(character);
	}
	moveForward(){
		this.position += 1;
		if(this.position > this.text.length-1){
			this.current_char = null;
		} else {
			this.current_char = this.text[this.position];
		}
	}
	skipWhitespace(){
		while(this.current_char != null && this.isWhiteSpace(this.current_char)){
			this.moveForward();
		}
	}
	peekTopElement(){
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
	ifInteger(){
		let result = "";
		while(this.current_char!=null && this.isDigit(this.current_char)){
			result+=this.current_char;
			this.moveForward();
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
			this.moveForward();
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
				return new Token(INTEGER,this.ifInteger());
			}
			if(this.current_char === ":" && this.peekTopElement() === "="){
				this.moveForward();
				this.moveForward();
				return new Token(ASSIGN,":=");
			}
			if(this.current_char === ";"){
				this.moveForward();
				return new Token(SEMI,";");
			}
			if(this.current_char === "+"){
				this.moveForward();
				return new Token(PLUS,"+");
			}
			if(this.current_char === "-"){
				this.moveForward();
				return new Token(MINUS,"-");
			}
			if(this.current_char === "*"){
				this.moveForward();
				return new Token(MUL,"*");
			}
			if(this.current_char==="/"){
				this.moveForward();
				return new Token(DIV,"/");
			}
			if(this.current_char==="("){
				this.moveForward();
				return new Token(LPAREN,"(");
			}
			if(this.current_char===")"){
				this.moveForward();
				return new Token(RPAREN,")");
			}
			if(this.current_char==="="){
				this.moveForward();
				return new Token(EQUAL,"=");	
			}
			if(this.current_char==="<"){
				this.moveForward();
				return new Token(LESSTHAN,"<");
			} 
			if(this.current_char===">"){
				this.moveForward();
				return new Token(GREATERTHAN,">");
			}
			if(this.current_char==="∧"){
				this.moveForward();
				return new Token(AND,"∧");
			}
			if(this.current_char==="∨"){
				this.moveForward();
				return new Token(OR,"∨");
			}
			if(this.current_char==="¬"){
				this.moveForward();
				return new Token(NOT,"¬");
			}
			if(this.current_char==="{"){
				this.moveForward();
				return new Token(LBRACE,"{");
			}
			if(this.current_char==="}"){
				this.moveForward();
				return new Token(RBRACE,"}");
			}
			this.customError();
		}
		return new Token(EOF,null);
	}
}

class AST extends Object{

}

class Arithmetic extends AST {
	constructor(left_node,op,right_node){
		super(left_node,op,right_node);
		this.left_node=left_node;
		this.token=this.op=op;
		this.right_node=right_node;
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
	constructor(left_node,op,right_node){
		super(left_node,op,right_node);
		this.left_node=left_node;
		this.token=this.op=op;
		this.right_node=right_node;
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
	constructor(bool,condition_if_true,condition_if_false){
		super(bool,condition_if_true,condition_if_false);
		this.bool=bool;
		this.condition_if_true=condition_if_true;
		this.condition_if_false=condition_if_false;
	
	}
}

class While extends AST {
	constructor(bool,condition_if_true){
		super(bool,condition_if_true);
		this.bool=bool;
		this.condition_if_true=condition_if_true;
	}
}

class Relation extends AST {
	constructor(left_node,op,right_node){
		super(left_node,op,right_node);
		this.left_node=left_node;
		this.token=this.op=op;
		this.right_node=right_node;
	}
}

class Comparision extends AST {
	constructor(left_node,op,right_node){
		super(left_node,op,right_node);
		this.left_node=left_node;
		this.token=this.op=op;
		this.right_node=right_node;
	}
}

class Parser extends Object {
	constructor(lexer){
		super(lexer);
		this.lexer=lexer;
		this.current_token = this.lexer.get_next_token();
	}
	
	customError(){
		throw "Invalid syntax";
	}

	eat(token_type){
		if(this.current_token.type === token_type){
			this.current_token=this.lexer.get_next_token();
		}
		else{
			this.customError();
		}
	}

	getOutput(){
		let node=this.compound_getStatement();
		return node;
	}
	compound_getStatement(){
		let nodes = this.get_all_list();
		let root = new Compound();
		for(let i = 0; i < nodes.length; i++){
			root.children.push(nodes[i]);
		}
		return root;
	}
	while_getStatement(){
		let node;
		let condition_if_true;
		this.eat(WHILE);
		let bool = this.getBooleanRelation();
		this.eat(DO);
		if(this.current_token.type === LBRACE){
			this.eat(LBRACE);
			condition_if_true = this.compound_getStatement();
			this.eat(RBRACE);
		}
		else{
			condition_if_true=this.getStatement();
		}
		node = new While(bool,condition_if_true);
		return node;
	}
	if_block(){
		let node;
		let bool;
		let condition_if_true;
		let condition_if_false;
		this.eat(IF);
		bool = this.getBooleanRelation();
		this.eat(THEN);
		if(this.current_token.type === LBRACE){
			this.eat(LBRACE);
			condition_if_true=this.compound_getStatement();
			this.eat(RBRACE);
		} else {
			condition_if_true=this.getStatement();
		}
		this.eat(ELSE);
		if(this.current_token.type === LBRACE){
			this.eat(LBRACE);
			condition_if_false = this.compound_getStatement();
			this.eat(RBRACE);
		}
		else{
			condition_if_false = this.getStatement();
		}
		node = new If(bool,condition_if_true,condition_if_false);
		return node;
	}

	getBooleanRelation(){
		let node;
		let left_node;
		let right_node;
		function core(obj){
			let token = obj.current_token;
			if(token.type === NOT){
				obj.eat(NOT);
				left_node = obj.compareBool();
				node = new Relation(left_node,token,null);
			} else {
				left_node = obj.compareBool();
				token = obj.current_token;
				if(token.type === AND){
					obj.eat(AND);
					right_node = obj.compareBool();
					node = new Relation(left_node, token, right_node);
				} else if(token.type === OR){
					obj.eat(OR);
					right_node = obj.compareBool();
					node = new Relation(left_node,token,right_node);
				}
				else{
					node = new Relation(left_node, null, null);
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

	compareBool(){
		let node;
		let left_node;
		let right_node;
		function core(obj){
			let token = obj.current_token;
			if(token.type === TRUE){
				obj.eat(TRUE);
				node = new Comparision(true, null, null);
			} else if(token.type === FALSE){
				obj.eat(FALSE);
				node = new Comparision(false, null, null);
			} else {
				left_node = obj.evaluateExpression();
				token = obj.current_token;
				if(token.type === EQUAL){
					obj.eat(EQUAL);
				} else if(token.type === LESSTHAN){
					obj.eat(LESSTHAN);
				} else if(token.type === GREATERTHAN){
					obj.eat(GREATERTHAN);
				}
				right_node = obj.evaluateExpression();
				node = new Comparision(left_node, token, right_node);
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

	get_all_list(){
		let node = this.getStatement();
		let outputs=[];
		outputs.push(node);
		while(this.current_token.type === SEMI){
			this.eat(SEMI);
			outputs.push(this.getStatement());
		}
		if(this.current_token.type === ID){
			this.customError();
		}
		return outputs;
	}
	
	getStatement(){
		let node;
		if(this.current_token.type === ID){
			node = this.assignment_block();
		} else if(this.current_token.type === IF){
			node = this.if_block();
		} else if(this.current_token.type === WHILE){
			node = this.while_getStatement();
		} else if(this.current_token.type === SKIP){
			this.eat(SKIP);
			node=this.ifempty();
		} else{
			node=this.ifempty();
		}
		return node;
	}
	
	assignment_block(){
		let left_node = this.ifVariableOccured();
		let token = this.current_token;
		this.eat(ASSIGN);
		let right_node = this.evaluateExpression();
		let node = new Assign(left_node, token, right_node);
		return node;
	}

	ifVariableOccured(){
		let node;
		node = new Var(this.current_token);
		this.eat(ID);
		return node;
	}
	
	ifempty(){
		return new NoOp();
	}

	evaluateExpression(){
		let node;
		let token;
		node = this.ifMultiplicationDivision();
		while(this.current_token.type === PLUS || this.current_token.type === MINUS){
			token = this.current_token;
			if(token.type === PLUS){
				this.eat(PLUS);
			}
			else if(token.type === MINUS){
				this.eat(MINUS);
			}
			node = new Arithmetic(node, token, this.ifMultiplicationDivision());
		}
		return node;
	}

	ifMultiplicationDivision(){
		let node;
		let token;
		node = this.ifPlusMinusIntegerBracket();
		while(this.current_token.type === MUL || this.current_token === DIV){
			token = this.current_token;
			if(token.type === MUL){
				this.eat(MUL);
			}
			else if(token.type === DIV){
				this.eat(DIV);
			}
			
			node=new Arithmetic(node, token, this.ifPlusMinusIntegerBracket());
		}
		return node;
	}

	ifPlusMinusIntegerBracket(){
		let token = this.current_token;
		let node;
		if(token.type === PLUS){
			this.eat(PLUS);
			node = new UnaryOp(token, this.ifPlusMinusIntegerBracket());
			return node;
		} else if(token.type===MINUS){
			this.eat(MINUS);
			node = new UnaryOp(token,this.ifPlusMinusIntegerBracket());
			return node;
		} else if(token.type===INTEGER){
			this.eat(INTEGER);
			return new Num(token);
		} else if(token.type===LPAREN){
			this.eat(LPAREN);
			node = this.evaluateExpression();
			this.eat(RPAREN);
			return node;	
		} else{
			node = this.ifVariableOccured();
			return node;
		}
	}
	parseInput(){
		let node = this.getOutput();
		if(this.current_token.type != EOF){
			this.customError();
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
		if(node instanceof Arithmetic){
			return this.visit_Arithmetic(node);
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
			this.visit(node.condition_if_true);
		}
	}

	visit_If(node){
		let bool;
		bool=this.visit(node.bool);
		if(bool === 'true' || bool === true) {
			this.visit(node.condition_if_true);
		}
		if(bool === 'false' || bool == false){
			this.visit(node.condition_if_false);
		}
	}

	visit_Relation(node){
		if(node.op===null){
			return this.visit(node.left_node);
		}
		if(node.op.type===AND){
			return this.visit(node.left_node) && this.visit(node.right_node);
		}
		if(node.op.type===OR){
			return this.visit(node.left_node) || this.visit(node.right_node);
		}
		if(node.op.type===NOT){
			return !this.visit(node.left_node);
		}
	}

	visit_Comparision(node){
		if(node.op===null){
			return node.left_node;
		}
		if(node.op.type===EQUAL){
			return this.visit(node.left_node)===this.visit(node.right_node);
		}
		if(node.op.type===LESSTHAN){
			return this.visit(node.left_node)<this.visit(node.right_node);
		}
		if(node.op.type===GREATERTHAN){
			return this.visit(node.left_node)>this.visit(node.right_node);
		}
		if(node.op.type===TRUE){
			return true;
		}
		if(node.op.type===FALSE){
			return false;
		}
	}
	
	visit_Arithmetic(node){
		if(node.op.type===PLUS){
			return this.visit(node.left_node)+this.visit(node.right_node);
		}
		if(node.op.type===MINUS){
			return this.visit(node.left_node)-this.visit(node.right_node);
		}
		if(node.op.type===MUL){
			return this.visit(node.left_node)*this.visit(node.right_node);
		}
		if(node.op.type===DIV){
			return this.visit(node.left_node)/this.visit(node.right_node);
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
		GlobalScope[node.left_node.value] = this.visit(node.right_node);	
	}
	visit_Var(node){
		let var_name = node.value;
		return this.get(GlobalScope, var_name, 0 );
	}
	
	visit_NoOp(node){
		return null;
	}

	interpret(){
		let tree = this.parser.parseInput();
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
		states = [];
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

