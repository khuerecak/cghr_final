const State = require('../model/State');
const data = {
                 states: require('../model/statesData.json'),
                 setStates: function (data) { this.states = data }
}

const getAllStates = async (req, res) => {
    
    const parseURL = req.query.contig;
    if (parseURL == "true") {
        let contigFilter = data.states.filter(state => state.state !== 'Alaska' && state.state !== 'Hawaii');
        return res.json(contigFilter);
    } else if (parseURL == "false") {
        let contigFilter = data.states.filter(state => state.state == 'Alaska' || state.state == 'Hawaii');
        return res.json(contigFilter);
    } else {
        for (let i = 0; i < data.states.length; i++) {
            const code = data.states[i].code;

            const mongoLookup = await State.findOne({ stateCode: code });
            if (mongoLookup) {
                var updateFacts = mongoLookup.funfacts;
                data.states[i] = {
                    ...data.states[i],
                    funfacts: mongoLookup.funfacts
                  };
            }
        }
        return res.json(data.states);
    }
    
}

const getStateCapital = (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            return res.json({"state":array[x].state,"capital":array[x].capital_city});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const getState = async (req, res) => {
    let code = req.params.state;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var facts = await State.findOne({ stateCode: code }).exec();

            var result = data.states.filter(obj=> obj.code == code);
            if(facts != null) {
                const resultObject = { funfacts: facts.funfacts };
                var updatedReturn = {...result[0], ...resultObject };
                
                return res.json(updatedReturn);
            }  
            
            return res.json(result[0]);
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const getNickname = (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            return res.json({"state":array[x].state,"nickname":array[x].nickname});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const getPopulation = (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            return res.json({"state":array[x].state,"population":array[x].population.toLocaleString()   });
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const getAdmission = (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            return res.json({"state":array[x].state,"admitted":array[x].admission_date.toLocaleString()});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

module.exports = { 
    getAllStates,
    getStateCapital,
    getState,
    getNickname,
    getPopulation,
    getAdmission
}