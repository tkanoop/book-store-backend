

const Joi=require('joi')
const passwordComplexity=require('joi-password-complexity')
const validate = (data) => {
    const schema = Joi.object({
  
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
  };



module.exports={validate}