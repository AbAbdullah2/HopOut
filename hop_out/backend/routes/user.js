import express from 'express';
import User from '../models/User';
import UserDao from '../data/UserDao.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const user = await UserDao.exists({ email: email.toLowerCase() });

    if (user) {
      return res.json({
        msg: 'This email is already in use. Please try a different one.',
        status: 409,
      });
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const savedUser = await UserDao.create({
        email: email.toLowerCase(),
        name,
        password: encryptedPassword,
      });

      return res.json({
        userDetails: {
          email: savedUser.email,
          username: savedUser.username,
          id: savedUser._id,
        },
        status: 200,
      });
    }
  } catch (err) {
    return res.status(500).send('Something went wrong. Please try again.');
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({
        msg: 'Invalid credentials. Please try again.',
        status: 409,
      });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        userDetails: {
          email: user.email,
          name: user.name,
          id: user._id,
        },
        status: 200,
      });
    }
    return res.json({
      msg: 'Invalid credentials. Please try again.',
      status: 400,
    });
  } catch (err) {
    return res.status(500).send('Something went wrong. Please try again.');
  }
});

module.exports = router;
