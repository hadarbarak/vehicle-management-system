// backend/src/index.ts - starts the server
import { app } from "./app.js";

const PORT = 4000;

// do not run listen when tests import this fileif (process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
