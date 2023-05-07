const data = {
    states: require('../model/statesData.json'),
    setstates: function (data) { this.states = data }
}

const getAllStates = (req, res) => {
    res.json(data.states);
}

const getState = (req, res) => {
    const state = data.states.find(emp => state.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(400).json({ "message": `State ID ${req.params.id} not found` });
    }
    res.json(state);
}


module.exports = {
    getAllStates,
    getState
}