import express from 'express'
import dotenv from 'dotenv'

import createRouter from './routes'
import chalk from 'chalk'

import { exposeServices } from '@utils'

dotenv.config({ path: '../.env' })

const app = express()
const port = process.env.PORT || 3000

const router = createRouter()

app.use('/api', exposeServices, router)

/* istanbul ignore next */
app.listen(port, () => {
  console.info(
    chalk.blueBright(`Example app listening at http://localhost:${port}`),
  )
})
