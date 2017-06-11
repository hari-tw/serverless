function reply (httpCode, body, headers) {
  headers = headers || {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    // 'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
  }

  return {
    statusCode: httpCode || 200,
    headers: headers,
    body: JSON.stringify(body)
  }
}

// 200
reply.success = (body, headers) => {
  return reply(200, body, headers)
}
// reply.created = (body, headers) => {
//   return reply(200, body, headers)
// }
// reply.updated = (body, headers) => {
//   return reply(200, body, headers)
// }
// reply.deleted = (body, headers) => {
//   return reply(200, body, headers)
// }

// 400
reply.badRequest = (body, headers) => {
  return reply(400, body, headers)
}
reply.unauthorized = (body, headers) => {
  return reply(401, body, headers)
}
reply.notFound = (body, headers) => {
  return reply(404, body, headers)
}

// 500
reply.badImplementation = (body, headers) => {
  return reply(500, body, headers)
}

module.exports = reply
