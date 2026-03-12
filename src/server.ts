import 'dotenv/config';
import app from './app.js';

if (!process.env.JWT_PRIVATE_KEY) {
  console.error('FATAL ERROR: JWT_PRIVATE_KEY is not defined.');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default server;
