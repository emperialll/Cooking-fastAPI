let recipeForm = document.getElementById('recipe-form');
let recipeName = document.getElementById('recipe-name');
let ingredients = document.getElementById('ingredients');
let instruction = document.getElementById('instruction');
let displayArea = document.getElementById('display-area');
let recipeContainer = document.getElementById('recipe-container');
let recipes = [];

// Load recipes from localStorage on page load
window.addEventListener('load', function() {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        recipes = JSON.parse(storedRecipes);
        recipes.forEach(function(recipe) {
            displayRecipe(recipe);
        });
    }
});

function displayRecipe(recipe) {
    // Create the card div element
    let cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.style.width = '18rem';

    // Create the image element (assuming displayArea contains a valid image URL)
    let imgElement = document.createElement('img');
    imgElement.src = recipe.displayArea; // Assuming displayArea contains the image URL
    imgElement.className = 'card-img-top';
    imgElement.alt = `Image displays the ${recipe.recipeName}'s dish`;

    // Create the card body div element
    let cardBodyDiv = document.createElement('div');
    cardBodyDiv.className = 'card-body';

    // Create the card title (recipe name) element
    let cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = recipe.recipeName;

    // Create the card text (recipe instruction) element
    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = recipe.instruction;

    // Create Remove button element
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-outline-danger');
    deleteButton.innerText = 'Remove';
    deleteButton.addEventListener('click', function() {
        deleteRecipe(recipes.indexOf(recipe)); // Pass the index of the recipe to delete
    });

    // Create edit button element
    let editButton = document.createElement('button');
    editButton.classList.add('btn');
    editButton.classList.add('btn-outline-warning');
    editButton.setAttribute('data-toggle', 'modal');
    editButton.setAttribute('data-target', '#exampleModalCenter');
    editButton.innerText = 'Edit';
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
                            <input type="text" class="form-control" id="modal-recipe-name" placeholder="${recipe.recipeName}">
                            <label style="color: black;">Ingredients:</label>
                            <textarea class="form-control" id="modal-ingredients" placeholder="${recipe.ingredients}"></textarea>
                            <label style="color: black;">Instruction:</label>
                            <textarea class="form-control" id="modal-instruction" placeholder="${recipe.instruction}"></textarea>
                            <label style="color: black;">Image URL:</label>
                            <input type="URL" class="form-control" id="modal-display-area" placeholder="${recipe.displayArea}"></input>
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

        document.getElementById('modal-save-button').addEventListener('click', function () {
            // Get the edited values from the modal's input fields
            let editedRecipeName = document.getElementById('modal-recipe-name').value;
            let editedIngredients = document.getElementById('modal-ingredients').value;
            let editedInstruction = document.getElementById('modal-instruction').value;
            let editedDisplayArea = document.getElementById('modal-display-area').value;

            // Use the initial data as a fallback if the fields are empty
            editedRecipeName = editedRecipeName.trim() || recipe.recipeName;
            editedIngredients = editedIngredients.trim() || recipe.ingredients;
            editedInstruction = editedInstruction.trim() || recipe.instruction;
            editedDisplayArea = editedDisplayArea.trim() || recipe.displayArea;
        
            // Update the recipe in the recipes array
            recipe.recipeName = editedRecipeName;
            recipe.ingredients = editedIngredients;
            recipe.instruction = editedInstruction;
            recipe.displayArea = editedDisplayArea;
        
            // Save the updated recipes to localStorage
            localStorage.setItem('recipes', JSON.stringify(recipes));
        
            // Close the modal
            let myModal = new bootstrap.Modal(document.getElementById("exampleModal"));
            myModal.hide();
        
            // Clear the recipe container
            recipeContainer.innerHTML = "";
        
            // Display all recipes again after editing
            recipes.forEach(function (recipe) {
                displayRecipe(recipe);
            });
            let elementToRemove = document.getElementById('exampleModal');
            document.body.removeChild(elementToRemove);
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
    // editButton.addEventListener('click', function() {
    //     editRecipe(recipes.indexOf(recipe)); // Pass the index of the recipe to edit
    // });

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

recipeForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let enteredRecipeName = recipeName.value;
    let enteredIngredients = ingredients.value;
    let enteredInstruction = instruction.value;
    let enteredDisplayArea = displayArea.value;

    let newRecipe = {
        recipeName: enteredRecipeName,
        ingredients: enteredIngredients,
        instruction: enteredInstruction,
        displayArea: enteredDisplayArea
    };
    recipes.push(newRecipe);

    // Save recipes to localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    recipeName.value = "";
    ingredients.value = "";
    instruction.value = "";
    displayArea.value = "";

    displayRecipe(newRecipe);
});

function deleteRecipe(index) {
    // Remove the recipe from the array
    recipes.splice(index, 1);

    // Update localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Clear the recipe container
    recipeContainer.innerHTML = "";

    // Display all recipes again after deletion
    recipes.forEach(function(recipe) {
        displayRecipe(recipe);
    });
};

function editRecipe(index) {  
};







