const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();





// Middleware.
app.use(cors())
app.use(express.json())



// const data = require('./data.json');





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}.9zcs4sa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




// async ans await
const run = async () => {


    // save zone


    // data insertion

    try {

        // Data base collection list
        const CategoriesNameCollection = client.db('PhoneCategory').collection('categories');
        const allPhoneCollection = client.db('phoneDB').collection('phones');
        const userListCollection = client.db('usersDB').collection('users');
        const orderCollection = client.db('orderDB').collection('order');
        const wishListCollection = client.db('wishListDB').collection('wishList');








        // !Category item POST by seller
        app.post('/category-item', async (req, res) => {
            const item = req.body;
            const result = await allPhoneCollection.insertOne(item);
            res.send(result);

        })





        // !Getting categories for client side
        app.get('/categories', async (req, res) => {
            const result = await CategoriesNameCollection.find({}).toArray();
            res.send(result);

        })






        // !Getting specific Data for Client Side
        app.get('/category/:name', async (req, res) => {
            const name = req.params.name;
            const query = { category: name }
            const category = await allPhoneCollection.find(query).toArray();
            res.send(category);

        })






        // !Post //(storing user)
        app.post('/user', async (req, res) => {
            const user = req.body;

            const result = await userListCollection.find({ email: user.email }).project({ email: 1, _id: 0 }).toArray();

            if (user?.email === result[0]?.email) {
                res.send({ data: "same user!" })

            }
            else {

                const result = await userListCollection.insertOne(user);
                res.send(result);
            }

        })


        //* !Getting users now
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await userListCollection.find(query).toArray();
            res.send(result);
        })

        // *Delete Products.
        app.delete('/product/delete/:id', async (req, res) => {
            const id = req.params.id
            query = { _id: ObjectId(id) }
            const result = await allPhoneCollection.deleteOne(query);
            res.send(result);
        })


        // *Update Products. sold  / available.
        app.put('/product/update/:item/:id', async (req, res) => {

            const item = req.params.item;
            const id = req.params.id;

            filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const data = { $set: { product: item } }

            const update = await allPhoneCollection.updateOne(filter, data, option);
            res.send(update);


        })


        // TODO FIX getting specific products
        // *getting specific product
        app.get('/product/buy/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await allPhoneCollection.find(query).toArray();
            res.send(result);
        })





        // *Advertising products.
        app.put('/product/advertise/:id', async (req, res) => {


            const id = req.params.id;

            filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const data = { $set: { advertise: true } }

            const update = await allPhoneCollection.updateOne(filter, data, option);
            res.send(update);


        })



        // *Advertised products list
        //* !Getting users now
        app.get('/product/advertise', async (req, res) => {
            const query = { advertise: true, product: 'available' }
            const result = await allPhoneCollection.find(query).toArray();
            res.send(result);
        })



        // ! Getting all buyers
        app.get('/buyers', async (req, res) => {
            const query = { role: 'user' };
            const buyers = await userListCollection.find(query).toArray();
            res.send(buyers)

        })



        // ! Getting all Sellers
        app.get('/sellers', async (req, res) => {
            const query = {role: 'seller'};
            const sellers = await userListCollection.find(query).toArray();
            res.send(sellers)

        })





        // ! Getting all products of seller.
        app.get('/all-products/:email', async (req, res) => {
            const email = req.params.email;
            const query = { seller_mail: email }
            const result = await allPhoneCollection.find(query).toArray();
            res.send(result);
        })




        // !Delete Sellers
        app.delete('/sellers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userListCollection.deleteOne(query);
            res.send(result);
        })




        // !Delete Sellers verify
        app.put('/sellers/verify/:id/:email', async (req, res) => {
            const id = req.params.id;
            const email = req.params.email;
            const sellerFilter = { seller_mail: email };
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const data = { $set: { verified: true } }

            const updateProducts = await allPhoneCollection.updateMany(sellerFilter, data, option);
            const result = await userListCollection.updateOne(filter, data, option);
            res.send(result);
        })



        // !Delete Buyers
        app.delete('/buyers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userListCollection.deleteOne(query);
            res.send(result);
        })


        // ! My Order store
        app.put('/order/:item', async (req, res) => {
            const item = req.params.item;
            filter = {item_name: item}
            option = { upsert: true }
            const order = req.body;
            data = { $set:  order  }
            const result = await orderCollection.updateOne(filter,data, option)
            res.send(result);

        })





        // ! Getting all my order list
        app.get('/order/:email', async (req, res) => {
            const email = req.params.email;
            const query = {userEmail: email};
            const orders = await orderCollection.find(query).toArray();
            res.send(orders)

        })




        // ! My Wish List store
        app.put('/wish-list/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            filter = { _id: id }
            option = { upsert: true }
            const wishList = req.body;
            data = { $set:  wishList  }
            const result = await wishListCollection.updateOne(filter, data, option)
            res.send(result);
     
        })







        // ! Getting all my wish List
        app.get('/wish-list/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const wishList = await wishListCollection.find(query).toArray();
            res.send(wishList);

        })



        // !Search query/ Searching value from database.
        app.get('/search/' , async(req,res)=> {
            const search = await req.query.search.toLowerCase();

            const query = {$text: {$search: search}}
            const result = await allPhoneCollection.find(query).toArray();

            res.send(result);
        })






    }


    finally {
        console.log('finally code END!')
    }



}




run().catch(err => console.log(err));








app.listen(port, () => {
    console.log('listening port', port);
})