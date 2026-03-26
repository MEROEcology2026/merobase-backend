import pool from "../db/index.js";
import { success, error } from "../utils/response.js";

export const getAllSamples = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, sample_id, sample_name, sample_type, project_type,
              kingdom, species, collection_date, collector_name,
              dive_site, created_at, updated_at
       FROM samples ORDER BY created_at DESC`
    );
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

export const getSampleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM samples WHERE sample_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return error(res, "Sample not found", 404);
    }

    return success(res, result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createSample = async (req, res, next) => {
  try {
    const {
      sample_id, sample_name, sample_type, project_type, project_number,
      sample_number, dive_site, collector_name, collection_date,
      latitude, longitude, storage_location, kingdom, genus, family,
      species, depth, temperature, substrate, sample_length,
      morphology, microbiology, molecular, publication
    } = req.body;

    if (!sample_id) {
      return error(res, "sample_id is required", 400);
    }

    const result = await pool.query(
      `INSERT INTO samples (
        sample_id, sample_name, sample_type, project_type, project_number,
        sample_number, dive_site, collector_name, collection_date,
        latitude, longitude, storage_location, kingdom, genus, family,
        species, depth, temperature, substrate, sample_length,
        morphology, microbiology, molecular, publication, created_by
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,
        $16,$17,$18,$19,$20,$21,$22,$23,$24,$25
      ) RETURNING *`,
      [
        sample_id, sample_name, sample_type, project_type, project_number,
        sample_number, dive_site, collector_name, collection_date,
        latitude, longitude, storage_location, kingdom, genus, family,
        species, depth, temperature, substrate, sample_length,
        JSON.stringify(morphology || {}),
        JSON.stringify(microbiology || {}),
        JSON.stringify(molecular || {}),
        JSON.stringify(publication || { links: [] }),
        req.user.id
      ]
    );

    return success(res, result.rows[0], "Sample created", 201);
  } catch (err) {
    next(err);
  }
};

export const updateSample = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      sample_name, sample_type, project_type, project_number,
      sample_number, dive_site, collector_name, collection_date,
      latitude, longitude, storage_location, kingdom, genus, family,
      species, depth, temperature, substrate, sample_length,
      morphology, microbiology, molecular, publication
    } = req.body;

    const result = await pool.query(
      `UPDATE samples SET
        sample_name=$1, sample_type=$2, project_type=$3, project_number=$4,
        sample_number=$5, dive_site=$6, collector_name=$7, collection_date=$8,
        latitude=$9, longitude=$10, storage_location=$11, kingdom=$12,
        genus=$13, family=$14, species=$15, depth=$16, temperature=$17,
        substrate=$18, sample_length=$19, morphology=$20, microbiology=$21,
        molecular=$22, publication=$23, updated_at=NOW()
       WHERE sample_id=$24 RETURNING *`,
      [
        sample_name, sample_type, project_type, project_number,
        sample_number, dive_site, collector_name, collection_date,
        latitude, longitude, storage_location, kingdom, genus, family,
        species, depth, temperature, substrate, sample_length,
        JSON.stringify(morphology || {}),
        JSON.stringify(microbiology || {}),
        JSON.stringify(molecular || {}),
        JSON.stringify(publication || { links: [] }),
        id
      ]
    );

    if (result.rows.length === 0) {
      return error(res, "Sample not found", 404);
    }

    return success(res, result.rows[0], "Sample updated");
  } catch (err) {
    next(err);
  }
};

export const deleteSample = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM samples WHERE sample_id = $1 RETURNING sample_id",
      [id]
    );

    if (result.rows.length === 0) {
      return error(res, "Sample not found", 404);
    }

    return success(res, null, "Sample deleted");
  } catch (err) {
    next(err);
  }
};

export const searchSamples = async (req, res, next) => {
  try {
    const { query, kingdom, project_type, sample_type, start_date, end_date } = req.query;

    let conditions = [];
    let values = [];
    let i = 1;

    if (query) {
      conditions.push(`(
        sample_name ILIKE $${i} OR species ILIKE $${i} OR
        collector_name ILIKE $${i} OR dive_site ILIKE $${i}
      )`);
      values.push(`%${query}%`);
      i++;
    }

    if (kingdom) {
      conditions.push(`kingdom = $${i}`);
      values.push(kingdom);
      i++;
    }

    if (project_type) {
      conditions.push(`project_type = $${i}`);
      values.push(project_type);
      i++;
    }

    if (sample_type) {
      conditions.push(`sample_type = $${i}`);
      values.push(sample_type);
      i++;
    }

    if (start_date && end_date) {
      conditions.push(`collection_date BETWEEN $${i} AND $${i + 1}`);
      values.push(start_date, end_date);
      i += 2;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT id, sample_id, sample_name, sample_type, project_type,
              kingdom, species, collection_date, collector_name, dive_site,
              created_at, updated_at
       FROM samples ${where} ORDER BY created_at DESC`,
      values
    );

    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};