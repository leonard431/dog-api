const dogList = document.getElementById("dogList").value="anything"
async function getDogs() {
    try{
      const response = await fetch(
        "https://dogapi.dog/api/v2/breeds"
    );
    const body = await response.json();
    console.log(body);
    
    body.data.forEach(dog) => {
        const dogName = document.createElement("h2")
        dogName.textContent = dogattribute.name;
        dogList.appendChild(dogName);
    }; 
    }
}
getDogs();

