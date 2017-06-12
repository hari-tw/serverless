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
  const timestamp = new Date().toISOString()
  return {
    id: UUID.v1(),
    email: email,
    createdAt: timestamp,
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
    console.log(`Item created with email ${email}`)
    callback(null, Reply.success({
      id: res.id
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
      console.log(`Item found with id ${event.pathParameters.id}`)
      callback(null, Reply.success(result.Item))
    })
    .catch(error => {
      console.error(error)
      callback(new Error('Couldn\'t fetch item.'))
      return
    })
}

// List
// --------------------------------------------------------
module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE_USERS,
    ProjectionExpression: 'id, email, createdAt, deletedAt'
  }

  console.log('Scanning Users Table.')
  const onScan = (err, data) => {
    if (err) {
      console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2))
      callback(err)
    } else {
      console.log('Scan succeeded.')
      // return callback(null, Reply.success(data.Items))
      return callback(null, Reply.success({
        a: 1,
        b: JSON.stringify(process.env.COGNITO_POOL_ID)
      }))
    }
  }

  dynamoDb.scan(params, onScan)
}

// Update
// --------------------------------------------------------
module.exports.update = (event, context, callback) => {
  const requestBody = JSON.parse(event.body)
  const name = requestBody.name

  if (typeof name !== 'string') {
    console.error('Validation Failed')
    callback(new Error('Couldn\'t submit user because of validation errors.'))
    return
  }

  const params = {
    TableName: process.env.TABLE_USERS,
    Key: {
      id: event.pathParameters.id
    },
    UpdateExpression: 'set fullName = :n',
    ExpressionAttributeValues: {
      ':n': name
    },
    ConditionExpression: [
      'attribute_exists(id)'
      // 'attribute_not_exists(deletedAt)'
    ],
    ReturnValues: 'ALL_NEW'
    // ReturnValues: 'UPDATED_NEW'
  }

  dynamoDb.update(params).promise()
    .then(result => {
      console.log(`Item updated with id ${event.pathParameters.id}`)
      callback(null, Reply.success({
        message: `Success`,
        result: result.Attributes
      }))
    })
    .catch(error => {
      console.error(error)
      if (error.statusCode === 400) {
        callback(null, Reply.notFound({
          message: 'Not found',
          error
        }))
      } else {
        callback(null, Reply.badImplementation({
          message: 'Internal error',
          error
        }))
      }
      return
    })
}

// Delete
// --------------------------------------------------------
module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE_USERS,
    Key: {
      id: event.pathParameters.id
    },
    UpdateExpression: 'set deletedAt = :dt',
    ExpressionAttributeValues: {
      ':dt': new Date().toISOString()
    },
    ConditionExpression: [
      'attribute_exists(id)'
      // 'attribute_not_exists(deletedAt)'
    ]
    // ReturnValues: 'ALL_NEW'
    // ReturnValues: 'UPDATED_NEW'
  }

  dynamoDb.update(params).promise()
    .then(result => {
      console.log(`Item deleted with id ${event.pathParameters.id}`)
      callback(null, Reply.success({
        message: `Success`
      }))
    })
    .catch(error => {
      console.error(error)
      if (error.statusCode === 400) {
        callback(null, Reply.notFound({
          message: 'Not found',
          error
        }))
      } else {
        callback(null, Reply.badImplementation({
          message: 'Internal error',
          error
        }))
      }
      return
    })
}
