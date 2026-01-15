const { Router } = require('express');
const productModel = require('../dao/models/product.model.js');

const router = Router();

router.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        let filter = {};
        if (query) {
            if (query === 'true' || query === 'false') {
                filter.status = query === 'true';
            } else {
                filter.category = query;
            }
        }

        let options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true
        };

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }
        let result = await productModel.paginate(filter, options);
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null
        };

        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', message: 'Error al obtener productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productModel.findById(pid);

        if (!product) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
        res.send({ status: 'success', payload: product });

    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await productModel.create(productData);

        res.status(201).send({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;
        const result = await productModel.updateOne({ _id: pid }, updateData);

        if (result.matchedCount === 0) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }

        const updatedProduct = await productModel.findById(pid);
        res.send({ status: 'success', payload: updatedProduct });

    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al actualizar producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productModel.deleteOne({ _id: pid });

        if (result.deletedCount === 0) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }

        res.send({ status: 'success', message: 'Producto eliminado' });

    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al eliminar producto' });
    }
});

module.exports = router;