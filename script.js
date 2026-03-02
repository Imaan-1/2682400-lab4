const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const countryInfo = document.getElementById('country-info');
const borderSection = document.getElementById('bordering-countries');
const spinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});

countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry(countryInput.value.trim());
    }
});

async function searchCountry(countryName) {

    if (!countryName) {
        showError("Please enter a country name.");
        return;
    }

    try {
        spinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        countryInfo.innerHTML = '';
        borderSection.innerHTML = '';

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="100">
        `;

        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderSection.innerHTML += `
                    <div>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" width="50">
                    </div>
                `;
            }
        } else {
            borderSection.innerHTML = "<p>No bordering countries</p>";
        }

    } catch (error) {
        showError(error.message);
    } finally {
        spinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}