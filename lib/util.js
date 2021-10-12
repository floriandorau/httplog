const secretKeys = ['authorization', 'cookie'];
const isSecret = (key) => secretKeys.includes(key.toLowerCase());

const isUndefined = (value) => value === null || value === undefined;
const isObject = (value) => typeof value === 'object' && !isUndefined(value);

const notNull = (value, msg = '') => {
    if (isUndefined(value)) throw new Error(msg);
};

const requireNotNull = (value, msg = '') => {
    if (isUndefined(value)) throw new Error(msg);
    else return value;
};

const redactSecrets = (input) => {
    if (isUndefined(input)) return input;

    const result = { ...input };

    for (const key in input) {
        if (isObject(input[key])) result[key] = redactSecrets(input[key]);
        else if (isSecret(key) && input[key]) result[key] = 'REDACTED';
    }

    return result;
};

module.exports = { notNull, requireNotNull, redactSecrets };