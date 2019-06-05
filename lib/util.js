const notNull = (value, msg = '') => {
    if (value === undefined || value === null) {
        throw new Error(msg);
    }
};

const requireNotNull = (value, msg = '') => {
    if (value === undefined || value === null) {
        throw new Error(msg);
    }
    return value;
};

module.exports = { notNull, requireNotNull }