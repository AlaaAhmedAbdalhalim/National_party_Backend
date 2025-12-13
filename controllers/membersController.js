/* 
const Members = require('../models/Members');

exports.getAll = async (req, res) => {
    res.json(await Members.findAll());
};

exports.create = async (req, res) => {
    res.json(await Members.create(req.body));
};

exports.update = async (req, res) => {
    res.json(await Members.update(req.body, { where: { id: req.params.id } }));
};

exports.delete = async (req, res) => {
    await Members.destroy({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
};

 */