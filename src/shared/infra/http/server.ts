import { logger } from '../../utils/logger'
import { app } from './app'

const PORT = process.env.PORT as string

app.listen(PORT, () => logger.info(`Server is running on PORT ${PORT} 🔥`))
