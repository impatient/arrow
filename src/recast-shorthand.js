var recast = require('recast');
var Visitor = recast.Visitor;
var Syntax = recast.Syntax;

// Let's turn this function declaration into a variable declaration.
var code = [
  "var name = 'Walter';",
  "var titl= 'Scientist';",
  "var options= {name,title:{titl},division:'Fringe'};"
].join("\n");

var ast = recast.parse(code);

var b = recast.types.builders;

var Shorthand = Visitor.extend( {
   visitObjectExpression: function(objectExpression) {
     var newProperties = objectExpression.properties.map(function(prop) {
       return b.property(
         prop.kind,
         prop.key,
         this.visit(prop.value),
         prop.method,
         false);
     }.bind(this));

     return b.objectExpression(newProperties);

   }

});

 new Shorthand().visit(ast);

var output = recast.print(ast).code;

console.log('Output prepared');
console.log(output);