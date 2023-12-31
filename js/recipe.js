let recipeForm = document.getElementById('recipe-form');
let recipeName = document.getElementById('recipe-name');
let ingredients = document.getElementById('ingredients');
let instruction = document.getElementById('instruction');
let displayArea = document.getElementById('display-area');
let recipeContainer = document.getElementById('recipe-container');
let recipes = [];

// GET API URL
const recipesData = 'http://127.0.0.1:8000/recipes/'

// Function to fetch all recipes from API
const getRecipesData = async () => {
    try {
        const fetchedData = await fetch(recipesData);
        if (!fetchedData.ok) {
            throw new Error("HTTP error " + fetchedData.status);
        }
        const response = await fetchedData.json();
        return response;
    } catch (error) {
        console.error('Error: ', error.message);
    }
};

// Load recipes from API on recipe page
window.addEventListener('load', function() {
    getRecipesData().then(data => {
        data.forEach(recipe => {
            displayRecipe(recipe);
        });
        }).catch(err => {
            alert('rejected', err);
        });
    });

function displayRecipe(recipe) {
    // Create the card div element
    let cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.style.width = '18rem';

    // Create the image element (assuming displayArea contains a valid image URL)
    let imgElement = document.createElement('img');
    imgElement.src = recipe.image; // Assuming displayArea contains the image URL
    imgElement.className = 'card-img-top';
    imgElement.alt = `Image displays the ${recipe.name}'s dish`;

    // Create the card body div element
    let cardBodyDiv = document.createElement('div');
    cardBodyDiv.className = 'card-body';

    // Create the card title (recipe name) element
    let cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = recipe.name;

    // Create the card text (recipe instruction) element
    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = recipe.instruction;

    // Create Remove button element
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-outline-danger');
    deleteButton.innerText = 'Remove';

    // DELETE recipe functionality
    deleteButton.addEventListener('click', async function() {
        const deleteRecipeURL = `${recipesData}${recipe.id}`;

        await fetch(deleteRecipeURL, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    alert('Recipe deleted successfully!');
                } else {
                    alert('Failed to delete the recipe.');
                }
            })
            .catch((error) => {
                console.error('Error:', error.message);
                alert('Failed to delete the recipe.');
            });
    });

    // Create edit button element
    let editButton = document.createElement('button');
    editButton.classList.add('btn');
    editButton.classList.add('btn-outline-warning');
    editButton.setAttribute('data-toggle', 'modal');
    editButton.setAttribute('data-target', '#exampleModalCenter');
    editButton.innerText = 'Edit';

    // UPDATE recipe functionality
    editButton.onclick = function(){
        let modalHtml = `
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit your recipe</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="x-close-button"></button>
                    </div>
                    <div class="modal-body">
                        <form id="modal-recipe-form" action="">
                            <label style="color: black;">Recipe Name:</label>
                            <input type="text" class="form-control" id="modal-recipe-name" placeholder="${recipe.name}">
                            <label style="color: black;">Ingredients:</label>
                            <textarea class="form-control" id="modal-ingredients" placeholder="${recipe.ingredients}"></textarea>
                            <label style="color: black;">Instruction:</label>
                            <textarea class="form-control" id="modal-instruction" placeholder="${recipe.instruction}"></textarea>
                            <label style="color: black;">Image URL:</label>
                            <input type="URL" class="form-control" id="modal-display-area" placeholder="${recipe.image}"></input>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="modal-close-button">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="modal-save-button">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
      `;
        // Append the modal HTML to the document body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('modal-save-button').addEventListener('click', async function () {
            // Get the edited values from the modal's input fields
            let editedRecipeName = document.getElementById('modal-recipe-name').value;
            let editedIngredients = document.getElementById('modal-ingredients').value;
            let editedInstruction = document.getElementById('modal-instruction').value;
            let editedImageUrl = document.getElementById('modal-display-area').value;

            // Use the initial data as a fallback if the fields are empty
            editedRecipeName = editedRecipeName.trim() || recipe.name;
            editedIngredients = editedIngredients
                ? editedIngredients.split(',').map(item => item.trim())
                : recipe.ingredients; // Preserve default if empty
            editedInstruction = editedInstruction.trim() || recipe.instruction;
            editedImageUrl = editedImageUrl.trim() || recipe.image;

            // Update the recipe in the recipes array
            const updatedRecipe = {
                id: recipe.id,
                name: editedRecipeName,
                ingredients: editedIngredients,
                instruction: editedInstruction,
                image: editedImageUrl
            };
        
            const updateRecipeURL = `${recipesData}${recipe.id}`;

            await fetch(updateRecipeURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRecipe)
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Recipe updated successfully!');
                    } else {
                        alert('Failed to update the recipe.1');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error.message);
                    alert('Failed to update the recipe.');
                });
            });
        
        document.getElementById('modal-close-button').addEventListener('click', function () {
            let elementToRemove = document.getElementById('exampleModal');
            document.body.removeChild(elementToRemove);
        });

        document.getElementById('x-close-button').addEventListener('click', function () {
            let elementToRemove = document.getElementById('exampleModal');
            document.body.removeChild(elementToRemove);
        });

        // Create and show the modal using Bootstrap Modal API
        let myModal = new bootstrap.Modal(document.getElementById("exampleModal"));
        myModal.show();
    };

    // Append elements to build the card structure
    cardBodyDiv.appendChild(cardTitle);
    cardBodyDiv.appendChild(cardText);
    cardBodyDiv.appendChild(deleteButton);
    cardBodyDiv.appendChild(editButton);
    cardDiv.appendChild(imgElement);
    cardDiv.appendChild(cardBodyDiv);

    // Append the card to the displayArea (assuming displayArea is a div element)
    recipeContainer.appendChild(cardDiv);
};

// ADD new recipe to database
recipeForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get form input values
    const recipeName = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('ingredients').value.split(',').map(item => item.trim());
    const instruction = document.getElementById('instruction').value;
    const image = document.getElementById('display-area').value;

    // Create a new recipe object
    const newRecipe = {
        name: recipeName,
        ingredients: ingredients,
        instruction: instruction,
        image: image
    };

    // Send a POST request to add the new recipe
    try {
        const response = await fetch(recipesData, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecipe)
        });

        if (response.ok) {
            alert('Recipe added successfully!');
            // Clear the form
            recipeForm.reset();
        } else {
            alert('Failed to add the recipe.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


