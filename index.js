const ramens = [
    { id: 1, name: "Shoyu Ramen", restaurant: "Ichiran", image: "images/shoyu.jpg", rating: 5, comment: "Delicious!" },
    { id: 2, name: "Nirvana Ramen", restaurant: "Nirvana", image: "images/nirvana.jpg", rating: 4, comment: "Very flavorful!" },
    { id: 3, name: "Naruto Ramen", restaurant: "Ramen-ya", image: "images/naruto.jpg", rating: 5, comment: "Rich and creamy!" },
    { id: 4, name: "Kojiro Ramen", restaurant: "Nirvana", image: "images/kojiro.jpg", rating: 4, comment: "Extremely sweet!" },
    { id: 5, name: "Gyuoktsu Ramen", restaurant: "Ramen-ya", image: "images/gyukotsu.jpg", rating: 5, comment: "Yummy, yummy!"}
];

// State management
let currentView = 'all';
let currentSort = 'name';
let searchQuery = '';

// Create star rating HTML
function createStarRating(rating) {
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    return `<span class="stars">${stars}</span>`;
}

// Filter and sort ramens
function filterAndSortRamens() {
    let filtered = [...ramens];

    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(ramen => 
            ramen.name.toLowerCase().includes(query) ||
            ramen.restaurant.toLowerCase().includes(query)
        );
    }

    // Apply view filter
    if (currentView === 'top-rated') {
        filtered = filtered.filter(ramen => ramen.rating >= 4);
    }

    // Apply sorting
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'rating':
                return b.rating - a.rating;
            case 'restaurant':
                return a.restaurant.localeCompare(b.restaurant);
            default:
                return 0;
        }
    });

    return filtered;
}

// Display ramens in grid view
function displayRamens() {
    const ramenMenu = document.getElementById("ramen-menu");
    ramenMenu.innerHTML = '';
    
    const filtered = filterAndSortRamens();
    
    filtered.forEach(ramen => {
        const imgContainer = document.createElement("div");
        imgContainer.className = "ramen-item";
        
        const img = document.createElement("img");
        img.src = ramen.image;
        img.alt = ramen.name;
        img.dataset.id = ramen.id;
        
        const quickInfo = document.createElement("div");
        quickInfo.className = "quick-info";
        quickInfo.innerHTML = `
            <span class="name">${ramen.name}</span>
            ${createStarRating(ramen.rating)}
        `;
        
        imgContainer.appendChild(img);
        imgContainer.appendChild(quickInfo);
        imgContainer.addEventListener("click", () => handleClick(ramen.id));
        ramenMenu.appendChild(imgContainer);
    });
}

// Display ramens grouped by restaurant
function displayRestaurantView() {
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '';
    
    // Group ramens by restaurant
    const groupedRamens = ramens.reduce((acc, ramen) => {
        (acc[ramen.restaurant] = acc[ramen.restaurant] || []).push(ramen);
        return acc;
    }, {});
    
    // Sort restaurants alphabetically
    Object.keys(groupedRamens).sort().forEach(restaurant => {
        const group = document.createElement('div');
        group.className = 'restaurant-group';
        
        group.innerHTML = `
            <h3>${restaurant}</h3>
            <div class="restaurant-ramen"></div>
        `;
        
        const ramenContainer = group.querySelector('.restaurant-ramen');
        
        groupedRamens[restaurant].forEach(ramen => {
            const ramenItem = document.createElement('div');
            ramenItem.className = 'ramen-item';
            ramenItem.innerHTML = `
                <img src="${ramen.image}" alt="${ramen.name}" data-id="${ramen.id}">
                <div class="quick-info">
                    <span class="name">${ramen.name}</span>
                    ${createStarRating(ramen.rating)}
                </div>
            `;
            ramenItem.addEventListener('click', () => handleClick(ramen.id));
            ramenContainer.appendChild(ramenItem);
        });
        
        restaurantList.appendChild(group);
    });
}

function handleClick(ramenId) {
    const ramen = ramens.find(r => r.id == ramenId);
    if (ramen) {
        displayRamenDetails(ramen);
        document.getElementById('ramen-detail').classList.remove('hidden');
    }
}

function displayRamenDetails(ramen) {
    const detailSection = document.getElementById("ramen-detail");
    detailSection.classList.add('fade-in');
    
    document.getElementById("ramen-name").textContent = ramen.name;
    document.getElementById("ramen-restaurant").textContent = ramen.restaurant;
    document.getElementById("ramen-rating").innerHTML = `Rating: ${createStarRating(ramen.rating)}`;
    document.getElementById("ramen-comment").textContent = `Comment: ${ramen.comment || "No comment"}`;
    
    setTimeout(() => detailSection.classList.remove('fade-in'), 300);
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function setupEventListeners() {
    // View switching - include both nav and footer buttons
    document.querySelectorAll('.nav-btn, .footer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelector(`.nav-btn[data-view="${btn.dataset.view}"]`).classList.add('active');
            currentView = btn.dataset.view;
            updateView();
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        updateView();
    });
    
    searchBtn.addEventListener('click', () => {
        searchInput.focus();
    });

    // Sorting
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        updateView();
    });

    // Form toggling
    document.getElementById('toggleForm').addEventListener('click', () => {
        document.getElementById('new-ramen').classList.remove('hidden');
        document.querySelector('#new-name').focus();
    });

    document.querySelector('.close-form').addEventListener('click', () => {
        document.getElementById('new-ramen').classList.add('hidden');
    });

    document.querySelector('.close-detail').addEventListener('click', () => {
        document.getElementById('ramen-detail').classList.add('hidden');
    });

    // Form submission
    const form = document.getElementById("new-ramen");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const newRamen = {
            id: ramens.length + 1,
            name: document.getElementById("new-name").value,
            restaurant: document.getElementById("new-restaurant").value,
            image: document.getElementById("new-image").value,
            rating: parseInt(document.getElementById("new-rating").value),
            comment: document.getElementById("new-comment").value
        };
        
        ramens.push(newRamen);
        updateView();
        displayRamenDetails(newRamen);
        
        showNotification('Ramen added successfully! 🍜');
        form.reset();
        form.classList.add('hidden');
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        const newRamenForm = document.getElementById('new-ramen');
        const ramenDetail = document.getElementById('ramen-detail');
        
        if (e.target === newRamenForm) {
            newRamenForm.classList.add('hidden');
        }
        if (e.target === ramenDetail) {
            ramenDetail.classList.add('hidden');
        }
    });

    // Prevent modal close when clicking inside modal content
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', (e) => e.stopPropagation());
    });
}

function updateView() {
    // Hide all views first
    document.getElementById('ramen-menu').parentElement.classList.add('hidden');
    document.getElementById('restaurants-view').classList.add('hidden');
    
    // Show appropriate view
    if (currentView === 'by-restaurant') {
        document.getElementById('restaurants-view').classList.remove('hidden');
        displayRestaurantView();
    } else {
        document.getElementById('ramen-menu').parentElement.classList.remove('hidden');
        displayRamens();
    }
}

function main() {
    setupEventListeners();
    updateView();
}

// Ensure the DOM is fully loaded before running the main function
document.addEventListener("DOMContentLoaded", main);