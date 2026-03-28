const Brand = require('../models/Brand');
const Product = require('../models/Product');
const slugify = require('slugify');

// @desc    Create a brand
// @route   POST /api/brands
exports.createBrand = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true, strict: true });
        }
        const brand = await Brand.create(req.body);
        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all brands
// @route   GET /api/brands
exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json({ success: true, count: brands.length, data: brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single brand by slug
// @route   GET /api/brands/:slug
exports.getBrandBySlug = async (req, res) => {
    try {
        const brand = await Brand.findOne({ slug: req.params.slug });
        if (!brand) return res.status(404).json({ message: "Brand not found" });

        res.status(200).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update brand
// @route   PATCH /api/brands/:id
exports.updateBrand = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true, strict: true });
        }
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: brand });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:id
exports.deleteBrand = async (req, res) => {
    try {
        // Optional: Check if products are still linked to this brand before deleting
        const productsLinked = await Product.countDocuments({ brand: req.params.id });
        if (productsLinked > 0) {
            return res.status(400).json({
                message: "Cannot delete brand. It is linked to existing products."
            });
        }

        await Brand.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Brand deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};