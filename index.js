const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the redirect schema
const redirectSchema = new mongoose.Schema({
  incomingUrl: String,
  outgoingUrl: String,
});

// Create the redirect model
const Redirect = mongoose.model('Redirect', redirectSchema);

// Homepage route
app.get('/', async (req, res) => {
  try {
    const redirects = await Redirect.find();
    res.render('index', { redirects });
  } catch (error) {
    console.error('Error fetching redirects:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Link generation page route
app.get('/generate', (req, res) => {
  res.render('generate');
});

// API endpoint to generate an incoming link
app.post('/generate', async (req, res) => {
  try {
    const { outgoingUrl } = req.body;
    const incomingUrl = `http://localhost:3000/r/${Date.now()}`;
    const redirect = new Redirect({ incomingUrl, outgoingUrl });
    await redirect.save();
    res.render('generate', { incomingUrl });
  } catch (error) {
    console.error('Error generating redirect:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Redirect route
app.get('/r/:id', async (req, res) => {
  try {
    const redirect = await Redirect.findOne({ incomingUrl: `http://localhost:3000/r/${req.params.id}` });
    if (redirect) {
      res.redirect(redirect.outgoingUrl);
    } else {
      res.status(404).send('Redirect not found');
    }
  } catch (error) {
    console.error('Error fetching redirect:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint to create a new redirect
app.post('/redirects', async (req, res) => {
  try {
    const { incomingUrl, outgoingUrl } = req.body;
    const redirect = new Redirect({ incomingUrl, outgoingUrl });
    await redirect.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error creating redirect:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint to retrieve all redirects
app.get('/redirects', async (req, res) => {
  try {
    const redirects = await Redirect.find();
    res.json(redirects);
  } catch (error) {
    console.error('Error fetching redirects:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Export route
app.get('/export', async (req, res) => {
  try {
    const redirects = await Redirect.find();
    const csvContent = 'Incoming URL,Outgoing URL\n' + redirects.map(redirect => `${redirect.incomingUrl},${redirect.outgoingUrl}`).join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('redirects.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting redirects:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Import route
app.post('/import', upload.single('csvFile'), async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Delete existing redirects
        await Redirect.deleteMany({});

        // Create new redirects from the imported data
        const redirects = results.map((result) => ({
          incomingUrl: result['Incoming URL'],
          outgoingUrl: result['Outgoing URL'],
        }));
        await Redirect.insertMany(redirects);

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        res.redirect('/');
      });
  } catch (error) {
    console.error('Error importing redirects:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

