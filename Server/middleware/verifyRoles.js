const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.status(401).json({ message: 'Unauthorized' });
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true); // For each role passed in request, check if it is contained within array of valid roles. Find the first true, if there is one = Good, only need one
        if (!result) return res.status(401).json({ message: 'Unauthorized' });
        // There was a true, we allow the route to be accessed
        next();
    }
}

module.exports = verifyRoles;