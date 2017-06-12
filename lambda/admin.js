'use strict'

const Reply = require('../lib/reply.js')

// Admin
// --------------------------------------------------------
module.exports.handler = (event, context, callback) => {
  console.log('Admin.')
  const response = callback(null, Reply.success({
    admin: true,
    cognitoPoolId: JSON.stringify(process.env.COGNITO_POOL_ID)
  }))

  callback(null, response)
}
