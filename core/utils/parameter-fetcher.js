class ParameterFetcher{
    static retrieveAndValidate(paramRules, unvalidatedParams){
        let responseObject = {};
        Object.entries(paramRules).forEach(parameter => {
            const paramName = parameter[0];
            const paramDescr = parameter[1];

            const isRequiredButEmpty = paramDescr.required && !unvalidatedParams[paramName];
            const isCorrectType = (paramDescr.type === 'array') ? Array.isArray(unvalidatedParams[paramName])
                : typeof unvalidatedParams[paramName] === paramDescr.type;
            if(isRequiredButEmpty){
                throw new Error(`Parameter ${paramName} must not be empty`);
            }

            if (unvalidatedParams[paramName] && !isCorrectType){
                throw new Error(`Parameter ${paramName} must be of type ${paramDescr.type}`);
            }
            responseObject[paramName] = unvalidatedParams[paramName];
        });
        return responseObject;
    };
}

module.exports = ParameterFetcher;