import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import _debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const els = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const handleInputChange = event => {
  els.countryList.innerHTML = '';
  els.countryInfo.innerHTML = '';

  const inputValue = event.target.value;

  if (inputValue.trim() === '') {
    return;
  }

  fetchCountries(inputValue.trim())
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      countries.map(country => {
        if (countries.length === 1) {
          showCountryInfo(country);
          return;
        }

        showCountriesList(country);
      });
    })
    .catch(() => Notify.failure('Oops, there is no country with that name'));
};

const showCountriesList = country => {
  els.countryInfo.innerHTML = '';
  const markup = `<li class="list-item">
<img width="40px" max-height="40px" src="${country.flags.svg}">
</img>
<h2>${country.name.official}</h2>
</li>`;

  els.countryList.insertAdjacentHTML('beforeend', markup);
};

const showCountryInfo = country => {
  els.countryList.innerHTML = '';
  els.countryInfo.innerHTML = `<h2>
  <img width="150px" src="${country.flags.svg}">
  </img>
</h2>
<p>Capital:${country.capital}</p>
<p>Population:${country.population}</p>
<p>Languages:${Object.values(country.languages)}</p>`;
};

els.input.addEventListener(
  'input',
  _debounce(handleInputChange, DEBOUNCE_DELAY)
);
