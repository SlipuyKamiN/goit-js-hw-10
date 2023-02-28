const fetchCountries = name =>
  fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(responce => responce.json())
    .then(countries => {
      return countries;
    });

export { fetchCountries };
