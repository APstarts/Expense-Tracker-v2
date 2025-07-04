import { createClient } from "@libsql/client";
import {TURSO_DATABASE_URL, TURSO_AUTH_TOKEN} from '../configs/envconfig.js';

export const db = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});