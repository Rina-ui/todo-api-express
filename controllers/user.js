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
    User.findOne({
        username: req.body.username
    })
    .then(user => {
        if (user === null) {
            return res.status(401).json({error: 'User not found'});
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid){
                    return res.status(401).json({error: 'Incorrect password'});
                }else{
                    return res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {
                                userId: user._id
                            },
                            'RANDOM_TOKEN_SECRET',
                            {
                                expiresIn: '24h'
                            }

                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json({error})
            });
        }
    })
    .catch(error => {
        res.status(500).json({error})
    });
}