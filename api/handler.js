'use strict';
const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, buildSchema } = require('graphql');


const UserType = genUserType(GraphQLString)
const QueryType = genQueryType(UserType)
const Schema = genGraphQLSchema(QueryType)

module.exports.graphql = (event, context, callback) => {
  const { query, variables } = JSON.parse(event.body);

  graphql(Schema, query, null, {}, variables)
    .then((response) => callback(null, createResponse(200, response)))
    .catch((error) => callback(null, createResponse(error.responseStatusCode || 500, { message: error.message || 'Internal server error' })));
};

////////////
// private

function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS
    },
    body: JSON.stringify(body),
  }
}

function genUserType(_GraphQLString) {
  return new GraphQLObjectType({
    name: 'User',
    description: 'A person who uses our app',
    fields: () => ({
      id: {
        type: _GraphQLString,
        description: 'The unique Identifier of the user',
      },
      name: {
        type: _GraphQLString,
        description: 'The name of the user',
      },
    }),
  })
}
function genQueryType(_UserType) {
  return new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      // Add your own root fields here
      viewer: {
        type: _UserType,
        resolve: (_, _args, context) => (
          {
            _type: 'user',
            id: '1',
            name: 'スヌーピー',
          }
        ),
      },
    }),
  })
}
function genGraphQLSchema(_QueryType) {
  return new GraphQLSchema({
    query: _QueryType,
  });
}
