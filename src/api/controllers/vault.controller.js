exports.retrieve = (req, res) => {

    return res.json({ test: "OK"});
}


exports.store = (req, res) => {

    console.log(req);
    console.log(res);
    return null
}
