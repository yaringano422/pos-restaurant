import { query } from '../../config/database';

export class ProductsService {
  async getAll(branchId: string, categoryId?: string) {
    let sql = `
      SELECT p.*, c.name as category_name,
        COALESCE(
          json_agg(
            json_build_object('id', pv.id, 'name', pv.name, 'type', pv.type, 'priceModifier', pv.price_modifier)
          ) FILTER (WHERE pv.id IS NOT NULL), '[]'
        ) as variants
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_available = true
      WHERE p.branch_id = $1 AND p.is_active = true
    `;
    const params: any[] = [branchId];

    if (categoryId) {
      sql += ` AND p.category_id = $2`;
      params.push(categoryId);
    }

    sql += ` GROUP BY p.id, c.name ORDER BY p.sort_order, p.name`;

    const result = await query(sql, params);
    return result.rows.map(p => ({
      id: p.id,
      categoryId: p.category_id,
      categoryName: p.category_name,
      name: p.name,
      description: p.description,
      sku: p.sku,
      price: parseFloat(p.price),
      cost: parseFloat(p.cost),
      taxRate: parseFloat(p.tax_rate),
      imageUrl: p.image_url,
      isAvailable: p.is_available,
      preparationTime: p.preparation_time,
      variants: p.variants,
    }));
  }

  async getById(id: string) {
    const result = await query(
      `SELECT p.*, c.name as category_name FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.id = $1`,
      [id]
    );
    if (result.rows.length === 0) throw new Error('Product not found');

    const variants = await query(
      'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY sort_order',
      [id]
    );

    const p = result.rows[0];
    return {
      id: p.id,
      categoryId: p.category_id,
      categoryName: p.category_name,
      name: p.name,
      description: p.description,
      sku: p.sku,
      price: parseFloat(p.price),
      cost: parseFloat(p.cost),
      taxRate: parseFloat(p.tax_rate),
      imageUrl: p.image_url,
      isAvailable: p.is_available,
      preparationTime: p.preparation_time,
      variants: variants.rows,
    };
  }

  async create(branchId: string, data: any) {
    const result = await query(
      `INSERT INTO products (branch_id, category_id, name, description, sku, price, cost, tax_rate, image_url, preparation_time, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [branchId, data.categoryId, data.name, data.description, data.sku, data.price, data.cost || 0,
       data.taxRate || 16, data.imageUrl, data.preparationTime || 0, data.sortOrder || 0]
    );

    // Create inventory entry
    await query(
      `INSERT INTO inventory (branch_id, product_id, current_stock, min_stock)
       VALUES ($1, $2, $3, $4)`,
      [branchId, result.rows[0].id, data.initialStock || 0, data.minStock || 5]
    );

    // Create variants if provided
    if (data.variants && data.variants.length > 0) {
      for (const v of data.variants) {
        await query(
          `INSERT INTO product_variants (product_id, name, type, price_modifier, sort_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [result.rows[0].id, v.name, v.type, v.priceModifier || 0, v.sortOrder || 0]
        );
      }
    }

    return this.getById(result.rows[0].id);
  }

  async update(id: string, data: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const fieldMap: Record<string, string> = {
      categoryId: 'category_id', name: 'name', description: 'description',
      sku: 'sku', price: 'price', cost: 'cost', taxRate: 'tax_rate',
      imageUrl: 'image_url', isAvailable: 'is_available', preparationTime: 'preparation_time',
      sortOrder: 'sort_order',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        fields.push(`${col} = $${idx++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) throw new Error('No fields to update');

    values.push(id);
    await query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${idx}`, values);

    return this.getById(id);
  }

  async delete(id: string) {
    const result = await query('UPDATE products SET is_active = false WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) throw new Error('Product not found');
    return { message: 'Product deleted successfully' };
  }
}
