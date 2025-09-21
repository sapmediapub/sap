import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { spotifyRouter } from './routes/spotify.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// FIX: Resolved a TypeScript overload error by splitting the middleware into separate app.use() calls.
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Sap Media Publishing API is running!');
});

app.use('/api/integrations/spotify', spotifyRouter);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});