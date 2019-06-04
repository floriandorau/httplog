
const notNull = (obj, msg) => {
    if (!obj) {
        throw new Error(msg);
    }
};

module.exports = { notNull }