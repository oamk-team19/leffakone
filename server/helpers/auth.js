export const auth = (req, res, next) => {
    let decodedUser = null

    if (!req.headers.authorization || !req.cookies['refreshToken']) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const authHeader = req.headers.authorization
        const access_token = authHeader.split(" ")[1]

        decodedUser = verify(access_token, jwt_secret)
    } catch (error) {
        try {
            const refresh_token = req.cookies['refreshToken']
            decodedUser = verify(refresh_token, jwt_secret)
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
    }
    finally {
        res.exposeHeaders()
        res.authorizationHeader(decodedUser.email)
        next()
    }
}
