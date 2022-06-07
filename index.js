const express = require('express');
const app = express();
var cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { send } = require('express/lib/response');





app.use(cors());
app.use(express.json());



/*
user: Data
pass: dEdNOhFQe3ctjIp7
*/


const uri = "mongodb+srv://bdUser2:zwRfBnzbyKODGRXS@cluster0.xtrih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const booksCollection = client.db('User').collection('books');
    app.get('/books', async(req, res) =>{
      const query = {};
    const cursor = booksCollection.find(query);
    const books = await cursor.toArray();
    res.send(books);
    });
    /*/books/:id*/
    app.get('/books/:id', async(req, res) => {
      const id = req.params.id;
      const query ={_id: ObjectId(id)};
      const book = await booksCollection.findOne(query);
      res.send(book);
    });
    //set Deleting data
    app.delete('/books/:id', async(req, res) =>{
      const id = (req.params.id);
      const query = {_id: ObjectId(id)};
      const result = await booksCollection.deleteOne(query);
      res.send(result);
    });
    //set Update data
    app.get('/books/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await booksCollection.findOne(query);
      res.send(result);
    });
    app.put('/books/:id', async(req, res) =>{
      const id = req.params.id;
      const updateBook = req.body;
      const query = {_id: ObjectId(id)};
      const options= { upsert: true};
      const updatedDoc ={
        $set: {
          price: updateBook.price,
          inStock: updateBook.available
        }
      };
      const result = await booksCollection.updateOne(query, updatedDoc, options);
      res.send(result);
      
    })

    
    app.post('/books', async(req, res) =>{
      console.log("Request", req.body);
      const newBook = req.body;
      
      
     /* book.id = books.length+1;
    
      books.push(book);*/
      const result = await booksCollection.insertOne(newBook);
      res.send(result);
    });
    
    }
  finally{

  }

}

run().catch(console.dir);
//add items



app.get('/', (req, res) => {
  res.send('CRUD Runnig ');
});

app.listen(port, () => {
  console.log("Listening to port", port);
});



