import type { Config } from '@jest/types'
import { exec } from 'node:child_process'
import dotenv from 'dotenv'
import NodeEnvironment from 'jest-environment-node'
import { Client } from 'pg'
import util from 'node:util'
import crypto from 'node:crypto'

dotenv.config({ path: '.env.testing' })

const execSync = util.promisify(exec)

const prismaBinary = './node_modules/.bin/prisma'

export default class PrismaTestEnvironment extends NodeEnvironment {
  private readonly schema: string
  private readonly connectionString: string

  constructor (config: Config.ProjectConfig) {
    super(config)

    const dbUser = process.env.DATABASE_USER as string
    const dbPass = process.env.DATABASE_PASS as string
    const dbHost = process.env.DATABASE_HOST as string
    const dbPort = process.env.DATABASE_PORT as string
    const dbName = process.env.DATABASE_NAME as string

    this.schema = `test_${crypto.randomUUID()}`
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`
  }

  async setup (): Promise<void> {
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    await execSync(`${prismaBinary} migrate deploy`)

    return await super.setup()
  }

  async teardown (): Promise<void> {
    const client = new Client({
      connectionString: this.connectionString
    })

    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()
  }
}
