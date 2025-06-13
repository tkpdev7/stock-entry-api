const { Router } = require('express');
const pool = require('../index');
const router = Router();

router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM grinding_indicators', (err, result) => {
    if (err) return next(err);
    res.json(result.rows);
  });
});

router.get('/:id', (req, res, next) => {
  pool.query('SELECT * FROM grinding_indicators WHERE id = $1', [req.params.id], (err, result) => {
    if (err) return next(err);
    res.json(result.rows[0]);
  });
});

router.post('/', (req, res, next) => {
  const {
    product_name, raw_batch_code, input_quantity_kg, mill_rpm,
    vibrator_speed_rate, inlet_temperature, outlet_temperature,
    nitrogen_cylinder_reading, nitrogen_pressure_reading, mill_start_time,
    mill_end_time, output_quantity,output_quality, wastage_quantity, finess_percentage,
    entry_datetime, person_incharge, powder_batch_code
  } = req.body;

  const query = `
    INSERT INTO grinding_indicators (
      product_name, raw_batch_code, input_quantity_kg, mill_rpm,
      vibrator_speed_rate, inlet_temperature, outlet_temperature,
      nitrogen_cylinder_reading, nitrogen_pressure_reading, mill_start_time,
      mill_end_time, output_quantity,output_quality, wastage_quantity, finess_percentage,
      entry_datetime, person_incharge, powder_batch_code
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18
    ) RETURNING *;
  `;

  pool.query(query, [
    product_name, raw_batch_code, input_quantity_kg, mill_rpm,
    vibrator_speed_rate, inlet_temperature, outlet_temperature,
    nitrogen_cylinder_reading, nitrogen_pressure_reading, mill_start_time,
    mill_end_time, output_quantity,output_quality, wastage_quantity, finess_percentage,
    entry_datetime, person_incharge, powder_batch_code
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
  const query = `UPDATE grinding_indicators SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`;

  pool.query(query, values, (err, result) => {
    if (err) return next(err);
    res.json(result.rows[0]);
  });
});

router.delete('/:id', (req, res, next) => {
  pool.query('DELETE FROM grinding_indicators WHERE id = $1 RETURNING *', [req.params.id], (err, result) => {
    if (err) return next(err);
    res.json(result.rows[0]);
  });
});

module.exports = router;
