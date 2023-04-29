const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");


module.exports = {
    register: asyncHandler(async (req, res) => {
        const { firstName, lastName, email, password, picture } = req.body;

        console.log(req.body);
                    
        if (!firstName || !lastName || !email || !password) {
            res.status(400);
            throw new Error("Please enter all the fields");
        } else {
            try {
                const potentialUser = await User.findOne({ email });

                if (potentialUser) {
                    res.status(400);
                    throw new Error("User already exists");
                } else {
                    const newUser = await User.create({
                        firstName,
                        lastName,
                        email,
                        password,
                        picture,
                    });

                    const userToken = jwt.sign(
                        { _id: newUser._id, email: newUser.email },
                        secret,
                        { expiresIn: "1d" }
                    );

                    res
                        .cookie("usertoken", userToken, {
                            httpOnly: true,
                        })
                        .json({
                            _id: newUser._id,
                            firstName: newUser.firstName,
                            lastName: newUser.lastName,
                            email: newUser.email,
                            picture: newUser.picture,
                            token: userToken,
                        });
                }
            } catch (err) {
                res.status(400).json(err);
            }
        }
    }),

    login: asyncHandler(async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (user && (await user.matchPassword(password))) {
                const userToken = jwt.sign(
                    { _id: user._id, email: user.email },
                    secret,
                    { expiresIn: "1d" }
                );
                const decodedToken = jwt.verify(userToken, secret);
                res
                    .cookie("usertoken", userToken, {
                        httpOnly: true,
                    })
                    .json({
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        picture: user.picture,
                        token: userToken,
                    });
                    console.log("logged Cookie:", decodedToken)
            } else {
                res.status(401);
                throw new Error("Invalid Credentials");
            }
        } catch (err) {
            res.status(400).json(err);
        }
    }),

    logout: async (req, res) => {
        try {
            res.clearCookie("usertoken").json({ message: "success" });
        } catch (err) {
            res.status(400).json(err);
        }
    },

    findAllUsers: asyncHandler(async (req, res) => {
        const keyword = req.query.search
        ? {
            $or: [
                { firstName: { $regex: req.query.search, $options: "i" } },
                { lastName: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ],
            }
        : {};
    
        const users = await User.find(keyword).find({ _id: { $ne: req.user?._id ?? null } });
        res.send(users);
    })
};
