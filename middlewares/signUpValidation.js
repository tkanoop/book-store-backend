


const Joi=require('joi')
const passwordComplexity=require('joi-password-complexity')


const validateSignUp = (data) => {
    const schema = Joi.object({
      firstName: Joi.string().required().label("First name"),
      lastName: Joi.string().required().label("Last Name"),
      email: Joi.string().email().required().label("Email"),
      password:Joi.string().required().label("Password"),
    });
    return schema.validateSignUp(data);
  };

  
module.exports={validateSignUp}