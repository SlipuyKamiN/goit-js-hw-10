import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import _debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import makeCountryList from './templates/countryListTpl.hbs';
import makeCountryInfo from './templates/countryInfoTpl.hbs';

const DEBOUNCE_DELAY = 300;
const els = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const renderCountryList = countries => {
  countries.map(country => {
    els.countryList.insertAdjacentHTML('beforeend', makeCountryList(country));
  });
};
const renderCountryInfo = countries => {
  countries.map(country => {
    els.countryInfo.innerHTML = `${makeCountryInfo(country)}`;
  });
};
const showInfoNotification = () => {
  Notify.info('Too many matches found. Please enter a more specific name.');
};
const showFailureNotification = () => {
  Notify.failure('Oops, there is no country with that name');
};
const resetMarkup = () => {
  els.countryList.innerHTML = '';
  els.countryInfo.innerHTML = '';
};

const handleInputChange = event => {
  resetMarkup();

  const inputValue = event.target.value.trim();

  if (inputValue === '') {
    resetMarkup();
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        showInfoNotification();
        return;
      }
      if (countries.length === 1) {
        renderCountryInfo(countries);
        return;
      }
      renderCountryList(countries);
    })
    .catch(() => {
      showFailureNotification();
    });
};

els.input.addEventListener(
  'input',
  _debounce(handleInputChange, DEBOUNCE_DELAY)
);
