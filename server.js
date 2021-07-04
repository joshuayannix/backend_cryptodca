// importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';
import axios from 'axios';
import fetch from 'node-fetch'

/************ App Config **************/
const app = express()
const port = process.env.PORT || 7000

const pusher = new Pusher({
  appId: "1228904",
  key: "72ef0f1bbd0d6ba3d49d",
  secret: "6a61eefb49e452483f69",
  cluster: "us2",
  useTLS: true
});

/************ Middleware **************/
app.use(express.json());
app.use(cors());


/********************* MongoDB Configuration *********************/ 

// const connection_url = 'mongodb+srv://admin:kIMGJb1jrp2fpuK4@cluster0.zlmjl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const connection_url = 'mongodb+srv://admin:EdrjPmRMxoLM9r0F@cluster0.tgafw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;

db.once('open', () => {
  console.log('DB connected - mern crypto server.js')

  const msgCollection = db.collection('messagecontents');
  const changeStream = msgCollection.watch();

  changeStream.on('change', (change) => {
    console.log('A change occurred', change);

    if(change.operationType === 'insert') {
      const messageDetails = change.fullDocument;
      pusher.trigger('messages', 'inserted', {
        amount: messageDetails.amount,
        cointype: messageDetails.cointype,
        freq: messageDetails.freq,
        start: messageDetails.start,
        end: messageDetails.end,
        searchquery: messageDetails.searchquery,        
        timestamp: messageDetails.timestamp,
        coinimageurl: messageDetails.coinimageurl,
        user: messageDetails.user,
      })
    } else if(change.operationType === 'delete') {
      // pusher.trigger('messages', 'deleted')
      console.log('message being deleted')
    } else {
      console.log('Error triggering Pusher')
    }
  });

})

/************ API Routes ***************/

// health check
app.get('/', (req, res) => res.status(200).send('🦄 Hello! Health check - crytpo backend server.js 🐸'));



// Get list of searches from mongo DB
app.get('/messages/sync', (req, res) => {
  Messages.find((err, data) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

// Post a new message to mongo DB
app.post('/messages/new', (req, res) => {
  console.log('sending new message from crypto server.js')
  
  const dbMessage = req.body;
  Messages.create(dbMessage, (err, data) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.status(201).send(data)
    }
  })
})


// Delete a message from mongo DB
app.delete('/messages/delete/:id', (req, res) => {
  const id = req.params.id;
  Messages.findByIdAndRemove(id).exec()
  res.send('item deleted')
})


// app.delete('/messages/delete/:id', async (req, res) => {
//   console.log('deleting messages from crypto server.js')
  
//   const id = req.params.id;
//   Messages.findByIdAndRemove(id, (err, data) => {
//     if(err) {
//       res.status(500).send(err)
//     } else {
//       res.status(201).send(data)
//     }
//   })
// })


// listen. This runs when you run nodemon server.js
app.listen(port, () => console.log(`Crytpo backend server.js listening on localhost:${port}`));

// Ping API Fetch
app.get('/ping', async (req, res) => {
  const fetchApi = await fetch("https://api.coingecko.com/api/v3/ping")
  const pingResponse = await fetchApi.json()
  console.log('pingResponse:', pingResponse)

  // This last line means we are giving a response
  res.json(pingResponse)
});


// test ping axios - same result as fetch
app.get('/pingaxios', async (req, res) => {
  const axiosResponse = await axios.get("https://api.coingecko.com/api/v3/ping")
    .then((response) => {
      console.log('axios response.data: ', response.data)
      return response.data
    })
    .catch((err) => {
      console.log('axios error: ', err)
    })

  // Provide a response back to the client
  console.log('axiosResponse: ', axiosResponse)
  res.json(axiosResponse)
});

// Coin list fetch
app.get('/coinlist', async (req, res) => {
  const fetchApi = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
  const listResponse = await fetchApi.json()
  console.log('first coin in listResponse: ', listResponse[0])
  res.json(listResponse)
})