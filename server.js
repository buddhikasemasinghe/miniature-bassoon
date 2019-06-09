var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var Message = require('./message');
var RandomDie = require('./randomDie');

var schema = buildSchema(`
    type Query {
        getDie(numSides: Int): RandomDie
        getMessage(id: ID!): Message
        getMessages: [Message]
    }

    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }

    input MessageInput {
        content: String
        author: String
    }
`);

var fakeDatabase = {};

var root = {
   getDie: ({numSides}) => {
       return new RandomDie(numSides || 6);
   },
   getMessage: (id) => {
       if(!fakeDatabase[id]){
           throw new Error('Could not find the message');
       }
       return new Message(id, fakeDatabase[id]);
   },
   createMessage: ({input}) => {
       var id = require('crypto').randomBytes(10).toString('hex');

       fakeDatabase[id] = input;
       return new Message(id, fakeDatabase[id]);
   },
   updateMessage: ({id, input}) => {
    if(!fakeDatabase[id]){
        throw new Error('Could not find the message to update' + id);
    }

    fakeDatabase[id] = input;
    return new Message(id, fakeDatabase[id]);
   },
   getMessages: () => {
       const messages = [];
       for(const [key, value] of Object.entries(fakeDatabase)){
            messages.push(new Message(key, value))
       }
       return messages;
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