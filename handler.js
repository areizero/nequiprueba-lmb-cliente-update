'use strict'

const AWS = require('aws-sdk')
const docDynamo = new AWS.DynamoDB.DocumentClient()

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS'
}

/**
 * Servicio que actualiza un cliente
 */
module.exports.update = async (event, context) => {
  try {
    let clienteRq = JSON.parse(event.body)
    let params = {
      TableName: 'nequi-cliente',
      Key: { id: `${clienteRq.idTipo}-${clienteRq.idNumero}`},
      UpdateExpression: 'set #n = :nombre, #a = :apellido, #c = :ciudadNacimiento, #e = :edad',
      ExpressionAttributeNames: { '#n': 'nombre',  '#a': 'apellido', '#c': 'ciudadNacimiento', "#e": 'edad'},
      ExpressionAttributeValues: {
        ':edad': clienteRq.edad,
        ':nombre': clienteRq.nombre,
        ':apellido': clienteRq.apellido,
        ':ciudadNacimiento': clienteRq.ciudadNacimiento
      }
    }
    await update(params)
    return sendResponse(200,  { message: "Actualizado Correctamente" }, headers)
  }
  catch (e) {
    console.error(e)
    return sendResponse(500, { message: `Internal server error: ${e}` }, headers)
  }
}

const update = (params) => {
  return docDynamo.update(params).promise()
}

// metodos de respuesta
const sendResponse = (statusCode, body, headers = '') => {
  const response = {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(body)
  }
  return response
}
