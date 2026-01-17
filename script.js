document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".products-grid");
  const searchInput = document.getElementById("searchInput");
  const loadingText = document.getElementById("loadingText");
  const favoritesFilter = document.getElementById("favoritesFilter");

  let allProducts = [];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


  let debounceTimer;

  async function fetchProducts() {
    loadingText.hidden = false;

  try {
      const response = await fetch("https://dummyjson.com/products?limit=20");
          if (!response.ok) throw new Error("Network error");

    const data = await response.json();
     allProducts = data.products;
    renderProducts(allProducts);
    } catch (error) {
      loadingText.textContent = "Failed to load products.";
    } finally {

      loadingText.hidden = true;


    }
  }

  function renderProducts(products) {
    grid.innerHTML = "";
    const fragment = document.createDocumentFragment();

       products.forEach(product => {
        const isFavorite = favorites.includes(product.id);

      const article = document.createElement("article");
      article.className = "product-card";

      article.innerHTML = `
        <img src="${product.thumbnail}" alt="Product image of ${product.title}">
         <h3>${product.title}</h3>
         <p>$${product.price}</p>
         <small>${product.category}</small>
     <button 
          class="favorite-btn ${isFavorite ? "active" : ""}" 
          data-id="${product.id}"
          
          aria-pressed="${isFavorite}">
          ${isFavorite ? "Favorited" : "Add to Favorites"}

     </button>
        <button class="buy-btn">Buy</button>
      `;

      fragment.appendChild(article);
    });

    grid.appendChild(fragment);
  }

    function applyFilters() {
      let filtered = [...allProducts];

      const searchValue = searchInput.value.toLowerCase();
      if (searchValue) {
        filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchValue) );
    }

    if (favoritesFilter.checked) {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }

    renderProducts(filtered);
  }

  grid.addEventListener("click", e => {
    if (!e.target.classList.contains("favorite-btn")) return;

    const id = Number(e.target.dataset.id);
    const isActive = favorites.includes(id);

    favorites = isActive
       ? favorites.filter(f => f !== id)
      : [...favorites, id];

    localStorage.setItem("favorites", JSON.stringify(favorites));
    applyFilters();
  });

  searchInput.addEventListener("input", () => {
     clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 300);
  });

  favoritesFilter.addEventListener("change", applyFilters);

  fetchProducts();
});
