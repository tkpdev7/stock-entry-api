const { Router } = require('express');
const pool = require('../index');
const router = Router();

router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM production_metrics', (err, result) => {
    if (err) return next(err);
    res.json(result.rows);
  });
});

router.get('/:id', (req, res, next) => {
  pool.query('SELECT * FROM production_metrics WHERE id = $1', [req.params.id], (err, result) => {
    if (err) return next(err);
    res.json(result.rows[0]);
  });
});

router.post('/', (req, res, next) => {
  const {
    product_name, raw_batch_code, grinding_batch, grinding_date,
    input_quantity_kg, output_quantity_kg, seiving_rejection_kg,
    wastage_kg, other_rejection_kg, person_incharge, product_type
  } = req.body;

  const query = `
    INSERT INTO production_metrics (
      product_name, raw_batch_code, grinding_batch, grinding_date,
      input_quantity_kg, output_quantity_kg, seiving_rejection_kg,
      wastage_kg, other_rejection_kg, person_incharge, product_type
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *;
  `;

  pool.query(query, [
    product_name, raw_batch_code, grinding_batch, grinding_date,
    input_quantity_kg, output_quantity_kg, seiving_rejection_kg,
    wastage_kg, other_rejection_kg, person_incharge, product_type
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
  const query = `UPDATE production_metrics SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`;

  pool.query(query, values, (err, result) => {
    if (err) return next(err);
    res.json(result.rows[0]);
  });
});

router.delete('/:id', (req, res, next) => {
  pool.query('DELETE FROM production_metrics WHERE id = $1 RETURNING *', [req.params.id], (err, result) => {
    if (err) return next(err);
    res.json(result.rows[0]);
  });
});

module.exports = router;
