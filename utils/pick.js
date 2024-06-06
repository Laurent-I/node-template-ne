// This function is used to create a new object that contains only the properties of the original object that are listed in the keys array.

const pick = (object, keys) => {
    return keys.reduce((obj , keys)=>{
        if(object && object.hasOwnProperty.call(object, keys)){
            obj[keys] = object[keys]
        }
        return obj;
    }, {})
}

module.exports = pick;