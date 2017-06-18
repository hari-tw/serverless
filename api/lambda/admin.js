'use strict'

const Reply = require('../lib/reply.js')

// Admin
// --------------------------------------------------------
module.exports.handler = (event, context, callback) => {
  console.log('Admin.')

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  callback(null, Reply.success({
    admin: true,
    cognitoIdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID
  }))
}
