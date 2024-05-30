const {get} = require("axios");
async function getExchangeRateToUAH(baseCurrency) {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        const data = await response.json();

        if (data && data.rates && data.rates.UAH) {
            return `${data.rates.UAH}`;
        } else {
            throw new Error('The exchange rate to UAH was not found.');
        }
    } catch (error) {
        console.error('Error when receiving the exchange rate:', error.message);
        return error.message;
    }
}

async function getWeatherForecast(city) {
    const apiKey = '821c402397646964ee021b16cdee51b0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            const weatherDataString = `
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Description: ${data.weather[0].description}</p>
                <p>Feels like : ${data.main.feels_like}°C</p>
                <p>Humidity : ${data.main.humidity}%</p>
                <p>Pressure : ${data.main.pressure}</p>
                <p>Wind Speed : ${data.wind.speed}m/s</p>
            `;
            return weatherDataString;
        } else {
            throw new Error('Помилка при отриманні прогнозу погоди.');
        }
    } catch (error) {
        console.error('Помилка при отриманні прогнозу погоди:', error.message);
        return null;
    }
}

const data = {
    help: {
        text: 'What are you interested in?',
        actions: {
            'Currency rate': {
                text: 'Choose basic currency:',
                actions: {
                    'USD': {
                        text: getExchangeRateToUAH
                    },
                    'EUR': {
                        text: getExchangeRateToUAH
                    },
                    'GBP': {
                        text: getExchangeRateToUAH
                    }
                }
            },
            'Current weather': {
                text: 'Choose your city:',
                actions: {
                    'Kyiv': {
                        text: getWeatherForecast
                    },
                    'Lviv': {
                        text: getWeatherForecast
                    },
                    'Cherkasy': {
                        text: getWeatherForecast
                    },
                    'Odesa': {
                        text: getWeatherForecast
                    },
                    'Dnipro': {
                        text: getWeatherForecast
                    }
                }
            }
        }
    }
};

module.exports = { data };
