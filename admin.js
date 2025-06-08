// Clave de acceso (cambia esto por una clave segura)
const ADMIN_PASSWORD = 'MyD2024';

// Elementos del DOM
const adminLogin = document.getElementById('admin-login');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');

// Verificar si ya está autenticado
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
        showAdminPanel();
    }
}

// Mostrar panel de administración
function showAdminPanel() {
    adminLogin.style.display = 'none';
    adminPanel.style.display = 'block';
    loadRecipes();
}

// Manejar inicio de sesión
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('isAuthenticated', 'true');
        showAdminPanel();
    } else {
        alert('Contraseña incorrecta');
    }
});

// Manejar cierre de sesión
logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('isAuthenticated');
    location.reload();
});

// Función para cargar los platos desde localStorage
function loadRecipes() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const container = document.getElementById('recipes-container');
    container.innerHTML = '';

    recipes.forEach((recipe, index) => {
        const recipeElement = createRecipeElement(recipe, index);
        container.appendChild(recipeElement);
    });
}

// Función para crear un elemento de receta
function createRecipeElement(recipe, index) {
    const article = document.createElement('article');
    article.className = 'recipe-card';
    article.innerHTML = `
        <div class="recipe-image">
            <img src="${recipe.image}" alt="${recipe.name}">
        </div>
        <div class="recipe-content">
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <button class="delete-button" data-index="${index}">Eliminar</button>
        </div>
    `;
    return article;
}

// Función para convertir imagen a Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Función para mostrar vista previa de la imagen
function showImagePreview(file) {
    const preview = document.getElementById('image-preview');
    if (file) {
        getBase64(file).then(base64 => {
            preview.innerHTML = `<img src="${base64}" alt="Vista previa">`;
        });
    } else {
        preview.innerHTML = '<p>Vista previa de la imagen</p>';
    }
}

// Función para añadir una nueva receta
async function addRecipe(event) {
    event.preventDefault();
    
    const name = document.getElementById('recipe-name').value;
    const description = document.getElementById('recipe-description').value;
    const imageFile = document.getElementById('recipe-image').files[0];

    if (!imageFile) {
        alert('Por favor, selecciona una imagen');
        return;
    }

    try {
        const imageBase64 = await getBase64(imageFile);
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push({ 
            name, 
            description, 
            image: imageBase64,
            date: new Date().toISOString()
        });
        localStorage.setItem('recipes', JSON.stringify(recipes));

        // Limpiar el formulario
        event.target.reset();
        document.getElementById('image-preview').innerHTML = '<p>Vista previa de la imagen</p>';
        
        // Recargar las recetas
        loadRecipes();
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        alert('Error al procesar la imagen. Por favor, intenta de nuevo.');
    }
}

// Función para eliminar una receta
function deleteRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    loadRecipes();
}

// Funciones para la ubicación del mapa
function saveMapLocation(lat, lng) {
    localStorage.setItem('mapLocation', JSON.stringify({ lat, lng }));
}

function loadMapLocation() {
    const data = localStorage.getItem('mapLocation');
    if (data) {
        try {
            const { lat, lng } = JSON.parse(data);
            return { lat, lng };
        } catch {
            return null;
        }
    }
    return null;
}

function updateMapPreview(lat, lng) {
    const preview = document.getElementById('map-location-preview');
    if (lat && lng) {
        preview.innerHTML = `<iframe src="https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed" width="100%" height="200" style="border:0; border-radius:10px;" allowfullscreen="" loading="lazy"></iframe>`;
    } else {
        preview.innerHTML = '';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Manejar el formulario de añadir receta
    const addRecipeForm = document.getElementById('add-recipe-form');
    if (addRecipeForm) {
        addRecipeForm.addEventListener('submit', addRecipe);
    }

    // Manejar la vista previa de la imagen
    const imageInput = document.getElementById('recipe-image');
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            showImagePreview(file);
        });
    }

    // Manejar la eliminación de recetas
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const index = event.target.dataset.index;
            deleteRecipe(index);
        }
    });

    // Manejar formulario de ubicación del mapa
    const mapForm = document.getElementById('map-location-form');
    const latInput = document.getElementById('map-lat');
    const lngInput = document.getElementById('map-lng');
    if (mapForm && latInput && lngInput) {
        // Cargar valores actuales si existen
        const loc = loadMapLocation();
        if (loc) {
            latInput.value = loc.lat;
            lngInput.value = loc.lng;
            updateMapPreview(loc.lat, loc.lng);
        }
        mapForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const lat = latInput.value.trim();
            const lng = lngInput.value.trim();
            if (lat && lng) {
                saveMapLocation(lat, lng);
                updateMapPreview(lat, lng);
                alert('¡Ubicación guardada!');
            }
        });
        latInput.addEventListener('input', () => updateMapPreview(latInput.value, lngInput.value));
        lngInput.addEventListener('input', () => updateMapPreview(latInput.value, lngInput.value));
    }
}); 