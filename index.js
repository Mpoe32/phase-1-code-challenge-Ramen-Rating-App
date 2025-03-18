const ramens = [
    { id: 1, name: "Shoyu Ramen", restaurant: "Ichiran", image: "images/shoyu.jpg", rating: 10/10, comment: "Delicious!" },
    { id: 2, name: "Nirvana Ramen", restaurant: "Nirvana", image: "images/nirvana.jpg", rating: 10/10, comment: "Very flavorful!" },
    { id: 3, name: "Naruto Ramen", restaurant: "Ramen-ya", image: "images/naruto.jpg", rating: 10/10, comment: "Rich and creamy!" },
    { id: 4, name: "Kojiro Ramen", restaurant: "Nirvana", image: "images/kojiro.jpg", rating: 10/10, comment: "Extremely sweet!" },
    { id: 5, name: "Gyuoktsu Ramen", restaurant: "Ramen-ya", image: "images/gyukotsu.jpg", rating: 10/10, comment: "Yummy, yummy!"}
 ];
 
 function displayRamens() {
    const ramenMenu = document.getElementById("ramen-menu");
    ramens.forEach(ramen => {
        const img = document.createElement("img");
        img.src = ramen.image;
        img.alt = ramen.name;
        img.dataset.id = ramen.id; // Store the ID for reference
        img.addEventListener("click", handleClick);
        ramenMenu.appendChild(img);
    });
 }
 function handleClick(event) {
    const ramenId = event.target.dataset.id;
    const ramen = ramens.find(r => r.id == ramenId);
    if (ramen) {
        document.getElementById("ramen-name").textContent = ramen.name;
        document.getElementById("ramen-restaurant").textContent = ramen.restaurant;
        document.getElementById("ramen-rating").textContent = `Rating: ${ramen.rating}`;
        document.getElementById("ramen-comment").textContent = `Comment: ${ramen.comment || "No comment"}`;
    }
 }
 function addSubmitListener() {
    const form = document.getElementById("new-ramen");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const newRamen = {
            id: ramens.length + 1,
            name: document.getElementById("new-name").value,
            restaurant: document.getElementById("new-restaurant").value,
            image: document.getElementById("new-image").value,
            rating: document.getElementById("new-rating").value,
            comment: document.getElementById("new-comment").value
        };
        ramens.push(newRamen);
        const img = document.createElement("img");
        img.src = newRamen.image;
        img.alt = newRamen.name;
        img.dataset.id = newRamen.id;
        img.addEventListener("click", handleClick);
        document.getElementById("ramen-menu").appendChild(img);
        form.reset();
    });
 }
 function main() {
    displayRamens();
    addSubmitListener();
 }
 // Ensure the DOM is fully loaded before running the main function
 document.addEventListener("DOMContentLoaded", main);
 function main(){
    displayRamens();
    addSubmitListener();
    if (ramens.length > 0) {
        const firstRamen = ramens[0];
        document.getElementById("ramen-name").textContent = firstRamen.name;
        document.getElementById("ramen-restaurant").textContent = firstRamen.restaurant;
        document.getElementById("ramen-rating").textContent = `Rating: ${firstRamen.rating}`;
        document.getElementById("ramen-comment").textContent = `Comment: ${firstRamen.comment || "No comment"}`;
    }
}