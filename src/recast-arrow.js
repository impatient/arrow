var recast = require('recast');
var Visitor = recast.Visitor;
var Syntax = recast.Syntax;

// Let's turn this function declaration into a variable declaration.
var code = [
  //"var  add = (a, b) => ((c,d) => c + d)(a,b);  //sum"
  "var  add = (a, b) => a + b;  //sum"
].join("\n");

var ast = recast.parse(code);

var b = recast.types.builders;

var fixBody = function(body) {
  if(body.type !== Syntax.BlockStatement) {

    return b.blockStatement([b.returnStatement(body)]);
  }
  return body;

};

var Arrow = Visitor.extend( {
   visitArrowFunctionExpression: function(arrow) {
     return b.callExpression(
       b.memberExpression(
         b.functionExpression(null, arrow.params, this.visit(fixBody(arrow.body))),
         b.identifier('bind'),false),
       [b.thisExpression()]);

   }

});

 new Arrow().visit(ast);

var output = recast.print(ast).code;

console.log(output);