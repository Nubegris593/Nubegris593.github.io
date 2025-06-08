// Smooth scrolling para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Manejo del formulario de contacto
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Aquí puedes agregar la lógica para enviar los datos a un servidor
        console.log('Datos del formulario:', data);
        
        // Mostrar mensaje de éxito
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        this.reset();
    });
}

// Animación del botón CTA
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        document.querySelector('#acerca').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Efecto de aparición al hacer scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar todas las secciones
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Función para verificar si el dispositivo está autorizado
function checkAdminAccess() {
    const adminKey = localStorage.getItem('adminKey');
    const adminSection = document.getElementById('admin-menu');
    
    if (!adminKey) {
        // Si no hay clave, mostrar el botón de acceso
        const accessButton = document.createElement('button');
        accessButton.className = 'admin-access-button';
        accessButton.innerHTML = 'Acceso Administrador';
        accessButton.onclick = () => {
            const key = prompt('Ingrese la clave de administrador:');
            if (key === 'MyD2024') { // Clave fija para este dispositivo
                localStorage.setItem('adminKey', 'true');
                location.reload();
            } else {
                alert('Clave incorrecta');
            }
        };
        adminSection.innerHTML = '';
        adminSection.appendChild(accessButton);
    }
}

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

// Función para añadir una nueva receta
function addRecipe(event) {
    event.preventDefault();
    
    const name = document.getElementById('recipe-name').value;
    const description = document.getElementById('recipe-description').value;
    const image = document.getElementById('recipe-image').value;

    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push({ name, description, image });
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Limpiar el formulario
    event.target.reset();
    
    // Recargar las recetas
    loadRecipes();
}

// Función para eliminar una receta
function deleteRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    loadRecipes();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Verificar acceso de administrador
    checkAdminAccess();
    
    // Cargar recetas al iniciar
    loadRecipes();

    // Manejar el formulario de añadir receta
    const addRecipeForm = document.getElementById('add-recipe-form');
    if (addRecipeForm) {
        addRecipeForm.addEventListener('submit', addRecipe);
    }

    // Manejar la eliminación de recetas
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const index = event.target.dataset.index;
            deleteRecipe(index);
        }
    });
});

// Animaciones innovadoras al hacer scroll
function animateOnScroll() {
    const animatedEls = document.querySelectorAll('.animated, .fade-in-up, .fade-in-left, .fade-in-right, .zoom-in');
    const observer = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    animatedEls.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Carrusel de menú manual
function initMenuCarousel() {
    // Obtener recetas (de localStorage o las 3 por defecto)
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [
        {
            name: 'Plato Especial',
            description: 'Descubre nuestra receta más popular con ingredientes frescos y sabores únicos.',
            image: 'https://via.placeholder.com/300x200',
        },
        {
            name: 'Postre Casero',
            description: 'Un delicioso postre que conquistará a todos tus invitados.',
            image: 'https://via.placeholder.com/300x200',
        },
        {
            name: 'Entrada Gourmet',
            description: 'Una entrada elegante y fácil de preparar para cualquier ocasión.',
            image: 'https://via.placeholder.com/300x200',
        }
    ];
    let current = 0;
    const slide = document.getElementById('carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    function renderCard(idx) {
        if (!slide) return;
        const recipe = recipes[idx];
        slide.innerHTML = `<article class="recipe-card fade-in-up visible">
            <div class="recipe-image">
                <img src="${recipe.image}" alt="${recipe.name}">
            </div>
            <div class="recipe-content">
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
            </div>
        </article>`;
    }

    function showPrev() {
        current = (current - 1 + recipes.length) % recipes.length;
        renderCard(current);
    }
    function showNext() {
        current = (current + 1) % recipes.length;
        renderCard(current);
    }

    if (prevBtn && nextBtn) {
        prevBtn.onclick = showPrev;
        nextBtn.onclick = showNext;
    }
    renderCard(current);

    // Si las recetas cambian dinámicamente, actualizar el carrusel
    window.updateMenuCarousel = function() {
        recipes = JSON.parse(localStorage.getItem('recipes')) || recipes;
        if (current >= recipes.length) current = 0;
        renderCard(current);
    };
}
document.addEventListener('DOMContentLoaded', initMenuCarousel);
// Si se agregan recetas dinámicamente, llama a window.updateMenuCarousel() después de guardar 