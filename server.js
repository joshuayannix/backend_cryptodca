// importing
import express, { response } from 'express';
import cors from 'cors';
import axios from 'axios';
import fetch from 'node-fetch'
// app config
const app = express()
const port = process.env.PORT || 7000

// middleware
app.use(express.json());
app.use(cors());

// db config


/************ API Routes ***************/

// health check
app.get('/', (req, res) => res.status(200).send('🦄 Hello! Health check - crytpo backend server.js 🐸'));

// Test ping fetch
app.get('/ping', async (req, res) => {
  const fetchApi = await fetch("https://api.coingecko.com/api/v3/ping")
  const pingResponse = await fetchApi.json()
  console.log('pingResponse:', pingResponse)
  res.json(pingResponse)
});

// Coin list fetch
app.get('/coinlist', async (req, res) => {
  const fetchApi = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
  const listResponse = await fetchApi.json()
  console.log('listResponse: ', listResponse)
  res.json(listResponse)
})

// Get list of searches from mongo DB

// Post a new message to mongo DB


// listen. This runs when you run nodemon server.js
app.listen(port, () => console.log(`Crytpo backend server.js listening on localhost:${port}`));