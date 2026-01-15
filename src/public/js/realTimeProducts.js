const socket = io();

function renderProducts(products) {
    const productList = document.getElementById('products-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <strong>${product.title}</strong>
            <p>${product.description}</p>
            <div class="price">$ ${product.price}</div>
            <p>Stock: ${product.stock}</p>
            <button class="delete-btn" data-id="${product.id}">Eliminar</button>
        `;
        productList.appendChild(div);
    });
}

socket.on('updateProducts', (products) => {
    renderProducts(products);
});

const createForm = document.getElementById('create-product-form');

createForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(createForm);
    const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        category: formData.get('category'),
    };

    try {
        await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        createForm.reset();

    } catch (error) {
        console.error("Error al crear producto:", error);
    }
});

document.getElementById('products-list').addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const productId = e.target.getAttribute('data-id');

        try {
            await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
});