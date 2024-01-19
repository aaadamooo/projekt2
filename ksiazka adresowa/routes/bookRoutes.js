const express = require ('express');
const Person = require('../models/personRecord');    //..
const validator = require('validator');

const router = express.Router();



  
// Find person
router.get('/find', async (req, res) => {
    const { Name, Surname, PhoneNumber } = req.query;

    const query = {};

    if (Name) {
        query.Name = Name;
    }
    if (Surname) {
        query.Surname = Surname;
    }
    if (PhoneNumber) {
        query.PhoneNumber = PhoneNumber;
    }
    try {
        const foundPersons = await Person.findPersons(query);
        res.render('find', { title: 'Found', persons: foundPersons });
    } catch (error) {
        console.error('Error finding persons:', error);
        res.status(500).send('Internal Server Error');
    }
});


/// Add person
router.get('/book', (req, res) => {
    Person.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('index', { title: 'List', persons: result });
      })
      .catch(err => {
        console.log(err);
      });
  });
  router.post('/book', (req, res) => {
  
    const person = new Person({
        Name: validator.escape(req.body.Name || ''),
        Surname: validator.escape(req.body.Surname || ''),
        PhoneNumber: validator.escape(req.body.PhoneNumber || '')
    });

    // Input validation
    if (!person.PhoneNumber || !validator.isNumeric(person.PhoneNumber) || person.PhoneNumber.length !== 9) {
        return res.redirect('/book');
    }

    person.save()
        .then((result) => {
            res.redirect('/book');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});


/// delete person
router.get('/remove', async (req, res) => {

        res.render('remove', { title: 'Remove Person'});

});

router.post('/book/remove', async (req, res) => {
    const { Name, Surname, PhoneNumber } = req.body;

    try {
        // Check if required fields are present
        if (!Name || !Surname || !PhoneNumber) {
            res.redirect('/book');
        }

        // Attempt to find the person by provided details and delete
        const deletedPerson = await Person.findOneAndDelete({ Name, Surname, PhoneNumber });
        res.redirect('/book');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});




//
  router.get('/book/create', (req, res) => {
    res.render('create', { title: 'Add' });
  });


  router.get('/', (req, res) => {
    res.redirect('/book');
  });

  module.exports = router;