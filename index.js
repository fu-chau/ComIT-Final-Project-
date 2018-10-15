const express = require('express');
const app = express();
const port = 3000;
const siteRouter = require('./site');
const adminRouter = require('./admin');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use('/', siteRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});