import { auth, db, signOut, onAuthStateChanged, collection, getDocs } from "./firebaseConfigure.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.href = "loginPage.html";
        alert("Please login");
    }
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

// Get recipe ID from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');

if (!recipeId) {
    alert("No recipe selected!");
    location.href = "home.html";
}

async function loadRecipeDetails() {
    try {
        const recipesSnapshot = await getDocs(collection(db, "recipes"));
        let recipe = null;

        recipesSnapshot.forEach((doc) => {
            if (doc.id === recipeId) {
                recipe = { id: doc.id, ...doc.data() };
            }
        });

        if (!recipe) {
            alert("Recipe not found!");
            location.href = "home.html";
            return;
        }


        document.getElementById("recipe-title").textContent = recipe.name;
        document.getElementById("recipe-description").textContent = recipe.description;
        document.getElementById("recipe-image").src = recipe.imageURL || 'https://via.placeholder.com/1000x400/4361ee/ffffff?text=Recipe';
        document.getElementById("recipe-image").alt = recipe.name;


        document.getElementById("recipe-category").innerHTML = `
            <i class="fas fa-utensils"></i>
            <span>${recipe.category}</span>
        `;
        document.getElementById("recipe-difficulty").innerHTML = `
            <i class="fas fa-chart-line"></i>
            <span>${recipe.difficulty}</span>
        `;

        document.getElementById("prep-time").textContent = recipe.prepTime + " min";
        document.getElementById("cook-time").textContent = recipe.cookTime + " min";
        document.getElementById("total-time").textContent = (recipe.totalTime || (recipe.prepTime + recipe.cookTime)) + " min";


        const ingredientsList = document.getElementById("ingredients-list");
        ingredientsList.innerHTML = "";
        recipe.ingredients.forEach((ingredient) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <input type="checkbox" class="ingredient-checkbox">
                <span class="ingredient-text">${ingredient}</span>
            `;
            ingredientsList.appendChild(li);
        });


        const instructionsList = document.getElementById("instructions-list");
        instructionsList.innerHTML = "";
        recipe.instructions.forEach((instruction) => {
            const li = document.createElement("li");
            li.innerHTML = `<p>${instruction}</p>`;
            instructionsList.appendChild(li);
        });

        // Display author info
        document.getElementById("recipe-author").textContent = recipe.createdBy || "Unknown";

        if (recipe.createdAt) {
            const date = recipe.createdAt.toDate ? recipe.createdAt.toDate() : new Date(recipe.createdAt);
            document.getElementById("recipe-date").textContent = "Added on " + date.toLocaleDateString();
        }

    } catch (error) {
        console.error("Error loading recipe:", error);
        alert("Error loading recipe details!");
    }
}

// Load recipe when page loads
loadRecipeDetails();