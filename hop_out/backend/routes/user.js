import express from 'express';
import User from '../models/User';
import UserDao from "../data/UserDao.js";


const router = express.Router();


router.get('/', (req, res, next) => {
  Hello.find({}, 'text')
    .then((data) => res.json(data))
    .catch(next);
});

router.post('/register', async (req, res, next) => {
try {
    const { email, username, password } = req.body;
    const user = await User.exists({ email: email.toLowerCase() });

    if (user) {
      return res.json({
        msg: 'this email is already in use. please try a different one.',
        status: 409,
      });
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const savedUser = await User.create({
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
    return res.status(500).send('something went wrong. please try again.');
  }
});

router.get('/hellos/:id', (req, res, next) => {
  Hello.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;