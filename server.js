var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var RandomDie = require('./randomDie');

var schema = buildSchema(`
    type Query {
        getDie(numSides: Int): RandomDie
    }

    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }
`);

var root = {
   getDie: function({numSides}){
       return new RandomDie(numSides || 6);
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