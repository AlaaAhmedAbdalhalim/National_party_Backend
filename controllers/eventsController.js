
const Events = require('../models/Events');

exports.getAll = async (req, res) => {
    res.json(await Events.findAll());
};

exports.create = async (req, res) => {
    res.json(await Events.create(req.body));
};

exports.update = async (req, res) => {
    res.json(await Events.update(req.body, { where: { id: req.params.id } }));
};

exports.delete = async (req, res) => {
    await Events.destroy({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
};
