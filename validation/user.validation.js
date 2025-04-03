import joi from 'joi'

function userValidation(body) {
    const userRegistration = joi.object({
        email: joi
            .string()
            .email()
            .trim()
            .required(),
        password: joi
            .string()
            .min(8)
            .max(30)
            .required()
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
    })
    const userLogin = joi.object({
        email: joi
            .string()
            .email()
            .trim()
            .required(),
        password: joi
            .string()
            .min(8)
            .max(30)
            .required()
    })

    return {
        userRegistration: userRegistration.validate(body),
        userLogin: userLogin.validate(body)
    }
}

export default userValidation