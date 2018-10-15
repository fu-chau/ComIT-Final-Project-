const express = require('express');
const router = express.Router();
const path = require('path');

//-----------multer config------------
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, 'public/img/sklep');
    },
    filename: function(req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ------------mongo config-------------
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const databaseName = 'coffeeland';
const collectionName = 'sklep';
const ObjectID = require('mongodb').ObjectID;

router.get('/', (request, response) => {
    MongoClient.connect(url, (error, client) => {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        collection.find({}).toArray((findError, products) => {
            response.render('admin/index', { products: products});
        });
    });
});

router.get('/sklep/create', (request, response) => {
    response.render('admin/create');
})

router.post('/sklep/create', upload.single('image'), (request, response) => {
    const product = {
        title: request.body.title, 
        description: request.body.description,
        img: request.file ? request.file.filename : '', 
        price: request.body.price,
        alt: request.body.alt
    };

    MongoClient.connect(url, (connectError, client) => {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        collection.insertOne(product, (insertError, result) => {
            response.redirect('/shop'); 
        });
    });
});
//---------------------edit------------------------------
router.get('/sklep/edit/:id', (request, response) => {
    const productID = ObjectID(request.params.id);

    MongoClient.connect(url, (error, client) => {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);
    
        
        collection.find({ _id: productID}).toArray((findError, docs) => {

          const product = docs[0];
    
          response.render('admin/edit', { product: product })
        });
    });
});

router.post('/sklep/edit/:id', upload.single('image'), (request, response) => {
    const productId = request.params.id;
    MongoClient.connect(url, (error, client) => {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);
        
        const updateObject = {};
    
        if (request.body.title) {
          updateObject.title = request.body.title;
        }
        
        if (request.body.price) {

          updateObject.price = request.body.price;
        }
        
        if (request.file) {
          
          updateObject.img = request.file.filename;
        }

        if (request.body.alt) {
            updateObject.alt = request.body.alt;
          }
    
        
        collection.updateOne({'_id': ObjectID(productId)}, { $set: updateObject}, (updateErr, result) => {
          
          response.redirect('/admin/');
        });
    });    
});

//---------------------delete------------------------------
router.get('/sklep/delete/:id', (request, response) => {
    const productId = request.params.id;

    MongoClient.connect(url, (error, client) => {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        collection.deleteOne({ '_id': ObjectID(productId)}, (deleteError, result) => {
            response.redirect('/admin/');
        });
    });
});

module.exports = router;
