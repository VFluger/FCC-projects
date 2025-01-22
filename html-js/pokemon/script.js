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
  const index = pokemonsArr.findIndex((obj) => {
    if (obj.name === input.value.toLowerCase()) {
      return true;
    }
    if (obj.id == input.value) {
      return true;
    }
  });
  if (index === -1) {
    alert("Pokémon not found");
    return;
  }
  showPokemon(pokemonsArr[index].url);
});

input.addEventListener("input", () => {
  showSuggestions(pokemonsArr, input.value);
});

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
    switch (type.toLowerCase()) {
      case "normal":
        return `<span class="pokemon-type" id='${type}' style="color: #a8a878">NORMAL</span>`;
        break;
      case "fire":
        return `<span class="pokemon-type" id='${type}' style="color: #f08030">FIRE</span>`;
        break;
      case "water":
        return `<span class="pokemon-type" id='${type}' style="color: #3898f8">WATER</span>`;
        break;
      case "electric":
        return `<span class="pokemon-type" id='${type}' style="color: #f8d030">ELECTRIC</span>`;
        break;
      case "grass":
        return `<span class="pokemon-type" id='${type}' style="color: #78c850">GRASS</span>`;
        break;
      case "ice":
        return `<span class="pokemon-type" id='${type}' style="color: #98d8d8">ICE</span>`;
        break;
      case "fighting":
        return `<span class="pokemon-type" id='${type}' style="color: #c03028">FIGHTING</span>`;
        break;
      case "poison":
        return `<span class="pokemon-type" id='${type}' style="color: #a040a0">POISON</span>`;
        break;
      case "ground":
        return `<span class="pokemon-type" id='${type}' style="color: #e0c068">GROUND</span>`;
        break;
      case "flying":
        return `<span class="pokemon-type" id='${type}' style="color: #a890f0">FLYING</span>`;
        break;
      case "psychic":
        return `<span class="pokemon-type" id='${type}' style="color: #f85888">PSYCHIC</span>`;
        break;
      case "bug":
        return `<span class="pokemon-type" id='${type}' style="color: #a8b820">BUG</span>`;
        break;
      case "rock":
        return `<span class="pokemon-type" id='${type}' style="color: #b8a038">ROCK</span>`;
        break;
      case "ghost":
        return `<span class="pokemon-type" id='${type}' style="color: #705898">GHOST</span>`;
        break;
      case "dragon":
        return `<span class="pokemon-type" id='${type}' style="color: #7038f8">DRAGON</span>`;
        break;
      case "dark":
        return `<span class="pokemon-type" id='${type}' style="color: #705848">DARK</span>`;
        break;
      case "steel":
        return `<span class="pokemon-type" id='${type}' style="color: #b8b8d0">STEEL</span>`;
        break;
      case "fairy":
        return `<span class="pokemon-type" id='${type}' style="color: #ee99ac">FAIRY</span>`;
        break;
    }
  };
  output.style.visibility = "hidden";
  const oldImg = output.querySelector("img");
  if (oldImg) {
    oldImg.remove();
  }
  document.querySelector(".loading-div").style.display = "block";
  const resp = await fetch(url);
  const data = await resp.json();
  output.style.visibility = "visible";
  const { name, height, weight, id, sprites, types, stats } = data;
  const normalizedName = name.toUpperCase();
  output.querySelector("#pokemon-name").innerHTML = normalizedName;
  output.querySelector("#pokemon-id").innerHTML = id;
  output.querySelector("#weight").innerHTML = weight;
  output.querySelector("#height").innerHTML = height;
  const img = document.createElement("img");
  img.src = sprites.front_default;
  img.id = "sprite";
  img.alt = `${name} image`;
  output.insertBefore(img, document.querySelector(".bio"));
  output.querySelector("#types").innerHTML = "";
  for (let type of types) {
    output.querySelector("#types").innerHTML += getFormattedType(
      type.type.name
    );
  }
  const statsTable = output.querySelector("#stats");
  statsTable.querySelector("#hp").innerHTML = stats[0].base_stat;
  statsTable.querySelector("#attack").innerHTML = stats[1].base_stat;
  statsTable.querySelector("#defense").innerHTML = stats[2].base_stat;
  statsTable.querySelector("#special-attack").innerHTML = stats[3].base_stat;
  statsTable.querySelector("#special-defense").innerHTML = stats[4].base_stat;
  statsTable.querySelector("#speed").innerHTML = stats[5].base_stat;
  document.querySelector(".loading-div").style.display = "none";
};
