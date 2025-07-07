import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
    console.log("Register endpoint hit");
    console.log('Body received:', req.body);

    try{
        const existingUser = await User.findOne({username: req.body.username});
        if ( existingUser) {
            return res.status(400).json({error: 'Username already exists'});
        }

        //hash password
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashPassword
        });

        await user.save();
        res.status(201).json({message: 'User created successfully'});
    }catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      'RANDOM_TOKEN_SECRET',
      { expiresIn: '24h' }       // veille bien à cette orthographe
    );

    // Envoi de la réponse avec token
    return res.status(200).json({
      userId: user._id,
      token: token
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
