'use strict'

const AWS = require('aws-sdk')
const UUID = require('uuid')
const Reply = require('../lib/reply.js')

AWS.config.setPromisesDependency(require('bluebird'))

const dynamoDb = new AWS.DynamoDB.DocumentClient()

const createUser = user => {
  console.log('Submitting user')
  const data = {
    TableName: process.env.TABLE_USERS,
    Item: user
  }
  return dynamoDb.put(data).promise()
    .then(res => user)
    .catch(err => {
      console.log(err)
    })
}

const userInfo = (email) => {
  const timestamp = new Date().getTime()
  return {
    id: UUID.v1(),
    email: email,
    submittedAt: timestamp,
    updatedAt: timestamp
  }
}

// Create
// --------------------------------------------------------
module.exports.create = (event, context, callback) => {
  const requestBody = JSON.parse(event.body)
  const email = requestBody.email

  if (typeof email !== 'string') {
    console.error('Validation Failed')
    callback(new Error('Couldn\'t submit user because of validation errors.'))
    return
  }

  createUser(userInfo(email))
  .then(res => {
    callback(null, Reply.success({
      message: `Sucessfully submitted user with email ${email}`,
      candidateId: res.id
    }))
  })
  .catch(err => {
    console.log(err)
    callback(null, Reply.badImplementation({
      message: `Unable to submit user with email ${email}`
    }))
  })
}

// Get
// --------------------------------------------------------
module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE_USERS,
    Key: {
      id: event.pathParameters.id
    }
  }

  dynamoDb.get(params).promise()
    .then(result => {
      callback(null, Reply.success(result.Item))
    })
    .catch(error => {
      console.error(error)
      callback(new Error('Couldn\'t fetch candidate.'))
      return
    })
}

// List
// --------------------------------------------------------
module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE_USERS,
    ProjectionExpression: 'id, email'
  }

  console.log('Scanning Users Table.')
  const onScan = (err, data) => {
    if (err) {
      console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2))
      callback(err)
    } else {
      console.log('Scan succeeded.')
      return callback(null, Reply.success(data.Items))
    }
  }

  dynamoDb.scan(params, onScan)
}

// Update
// --------------------------------------------------------
module.exports.update = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      // 'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({
      message: 'User Updated!',
      input: event,
      // environment: process.env
    })
  }

  callback(null, response)
}
