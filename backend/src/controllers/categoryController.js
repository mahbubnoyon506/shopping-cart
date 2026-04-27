const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('slugify');

// @desc    Create a category
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
    try {
        const title = req.body.title || req.body.name;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        // Generate slug
        const slug = slugify(title, { lower: true, strict: true });

        // Check if title or slug already exists
        const existingCategory = await Category.findOne({
            $or: [
                { slug },
                { title },
                { name: title }
            ]
        });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "A category with this title already exists"
            });
        }

        const categoryData = {
            title,
            name: title,
            slug,
            description: req.body.description,
            featured: req.body.featured,
            image: req.body.image
        };

        const category = await Category.create(categoryData);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.log("Category creation..", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "A category with this name or slug already exists."
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all categories with dynamic product counts
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        // Optional: Update product counts dynamically before sending
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const count = await Product.countDocuments({ categories: cat.title });
            return { ...cat._doc, productCount: count };
        }));

        res.status(200).json({ success: true, data: categoriesWithCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
exports.getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update category
// @route   PATCH /api/categories/:id
exports.updateCategory = async (req, res) => {
    try {
        const title = req.body.title || req.body.name;
        if (title) {
            req.body.title = title;
            req.body.name = title;
            req.body.slug = slugify(title, { lower: true, strict: true });
        }

        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};