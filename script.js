const dogList = document.getElementById("dogList");
async function getDogs() {
    try{
      const response = await fetch(
        "https://dogapi.dog/api/v2/breeds"
    );
    const body = await response.json();
    console.log(body);
    
    body.data.forEach((dog) => {
        const dogName = document.createElement("h2")
        dogName.textContent = dog.attributes.name;
        dogList.appendChild(dogName);
    });
    } catch (error) {
        console.error("Error fetching dog breeds:", error);
    }
}


getDogs();

