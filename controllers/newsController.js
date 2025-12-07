
const News = require('../models/News');

exports.getAll = async (req, res) => {
    const data = await News.findAll();
    res.json(data);
};

exports.create = async (req, res) => {
    const item = await News.create(req.body);
    res.json(item);
};

exports.update = async (req, res) => {
    const item = await News.update(req.body, { where: { id: req.params.id } });
    res.json(item);
};

exports.delete = async (req, res) => {
    await News.destroy({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
};