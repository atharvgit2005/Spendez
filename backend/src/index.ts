import { createApp } from './app';
import { env } from './config/env';
import { AppLogger } from './config/logger';

const app = createApp();
const port = env.PORT || 5005;

app.listen(Number(port), '0.0.0.0', () => {
  AppLogger.info(`Server listening on port ${port} (Network Accessible)`);
});
