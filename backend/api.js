const express = require('express');

module.exports = models => {
    const api = express.Router();

    api.get('/teste', (req, res) => {
        return res.send(models);
    });

    return api;
};
