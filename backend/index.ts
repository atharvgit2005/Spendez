import { createApp } from './app';
import { env } from './config/env';
import { AppLogger } from './config/logger';

const app = createApp();
const port = env.PORT || 5000;

app.listen(port, () => {
  AppLogger.info(`Server listening on port ${port}`);
});
