var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
    type Query {
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
`);

var root = {
    rollDice: function({numDice, numSides}) {
        var outPut = [];
        [...Array(numDice).keys()].forEach(i => {
            outPut.push(1 + Math.floor(Math.random() * (numSides || 6)));
        });
        return outPut;
    }
}


var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue:  root,
    graphiql: true
}));

app.listen(8519);
console.log('Running GraphQL Express Server ....');