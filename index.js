const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ijqp9dc.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const userCollection = client.db('appifylab_social').collection('users');
        const postCollection = client.db('appifylab_social').collection('posts');
        const commentsCollection = client.db('appifylab_social').collection('comments');

        app.get('/users', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });


        // Adding new posts
        app.post('/createpost', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        });

        // Getting all post data
        app.get('/posts', async (req, res) => {
            const allPosts = await postCollection.find().toArray();
            res.send(allPosts);
        });

        // Deleting post based on ID
        app.delete('/posts/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: new ObjectId(_id) };
            const result = await postCollection.deleteOne(filter);
            res.send(result);
        })

        // Post Comments
        app.post('/postComment', async (req, res) => {
            const comment = req.body;
            const result = await commentsCollection.insertOne(comment);
            res.send(result);
        });

        // Getting all comment data
        app.get('/comments', async (req, res) => {
            const allComments = await commentsCollection.find().toArray();
            res.send(allComments);
        });

        // Getting comments based on post id
        app.get('/comment/:_id', async (req, res) => {
            const _id = req.params._id
            const query = { postId: _id }
            const comment = await commentsCollection.find(query).toArray()
            res.send(comment)
        });

        // Deleting comment based on ID
        app.delete('/comment/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: new ObjectId(_id) };
            const result = await commentsCollection.deleteOne(filter);
            res.send(result);
        })

        // Adding Like to a Post
        app.put('/post/like/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: new ObjectId(_id) };
            const updateDoc = {
                $set: { role: 'like' },
            };
            const result = await postCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // Removing Like from a Post
        app.put('/post/removeLike/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: new ObjectId(_id) };
            const updateDoc = {
                $set: { role: '' },
            };
            const result = await postCollection.updateOne(filter, updateDoc);
            res.send(result);
        })



        // Adding Like to a comment
        app.put('/comment/like/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: new ObjectId(_id) };
            const updateDoc = {
                $set: { role: 'like' },
            };
            const result = await commentsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // Removing Like from a comment
        app.put('/comment/removeLike/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: new ObjectId(_id) };
            const updateDoc = {
                $set: { role: '' },
            };
            const result = await commentsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

    }

    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Appifylab Social!')
})

app.listen(port, () => {
    console.log(`Appifylab Social Site listening on port ${port}`)
})


module.exports = app;