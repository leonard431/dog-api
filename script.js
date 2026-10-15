const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const dogList = document.getElementById("dogList");
const message = document.getElementById("message");

let allDogs = [];

async function getDogs() {
    message.textContent = "Loading dog breeds...";

    try {
        let nextUrl = "https://dogapi.dog/api/v2/breeds?page[size]=1000";
        allDogs = [];

        // Fetch every page of dog breeds
        while (nextUrl) {
            const response = await fetch(nextUrl);

            if (!response.ok) {
                throw new Error("Could not load dog breeds.");
            }

            const body = await response.json();

            allDogs.push(...body.data);

            nextUrl = body.links?.next || null;
        }

        displayDogs(allDogs);

        message.textContent =
            `Showing ${allDogs.length} dog breeds.`;

    } catch (error) {
        message.textContent =
            "Could not load dog breeds. Please check your internet connection.";

        console.error("Dog API error:", error);
    }
}

function displayDogs(dogs) {
    dogList.innerHTML = "";

    if (dogs.length === 0) {
        message.textContent = "No matching breeds found.";
        return;
    }

    dogs.forEach((dog) => {
        const attributes = dog.attributes;

        const card = document.createElement("article");
        card.className = "dog-card";

        // Dog breed name
        const name = document.createElement("h2");
        name.textContent = attributes.name;

        // Dog picture
        const images = attributes.images || [];
        const firstImage = images[0];

        const image = document.createElement("img");
        image.className = "dog-image";
        image.alt = attributes.name;
        image.loading = "lazy";

        if (firstImage) {
            image.src =
                firstImage.medium ||
                firstImage.url ||
                firstImage.large;

            image.onerror = () => {
                image.onerror = null;
                image.src =
                    `https://dogapi.dog/api/v2/breeds/${dog.id}/image?size=medium`;
            };
        } else {
            image.src =
                `https://dogapi.dog/api/v2/breeds/${dog.id}/image?size=medium`;
        }

        // Image credit
        const credit = document.createElement("small");
        credit.className = "image-credit";

        if (firstImage?.attribution) {
            const attribution = firstImage.attribution;

            credit.textContent =
                `Photo: ${attribution.author || "Unknown"} — ${attribution.license || ""}`;
        }

        // Description
        const description = document.createElement("p");
        description.textContent =
            attributes.description || "No description available.";

        // Life expectancy
        const life = document.createElement("p");
        const lifeData = attributes.life;

        life.textContent = lifeData
            ? `Life expectancy: ${lifeData.min ?? "?"}–${lifeData.max ?? "?"} years`
            : "Life expectancy: Not available";

        // Weight
        const maleWeight = attributes.male_weight;
        const femaleWeight = attributes.female_weight;

        const weight = document.createElement("p");

        if (maleWeight || femaleWeight) {
            const male = maleWeight
                ? `${maleWeight.min ?? "?"}–${maleWeight.max ?? "?"} kg`
                : "Not available";

            const female = femaleWeight
                ? `${femaleWeight.min ?? "?"}–${femaleWeight.max ?? "?"} kg`
                : "Not available";

            weight.textContent =
                `Weight — Male: ${male}; Female: ${female}`;
        } else {
            weight.textContent = "Weight: Not available";
        }

        // Add everything to the card
        card.appendChild(name);
        card.appendChild(image);

        if (credit.textContent) {
            card.appendChild(credit);
        }

        card.appendChild(description);
        card.appendChild(life);
        card.appendChild(weight);

        dogList.appendChild(card);
    });
}

function searchDogs() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredDogs = allDogs.filter((dog) => {
        return dog.attributes.name
            .toLowerCase()
            .includes(searchTerm);
    });

    displayDogs(filteredDogs);

    if (searchTerm !== "") {
        message.textContent =
            `${filteredDogs.length} matching breed(s) found.`;
    } else {
        message.textContent =
            `Showing ${allDogs.length} dog breeds.`;
    }
}

searchButton.addEventListener("click", searchDogs);

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchDogs();
    }
});

getDogs();