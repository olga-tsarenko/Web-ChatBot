const {get} = require("axios");
const getExchangeRate = (baseCurrency) => {
    return async () => {
        try {
            return await get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            throw error;
        }
    };
}

const data = {
    start: {
        text: 'What are you interested in?:',
        actions: {
            'currency rate': {
                text: 'Choose basic currency:',
                actions: {
                    'USD': {
                        response: getExchangeRate
                    },
                    'EUR': '',
                    'GBP': ''
                }
            },
            'current weather': {
                text: 'Choose your city:',
                actions: []
            }
        }
    }
};

module.exports = { data };
