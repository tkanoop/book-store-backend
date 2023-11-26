const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const signUpValidate = (data) => {
    const complexityOptions = {
        min: 8,  // Minimum password length
        max: 30, // Maximum password length
        lowerCase: 1, // Require at least 1 lowercase letter
        upperCase: 1, // Require at least 1 uppercase letter
        numeric: 1,   // Require at least 1 digit
        symbol: 1,    // Require at least 1 special character
        requirementCount: 4, // Total number of requirements to satisfy
    };

    const schema = Joi.object({
        firstName: Joi.string().label("First name"),
        lastName: Joi.string().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity(complexityOptions).required().label("Password"),
    });

    return schema.signUpValidate(data);
};

module.exports = { signUpValidate };
