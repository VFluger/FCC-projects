const btn = document.querySelector("#search-button");
const input = document.querySelector("#search-input");

const output = document.querySelector(".pokemon-div");

const getAllPokemons = async () => {
  const resp = await fetch(
    "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon"
  );
  const data = await resp.json();
  return data.results;
};

let pokemonsArr = [];
getAllPokemons().then((data) => {
  pokemonsArr = data;
});

btn.addEventListener("click", () => {
  getTopPokemons(pokemonsArr, input.value);
});

input.addEventListener("input", () => {
  showSuggestions(pokemonsArr, input.value);
});

const getTopPokemons = (arr, input) => {
  let numOfResults = 0;
  if (input.length <= 2) {
    return;
  }
  for (let result of arr) {
    const { name, id, url } = result;
    if (name.includes(input)) {
      numOfResults++;
      showPokemon(url);
      break;
    }
  }
};

const showSuggestions = (arr, input) => {
  let numOfResults = 0;
  const autocompleteDiv = document.querySelector(".autocomplete");
  autocompleteDiv.innerHTML = "";
  if (input.length <= 2) {
    return;
  }
  for (let result of arr) {
    if (numOfResults > 2) {
      break;
    }
    const { name, id, url } = result;
    if (name.includes(input)) {
      numOfResults++;
      console.log("works");
      autocompleteDiv.innerHTML += `
      <a href="#" pokemon-url="${url}" class="suggestion" id="${id}">${name
        .replace("-f", " ♀")
        .replace("-m", " ♂")}</a>
      `;
    }
  }
  autocompleteDiv.querySelectorAll("a").forEach((suggestion, index) => {
    if (index === 0) {
      suggestion.style.animation = `opacity 300ms ease-in forwards 100ms`;
    }
    suggestion.style.animation = `opacity 300ms ease-in forwards ${
      100 * index
    }ms`;
    suggestion.addEventListener("click", () => {
      showPokemon(suggestion.getAttribute("pokemon-url"));
    });
  });
  autocompleteDiv.style.animation =
    "opacity 300ms ease-in forwards, autocompleteHeight 300ms ease-in forwards";
};

const showPokemon = async (url) => {
  const getFormattedType = (type) => {
    switch (type) {
      case "normal":
        return `<span class="pokemon-type" id='${type}' style="color: #a8a878">Normal</span>`;
        break;
      case "fire":
        return `<span class="pokemon-type" id='${type}' style="color: #f08030">Fire</span>`;
        break;
      case "water":
        return `<span class="pokemon-type" id='${type}' style="color: #3898f8">Water</span>`;
        break;
      case "electric":
        return `<span class="pokemon-type" id='${type}' style="color: #f8d030">Electric</span>`;
        break;
      case "grass":
        return `<span class="pokemon-type" id='${type}' style="color: #78c850">Grass</span>`;
        break;
      case "ice":
        return `<span class="pokemon-type" id='${type}' style="color: #98d8d8">Ice</span>`;
        break;
      case "fighting":
        return `<span class="pokemon-type" id='${type}' style="color: #c03028">Fighting</span>`;
        break;
      case "poison":
        return `<span class="pokemon-type" id='${type}' style="color: #a040a0">Poison</span>`;
        break;
      case "ground":
        return `<span class="pokemon-type" id='${type}' style="color: #e0c068">Ground</span>`;
        break;
      case "flying":
        return `<span class="pokemon-type" id='${type}' style="color: #a890f0">Flying</span>`;
        break;
      case "psychic":
        return `<span class="pokemon-type" id='${type}' style="color: #f85888">Psychic</span>`;
        break;
      case "bug":
        return `<span class="pokemon-type" id='${type}' style="color: #a8b820">Bug</span>`;
        break;
      case "rock":
        return `<span class="pokemon-type" id='${type}' style="color: #b8a038">Rock</span>`;
        break;
      case "ghost":
        return `<span class="pokemon-type" id='${type}' style="color: #705898">Ghost</span>`;
        break;
      case "dragon":
        return `<span class="pokemon-type" id='${type}' style="color: #7038f8">Dragon</span>`;
        break;
      case "dark":
        return `<span class="pokemon-type" id='${type}' style="color: #705848">Dark</span>`;
        break;
      case "steel":
        return `<span class="pokemon-type" id='${type}' style="color: #b8b8d0">Steel</span>`;
        break;
      case "fairy":
        return `<span class="pokemon-type" id='${type}' style="color: #ee99ac">Fairy</span>`;
        break;
    }
  };
  output.style.visibility = "hidden";
  document.querySelector(".loading-div").style.display = "block";
  const resp = await fetch(url);
  const data = await resp.json();
  output.style.visibility = "visible";
  const { name, height, weight, id, sprites, types, stats } = data;
  const normalizedName = name.replace("-f", " ♀").replace("-m", " ♂");
  output.querySelector("#pokemon-name").innerHTML =
    normalizedName[0].toUpperCase() + normalizedName.slice(1);
  output.querySelector("#pokemon-id").innerHTML = id;
  output.querySelector("#weight").innerHTML = weight;
  output.querySelector("#height").innerHTML = height;
  const img = document.querySelector("#pokemon-img");
  img.src = sprites.front_default;
  img.alt = `${name} image`;
  output.querySelector("#types").innerHTML = "";
  for (let type of types) {
    const typeSpan = document.createElement("span");
    typeSpan.innerHTML = getFormattedType(type.type.name);
    output.querySelector("#types").appendChild(typeSpan);
  }
  const statsTable = output.querySelector("#stats");
  statsTable.querySelector("#hp").innerHTML = stats[0].base_stat;
  statsTable.querySelector("#attack").innerHTML = stats[1].base_stat;
  statsTable.querySelector("#defence").innerHTML = stats[2].base_stat;
  statsTable.querySelector("#special-attack").innerHTML = stats[3].base_stat;
  statsTable.querySelector("#special-defense").innerHTML = stats[4].base_stat;
  statsTable.querySelector("#speed").innerHTML = stats[5].base_stat;
  document.querySelector(".loading-div").style.display = "none";
};
