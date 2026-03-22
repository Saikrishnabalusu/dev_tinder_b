const userAuth = (req, res, next) => {
    let authToken = "xyz";
    if (authToken === "xyz") {
        console.log("user authenticated!!");
        next();
    } else {
        res.status(401).send("Authentication denied!!");
    }
}

module.exports = {
    userAuth
}