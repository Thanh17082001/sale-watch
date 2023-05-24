import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req, res, next) => {
    // const authHeader = req.header('Authorization');
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.session.authState?.accessToken;

    const isPublicRoute = /[/]/.test(req.url) || /[/][^admin][/w]/.test(req.url);

    if (isPublicRoute)
        return next();

    // Token not found
    if (!token) {
        return res.redirect('/user/login') 
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.userId = decoded.userId;
        req.roles = decoded.roles;
        req.isAdmin = decoded.isAdmin;
        next();
    } catch (error) {
        console.log(error);
        return res.redirect('/user/login') 
    }
}

const verifyAdmin = (req, res, next) => {
    if (req.isAdmin) {
        next();
    }
    else {
        res.render('err404', {layout: false})
    }
}

export { verifyToken, verifyAdmin }
