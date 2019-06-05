
const notNull = (obj, msg = '') => {
    if (!obj) {
        throw new Error(msg);
    }
};


const requireNotNull = (obj, msg = '') => {
    if (!obj) {
        throw new Error(msg);
    }
    return obj;
};

module.exports = { notNull, requireNotNull }