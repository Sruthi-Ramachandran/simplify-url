require('dotenv').config()
const nanoid = require('nanoid');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dns = require('dns');
const { MongoClient } = require('mongodb');
const databaseUrl = process.env.DATABASE;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))


MongoClient.connect(databaseUrl, { useNewUrlParser: true })
  .then(client => {
    app.locals.db = client.db('simplifyurl');
  })
  .catch(() => console.error('Failed to connect to the database'));

const shortenURL = (db, url) => {
  const shortenedURLs = db.collection('shorturls');
  return shortenedURLs.findOneAndUpdate({ original_url: url },
    {
      $setOnInsert: {
        original_url: url,
        short_id: nanoid(7),
      },
    },
    {
      returnOriginal: false,
      upsert: true,
    }
  );
};

const checkIfShortIdExists = (db, code) => db.collection('shorturls')
  .findOne({ short_id: code });

app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(htmlPath);
});

app.set('port', process.env.PORT || 4100);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

app.post('/new', (req, res) => {
  let originalUrl;
  try {
    originalUrl = new URL(req.body.url);
  } catch (err) {
    return res.status(400).send({ error: 'invalid URL' });
  }

  dns.lookup(originalUrl.hostname, (err) => {
    if (err) {
      return res.status(404).send({ error: 'Address not found' });
    };

    const { db } = req.app.locals;
    shortenURL(db, originalUrl.href)
      .then(result => {
        const doc = result.value;
        res.json({
          original_url: doc.original_url,
          short_id: doc.short_id,
        });
      })
      .catch(console.error);
  });
});

app.get('/:short_id', (req, res) => {
  const shortId = req.params.short_id;

  const { db } = req.app.locals;
  checkIfShortIdExists(db, shortId)
    .then(doc => {
      if (doc === null) return res.send('Uh oh. We could not find a link at that URL');

      res.redirect(doc.original_url)
    })
    .catch(console.error);
});

app.post("/search", function (req, res) {
  const { db } = req.app.locals;
  const search = req.body.query;
  const searcedURL = db.collection('shorturls').find({ original_url: { '$regex': search, '$options': 'i' } }).toArray(function (err, items) {
    res.send(pagelist(req, items));
  })
});

function pagelist(req, items) {
  const origin = req.headers.host;
  result = `<!DOCTYPE html>
  <html>
  <head>
  <link rel="stylesheet" href="css/table.css" type="text/css">
  <link rel="stylesheet" href="css/fontawesome/css/all.min.css"> 
  </head>
  <body>

  <h2 class="tm-site-header">SIMPLIFY URL List</h2>
  <div class="tbl-header">
  <table>
  <thead>
  <tr>
      <th>Original URL</th>
      <th>Short URL</th>
      <th style="width:100px"></th>
    </tr>
  </thead>
  <tbody class="tbl-content">
    `;
  items.forEach(function (item) {
    const longurl = item.original_url;
    const shorturl = 'http://' + origin + '/' + item.short_id
    itemstring = `<tr>
    <td>` + longurl + `</td>
    <td><a href=` + shorturl + `>` + shorturl + `</a></td>
    <td>
    
    <form action="/delete" method="post">
    <input type="hidden" size="80" name="query" value="` + longurl + `">
    <input type="submit" class="home-button" value="Delete">
    </form>
    </td>
    </tr>`;
    result = result + itemstring;
  });
  result = result +
    `</table>
  </div>
  <div class="delete-section"></div>
  <div class="col-2 home-button"><a href='/' >Home</a></div>
  </body>
  </html>`;
  return result;
}



app.post("/delete", function (req, res) {
  const { db } = req.app.locals;
  const searcedURL = db.collection('shorturls').remove({ original_url: req.body.query });
  res.send(pagedelete(req));
});

function pagedelete(req) {
  const origin = req.headers.host;
  result = `<!DOCTYPE html>
  <html>
  <head>
  <link rel="stylesheet" href="css/table.css" type="text/css">
  </head>
  <body>
  <div class="delete-url">
  <h3 class="tm-site-header">Deleted ` + req.body.query + ` from collection!</h3>
  </div>
  <form action="/search" method="post" >
    <input type="hidden" name="query">
    <button type="submit" class="home-button" value="view">Back</button>
  </form>
  </body>
  </html>`;
  return result;
}