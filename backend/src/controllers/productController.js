const Product = require('../models/Product');
const Brand = require('../models/Brand');
const slugify = require('slugify');

// @desc    Create new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        if (req.body.name) {
            req.body.slug = slugify(req.body.name, { lower: true, strict: true });
        }
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all products (with filters)
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const { categories, brands, priceRange, sort, status } = req.query;
        console.log(req.query);

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;
        const skip = (page - 1) * limit;

        let query = {};

        if (categories) {
            const categoryArray = categories.split(',');
            query.categories = { $in: categoryArray };
        }

        if (status) query.status = status;

        if (brands) {
            const brandSlugs = brands.split(',');
            // 1. Find the Brand IDs corresponding to these slugs
            const brandDocs = await Brand.find({ slug: { $in: brandSlugs } });
            const brandIds = brandDocs.map(b => b._id);

            // 2. Filter products by those IDs
            query.brand = { $in: brandIds };
        }

        if (priceRange) {
            const ranges = priceRange.split(','); // Handles multiple ranges if needed
            let priceQuery = [];

            ranges.forEach(range => {
                if (range === '1000+') {
                    priceQuery.push({ price: { $gte: 1000 } });
                } else {
                    const [min, max] = range.split('-').map(Number);
                    priceQuery.push({ price: { $gte: min, $lte: max } });
                }
            });

            if (priceQuery.length > 0) {
                query.$or = priceQuery; // Matches products in any of the selected ranges
            }
        }

        let sortQuery = { createdAt: -1 };
        if (sort === 'az') sortQuery = { name: 1 };
        if (sort === 'za') sortQuery = { name: -1 };
        if (sort === 'oldest') sortQuery = { createdAt: 1 };
        if (sort === 'priceLow') sortQuery = { price: 1 };
        if (sort === 'priceHigh') sortQuery = { price: -1 };

        const products = await Product.find(query)
            .populate('brand')
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: products
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
exports.getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate('brand');
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update product
// @route   PATCH /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        if (req.body.name) {
            req.body.slug = slugify(req.body.name, { lower: true, strict: true });
        }
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};