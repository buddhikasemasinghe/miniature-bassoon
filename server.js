var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
    type Query {
        quoteOfTheDay: String
        random: Float!
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
`);

var root = {
    quoteOfTheDay: () => Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within',
    random: () => Math.random(),
    rollDice: ({numDice, numSides}) => {
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