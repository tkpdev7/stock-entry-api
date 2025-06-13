const { Router } = require('express');
const pool = require('../index');
const router = Router();

router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM packaging_entries', (err, result) => {
    if (err) return next(err);
    res.json(result.rows);
  });
});

router.get('/:id', (req, res, next) => {
  pool.query('SELECT * FROM packaging_entries WHERE id = $1', [req.params.id], (err, result) => {
    if (err) return next(err);
    res.json(result.rows[0]);
  });
});

router.post('/', (req, res, next) => {
  const {
    packing_date, powder_batch_code, product_name, product_type,
    packet_weight, packet_qty, weight_in_gm, weight_in_kg, packet_type
  } = req.body;

  const query = `
    INSERT INTO packaging_entries (
      packing_date, powder_batch_code, product_name, product_type,
      packet_weight, packet_qty, weight_in_gm, weight_in_kg, packet_type
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;
  `;

  pool.query(query, [
    packing_date, powder_batch_code, product_name, product_type,
    packet_weight, packet_qty, weight_in_gm, weight_in_kg, packet_type
  ], (err, result) => {
    if (err) return next(err);
    res.status(201).json(result.rows[0]);
  });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const updates = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(req.body)) {
    if (value !== undefined) {
      updates.push(`${key} = $${i++}`);
      values.push(value);
    }
  }

  values.push(id);
  const query = `UPDATE packaging_entries SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`;

  pool.query(query, values, (err, result) => {
    if (err) return next(err);
    res.json(result.rows[0]);
  });
});

router.delete('/:id', (req, res, next) => {
  pool.query('DELETE FROM packaging_entries WHERE id = $1 RETURNING *', [req.params.id], (err, result) => {
    if (err) return next(err);
    res.json(result.rows[0]);
  });
});

module.exports = router;
