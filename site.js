const express = require('express');
const router = express.Router();

// ------------mongo config-------------
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const databaseName = 'coffeeland';
const collectionName = 'sklep';

const navbarItems = [
    { content: ' Home ', href: '/' },
    { content: ' About ', href: '/about'},
    { content: ' Service ', href: '/service' },
    { content: ' Pricing ', href: '/pricing' },
    { content: ' Shop ', href: '/shop' },
    { content: ' Contact ', href: '/contact' },
  ];

router.get('/', (req, res) => {
    res.render('index', { 
      mainTitle: '', 
      documentTitle: 'Index document',
      navbarItems: navbarItems,
      selectedNavBar: 'Index'
    });
  });

router.get('/about', (req, res) => {
    res.render('about', { 
      mainTitle: '', 
      documentTitle: 'About document',
      navbarItems: navbarItems,
      selectedNavBar: 'About'
    });
});

router.get('/service', (req, res) => {
    res.render('service', { 
        mainTitle: '', 
        documentTitle: 'Service document',
        navbarItems: navbarItems,
        selectedNavBar: 'Service'
    });
});
  
router.get('/pricing', (req, res) => {
    res.render('pricing', { 
        mainTitle: '', 
        documentTitle: 'Pricing document',
        navbarItems: navbarItems,
        selectedNavBar: 'Pricing'
    });
});
  
router.get('/contact', (req, res) => {
    res.render('contact', { 
        mainTitle: '', 
        documentTitle: 'Contact document',
        navbarItems: navbarItems,
        selectedNavBar: 'Contact'
    });
});
  
router.get('/shop', (req, res) => {
    MongoClient.connect(url, (error, client) => {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        collection.find({}).toArray((findError, products) => {
        // found the products, so now what?
        res.render('shop', { 
            mainTitle: 'Shop', 
            navbarItems: navbarItems,
            selectedNavBar: 'Shop',
            products: products
        });
        });
    });
});


module.exports = router;