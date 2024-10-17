"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const createUser = (req, res, next) => {
    const { userName, email, password, confirmPassword, age } = req.body;
    console.log(req.name);
    // validate user inputs
    // perform database operations to create a new user
    // return success or failure response
    console.log(userName, email, typeof password, typeof confirmPassword, age);
    res.status(201).json({ success: true, message: "User created successfully" });
};
exports.createUser = createUser;
