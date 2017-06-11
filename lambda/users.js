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
