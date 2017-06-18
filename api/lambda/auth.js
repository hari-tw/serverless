'use strict'

const Reply = require('../lib/reply.js')

// Auth
// --------------------------------------------------------
module.exports.handler = (event, context, callback) => {
  console.log('Admin.')
  const response = callback(null, Reply.success({
    handler: 'auth',
    cognitoPoolId: process.env.COGNITO_IDENTITY_POOL_ID
  }))

  callback(null, response)
}
