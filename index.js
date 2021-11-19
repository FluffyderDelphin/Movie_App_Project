const express = require('express'),
  morgan = require('morgan');

let top10movies = [
  {
    place: 1,
    title: 'Title1',
    description: 'Lorem Ipsum dolor',
  },
  {
    place: 2,
    title: 'Title2',
    description: 'Lorem Ipsum dolor',
  },
  {
    place: 3,
    title: 'Title3',
    description: 'Lorem Ipsum dolor',
  },
];

const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('This is just a Test.');
});

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(top10movies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
});
app.listen(8080, () => {
  console.log('App ist Running on Port 8080');
});
