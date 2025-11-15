import {
    auth,
    db,
    onAuthStateChanged,
    collection,
    addDoc
} from "./firebaseConfigure.js";

const imgbbApiKey = "b15ef6cc7cf6fead2cf3fa8fe7bad69e";
const recipeForm = document.getElementById("recipe-form");

recipeForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const successEl = document.getElementById("recipe-success");
    const errorEl = document.getElementById("recipe-error");
    const successText = successEl.querySelector("span");
    const errorText = errorEl.querySelector("span");

    successEl.style.display = "none";
    errorEl.style.display = "none";

    const name = document.getElementById("recipe-name").value;
    const description = document.getElementById("recipe-description").value;
    const prepTime = parseInt(document.getElementById("recipe-preptime").value);
    const cookTime = parseInt(document.getElementById("recipe-cooktime").value);

    const category = document.getElementById("recipe-category").value;
    const difficulty = document.getElementById("recipe-difficulty").value;

    const ingredientsText = document.getElementById("recipe-ingredients").value;
    const ingredients = ingredientsText.split('\n').filter(function(item) {
        return item.trim() !== '';
    });

    const instructionsText = document.getElementById("recipe-instructions").value;
    const instructions = instructionsText.split('\n').filter(function(item) {
        return item.trim() !== '';
    });

    const imageFile = document.getElementById("recipe-image").files[0];

    if (!name || !description || !prepTime || !cookTime ||
        !category || !difficulty || ingredients.length === 0 || instructions.length === 0) {
        errorEl.style.display = "block";
        errorText.textContent = "Please fill in all required fields.";
        return;
    }

    try {
        let imageURL = "https://via.placeholder.com/400x300/4361ee/ffffff?text=Recipe";

        if (imageFile) {
            imageURL = await uploadImageToImgBB(imageFile);
        }

        await addDoc(collection(db, "recipes"), {
            name: name,
            description: description,
            prepTime: prepTime,
            cookTime: cookTime,
            totalTime: prepTime + cookTime,
            category: category,
            difficulty: difficulty,
            ingredients: ingredients,
            instructions: instructions,
            imageURL: imageURL,
            createdBy: auth.currentUser.email,
            createdAt: new Date()
        });

        successEl.style.display = "block";
        successText.textContent = "Recipe added successfully!";
        recipeForm.reset();

    } catch (error) {
        console.error("Error:", error);
        errorEl.style.display = "block";
        errorText.textContent = "Error: " + error.message;
    }
});

async function uploadImageToImgBB(file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
        "https://api.imgbb.com/1/upload?key=" + imgbbApiKey, {
            method: "POST",
            body: formData
        }
    );

    const result = await response.json();

    if (result.success) {
        return result.data.url;
    } else {
        throw new Error("Image upload failed");
    }
}

onAuthStateChanged(auth, function(user) {
    const currentUserName = document.getElementById("currentUserName");

    if (user) {
        currentUserName.textContent = user.email;
    } else {
        window.location.href = "loginPage.html";
        alert("Please login");
    }
});