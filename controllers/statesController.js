
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

const getFunFacts = async (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var facts = await State.findOne({ stateCode: code }).exec();
            var result = data.states.filter(obj=> obj.code == code);
            var updatedState = result[0].state;
            if(facts != null) {
                var resultObject = { funfacts: facts.funfacts };
                var resultIndex = Math.floor(Math.random() * resultObject.funfacts.length);
                var funfact = resultObject.funfacts[resultIndex];
                var updatedReturn = { funfact };
                
                return res.json(updatedReturn);
            }  
            var message = ("No Fun Facts found for " + updatedState);
            return res.json({"message": message});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}


const createFunFact = async (req, res) => {
    for(x = 0; x < data.states.length; x++) {
        let code = req.params.code;
        code = code.toUpperCase();
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var facts = await State.findOne({ stateCode: code }).exec();
            console.log(facts);
            if (!req?.body?.funfacts) {
                return res.status(400).json({ 'message': 'State fun facts value required'});
            }
            var arrayCheck = req.body.funfacts;
            if (!Array.isArray(arrayCheck)){
                return res.status(400).json({ 'message': 'State fun facts value must be an array'});
            }
            
            try {
                if(!facts) {
                const result = await State.create({
                    stateCode: code,
                    funfacts: req.body.funfacts
                });
                return res.status(201).json(result);
            } else {
                const result = await State.findOneAndUpdate(
                    { stateCode: code },
                    { $push: { funfacts: req.body.funfacts } },
                    { upsert: true, new: true }
                  );
                return res.status(201).json(result);
            }
                
            } catch (err) {
                console.error(err);
            }
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const deleteFunFact = async (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var index = req.body.index;
            if(!index){
                return res.status(400).json({ "message": "State fun fact index value required"});
            }
            var facts = await State.findOne({ stateCode: code }).exec();
            var result = data.states.filter(obj=> obj.code == code);
            var updatedState = result[0].state;
            if(facts != null) {
                var resultObject = { funfacts: facts.funfacts };
                
                const deleteResult = await State.findOneAndUpdate(
                    { stateCode: code },
                    { $unset: { [`funfacts.${index-1}`]: 1 } },
                    { new: true }
                  );
                  await State.findOneAndUpdate(
                    { stateCode: code },
                    { $pull: { funfacts: null } },
                    { new: true }
                  );
                
                  if(!deleteResult.funfacts[index-1]){
                    var message = ("No Fun Fact found at that index for " + updatedState);
                    return res.json({"message": message});
                }
                  
                return res.json(deleteResult);
            }  
            var message = ("No Fun Facts found for " + updatedState);
            return res.json({"message": message});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const updateFunFact = async (req, res) => {
    for(x = 0; x < data.states.length; x++) {
        let code = req.params.code;
        code = code.toUpperCase();
        let array = Object.entries(data.states).map(([key,value])=>value);

        if(code == array[x].code){
            var facts = await State.findOne({ stateCode: code }).exec();

            if (!req.body.funfact) {
                return res.status(400).json({ 'message': 'State fun fact value required'});
            }

            if (!req.body.index) {
                return res.status(400).json({ 'message': 'State fun fact index value required'});
            }
            
            try {
                const index = req.body.index;
                const funfacts = facts.funfacts;
                if(!funfacts) {
                    var updatedState = result[0].state;
                    var message = ("No Fun Facts found for " + updatedState);
                    return res.status(400).json({ 'message': message });
                }
                funfacts[index-1] = req.body.funfact;
                if(!funfacts[index-1]) {
                    var updatedState = result[0].state;
                    var message = ("No Fun Fact found at that index for " + updatedState);
                    return res.status(400).json({ 'message': message });
                }
                const result = await State.findOneAndUpdate(
                { stateCode: code },
                { $set: { funfacts: funfacts } },
                { upsert: true, new: true }
                );

                return res.status(201).json(result);
                            
            } catch (err) {
                console.error(err);
            }
        }
    } 
    return res.json({"message":"No Fun Facts found for Arizona"});
}

module.exports = { 
    getAllStates,
    getStateCapital,
    getState,
    getNickname,
    getPopulation,
    getAdmission,
    createFunFact,
    getFunFacts,
    deleteFunFact,
    updateFunFact
}