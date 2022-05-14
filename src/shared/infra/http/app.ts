import 'dotenv/config'
import swaggerUI from 'swagger-ui-express'
import swaggerFile from '../../../swagger.json'
import express, { json } from 'express'

const app = express()

app.use(json())

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile))

export { app }
