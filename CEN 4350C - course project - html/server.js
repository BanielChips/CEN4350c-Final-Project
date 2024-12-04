const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'html files')));
app.use(express.json());

// Including workbench credentials from a js file ignored by git
const { username, password } = require('./credentials');

const connection = mysql.createConnection({
    host: 'localhost',
    user: username,
    password: password,
    database: 'cen4350C_project_db'
});

connection.connect((err) => {
    if (err) {
        console.error(`Error connecting to database`, err);
        return;
    }
    console.log('Connected to cen4350C_project_db');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'index.html'));
});

app.get('/Shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'Shop.html'));
});

app.get('/Your-Style', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'Your-Style.html'));
});

app.get('/About-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'About-Us.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'Cart.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'contact.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'faq.html'));
});

app.get('/jobs', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'jobs.html'));
});

app.get('/combAlt', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'combAlt.html'));
});

app.get('/gelAlt', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'gelAlt.html'));
});

app.get('/login-success', (req, res) => {
  res.sendFile(path.join(__dirname, 'html files', 'loginSuccess.html'));
});

app.get('/get-data', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({error: 'Database error'});
            return;
        }
        res.json(results);
    });
});

app.post('/subscribe', (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = 'INSERT INTO newsletter (email) VALUES (?)';
  connection.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Email succesfully subscribed!' });
  });
});

app.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return  res.status(400).json({ error: '(first, last, email, password) are required' });
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error finding email', err);
      return res.status(500).json({error: 'Database error'});
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPass) => {
      if(err) {
        console.error('Error jumbling password');
        return res.status(500).json({error: 'Password compare error'});
      }

      const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
      connection.query(query, [firstName, lastName, email, hashedPass], (err, results) => {
        if(err) {
          console.error('Error submitting to database');
          return res.status(500).json({error: 'Database error'});
        }

        res.status(200).json({ message: 'User Registered'});
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({error: 'Username and password required'});
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('A user with the given email has not been found');
      return res.status(500).json({error: 'Verification error'});
    }

    if (results.length === 0) {
      return  res.status(400).json({error: 'User email not found'});
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, passMatch) => {
      if (err) {
        console.error('Error with encryption compare', err);
        return res.status(500).json({error: 'Server error'});
      }

      if (!passMatch) {
        return res.status(400).json({error: 'Password not valid'});
      }

      res.status(200).json({ success: true, message: 'Login successful' });
    })
  });
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


