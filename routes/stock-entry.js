const { Router } = require('express');
const pool = require('../index');
const router = Router();

// GET all stock entries
router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM stock_entries', (err, result) => {
        if (err) return next(err);
        res.json(result.rows);
    });
});

// GET one stock entry by ID
router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    pool.query('SELECT * FROM stock_entries WHERE id = $1', [id], (err, result) => {
        if (err) return next(err);
        res.json(result.rows[0]);
    });
});

// POST (create) stock entry
router.post('/', (req, res, next) => {
    const {
        product_name, product_code, total_quantity, supplier_name,
        supplier_address, supplier_phone_no, supplier_gst, rate_per_kg,
        total_price_wo_gst, gst_amount, total_invoice_amount,
        no_of_bag_box, raw_batch_code, received_by, moisture_reading,
        total_qty_received, received_datetime, stock_entry_date,
        shortage_excess
    } = req.body;

    const query = `
        INSERT INTO stock_entries (
            product_name, product_code, total_quantity, supplier_name,
            supplier_address, supplier_phone_no, supplier_gst, rate_per_kg,
            total_price_wo_gst, gst_amount, total_invoice_amount,
            no_of_bag_box, raw_batch_code, received_by, moisture_reading,
            total_qty_received, received_datetime, stock_entry_date,
            shortage_excess
        ) VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11,
            $12, $13, $14, $15,
            $16, $17, $18,
            $19
        ) RETURNING *;
    `;

    const values = [
        product_name, product_code, total_quantity, supplier_name,
        supplier_address, supplier_phone_no, supplier_gst, rate_per_kg,
        total_price_wo_gst, gst_amount, total_invoice_amount,
        no_of_bag_box, raw_batch_code, received_by, moisture_reading,
        total_qty_received, received_datetime, stock_entry_date,
        shortage_excess
    ];

    pool.query(query, values, (err, result) => {
        if (err) return next(err);
        res.status(201).json({ message: 'Success', entry: result.rows[0] });
    });
});

// PUT (update) stock entry
router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    const updates = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(req.body)) {
        if (value !== undefined) {
            updates.push(`${key} = $${i}`);
            values.push(value);
            i++;
        }
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    const query = `UPDATE stock_entries SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`;
    values.push(id);

    pool.query(query, values, (err, result) => {
        if (err) return next(err);
        res.json({ message: 'Updated successfully', entry: result.rows[0] });
    });
});

// DELETE stock entry
router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
    pool.query('DELETE FROM stock_entries WHERE id = $1 RETURNING *', [id], (err, result) => {
        if (err) return next(err);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully', deleted: result.rows[0] });
    });
});

module.exports = router;
