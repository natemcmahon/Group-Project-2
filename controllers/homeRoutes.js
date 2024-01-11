const router = require('express').Router();
const { Photo, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    // res.send("hello my friend");
  try {
    // Get all image posts and JOIN with user data
    const postData = await Photo.findAll({
      limit: 10,
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [
        ['id', 'DESC']
      ]
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // render the homepage, pass posts and a logged in parameter containing the value "logged_in" 
    // as part of the request.session
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to profile page
router.get('/profile', withAuth, async (req, res) => {
    try {
        console.log("hi friend");
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Photo }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('profile', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to the user's profile page
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('login');
  });

  router.get('/aboutus', (req, res) => {
    res.render('aboutus');
  });

  router.get('/contact', (req, res) => {
    res.render('contact');
  });

router.get('/:id', async (req, res) => {
    try {
      const postData = await Photo.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['username'],
          },
        ],
      });
  
      const post = postData.get({ plain: true });

      let isOwner;

      if (post.user_id === req.session.user_id) {
        isOwner = true;
      }
      
      res.render('post', {
        ...post,
        isOwner
      })
  
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  module.exports = router;
  