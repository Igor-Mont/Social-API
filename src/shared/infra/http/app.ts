import 'dotenv/config'
import express, { json } from 'express'

const app = express()

app.use(json())

export { app }
