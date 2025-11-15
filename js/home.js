import { auth, db, signOut, onAuthStateChanged, collection, onSnapshot } from "./firebaseConfigure.js";

onAuthStateChanged(auth, (user) => {
    const currentUserName = document.getElementById("currentUserName");
    if (user) {
        currentUserName.textContent = user.email;
    } else {
        location.href = "loginPage.html";
        alert("Please login");
    }
});

const recipesContainer = document.getElementById("recipes-container");
let allRecipes = [];

function renderRecipes(snapshot) {
    allRecipes = [];
    recipesContainer.innerHTML = "";

    snapshot.forEach((doc) => {
        const data = doc.data();
        allRecipes.push({ id: doc.id, ...data });
    });

    displayRecipes(allRecipes);
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = "";

    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">No recipes found. Be the first to add one!</p>';
        return;
    }

    recipes.forEach((recipe) => {
        const card = document.createElement("div");
        card.className = "recipe-card";
        card.innerHTML = `
            <img src="${recipe.imageURL || 'https://via.placeholder.com/400x300/4361ee/ffffff?text=Recipe'}" alt="${recipe.name}" class="recipe-image"/>
            <div class="recipe-content">
                <h3 class="recipe-name">${recipe.name}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-meta">
                    <span class="recipe-meta-item"><i class="fas fa-clock"></i> ${recipe.totalTime || (recipe.prepTime + recipe.cookTime)} min</span>
                    
                </div>
                <div class="recipe-footer">
                    <span class="recipe-category">${recipe.category}</span>
                    <span class="recipe-difficulty difficulty-${recipe.difficulty}">${recipe.difficulty}</span>
                </div>
            </div>
        `;

        // Add click event to navigate to recipe details
        card.addEventListener('click', () => {
            location.href = `recipeDetails.html?id=${recipe.id}`;
        });

        recipesContainer.appendChild(card);
    });
}

window.filterRecipes = function() {
    const category = document.getElementById("filter-category").value;
    const difficulty = document.getElementById("filter-difficulty").value;
    const time = document.getElementById("filter-time").value;
    const sort = document.getElementById("filter-sort").value;

    let filtered = [...allRecipes];

    if (category) {
        filtered = filtered.filter(r => r.category === category);
    }

    if (difficulty) {
        filtered = filtered.filter(r => r.difficulty === difficulty);
    }

    if (time) {
        const [min, max] = time.split('-').map(Number);
        filtered = filtered.filter(r => {
            const totalTime = r.totalTime || (r.prepTime + r.cookTime);
            if (max) return totalTime >= min && totalTime <= max;
            return totalTime > min;
        });
    }

    if (sort === 'newest') {
        filtered.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
    } else if (sort === 'oldest') {
        filtered.sort((a, b) => a.createdAt?.toMillis() - b.createdAt?.toMillis());
    } else if (sort === 'time-low') {
        filtered.sort((a, b) => (a.totalTime || a.prepTime + a.cookTime) - (b.totalTime || b.prepTime + b.cookTime));
    } else if (sort === 'time-high') {
        filtered.sort((a, b) => (b.totalTime || b.prepTime + b.cookTime) - (a.totalTime || a.prepTime + a.cookTime));
    }

    displayRecipes(filtered);
}

// Add event listeners to filter elements
document.getElementById("filter-category").addEventListener("change", filterRecipes);
document.getElementById("filter-difficulty").addEventListener("change", filterRecipes);
document.getElementById("filter-time").addEventListener("change", filterRecipes);
document.getElementById("filter-sort").addEventListener("change", filterRecipes);

onSnapshot(collection(db, "recipes"), (snapshot) => {
    renderRecipes(snapshot);
});

const logOutBtn = document.getElementById("logOut");
logOutBtn.addEventListener("click", async() => {
    try {
        await signOut(auth);
        location.href = "loginPage.html";
    } catch (error) {
        console.error(error.message);
    }
});