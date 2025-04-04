import Tokens from 'csrf'

const tokens = new Tokens()

const generateCsrfTokken = async (req, res) => {
    const secret = await tokens.secret()
    const token = tokens.create(secret)

    res.cookie('csrf_secret', secret, {
        httpOnly : true,
        sameSite : 'Strict',
        secure : false,
        maxAge: 1000 * 60 * 30
    })

    res.status(200).json({ csrfToken : token })
}

const verifyCsrfToken = async (req, res, next) => {
    const secret = req.cookies.csrf_secret
    const token = req.headers['x-csrf-token'] || req.body.csrfToken

    if( !secret || !token || !tokens.verify(secret, token) ) {
        return res.status(403).json({status : 403, msg : 'CSRF token invalide'})
    }

    next()
}

export { generateCsrfTokken, verifyCsrfToken }