import { query } from '../../config/database';

export class CategoriesService {
  async getAll(branchId: string) {
    const result = await query(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
       WHERE c.branch_id = $1 AND c.is_active = true
       GROUP BY c.id
       ORDER BY c.sort_order, c.name`,
      [branchId]
    );
    return result.rows.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      icon: c.icon,
      color: c.color,
      sortOrder: c.sort_order,
      productCount: parseInt(c.product_count),
      isActive: c.is_active,
    }));
  }

  async create(branchId: string, data: any) {
    const result = await query(
      `INSERT INTO categories (branch_id, name, description, icon, color, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [branchId, data.name, data.description, data.icon, data.color, data.sortOrder || 0]
    );
    return result.rows[0];
  }

  async update(id: string, data: any) {
    const result = await query(
      `UPDATE categories SET name = COALESCE($1, name), description = COALESCE($2, description),
       icon = COALESCE($3, icon), color = COALESCE($4, color), sort_order = COALESCE($5, sort_order)
       WHERE id = $6 RETURNING *`,
      [data.name, data.description, data.icon, data.color, data.sortOrder, id]
    );
    if (result.rows.length === 0) throw new Error('Category not found');
    return result.rows[0];
  }

  async delete(id: string) {
    const result = await query('UPDATE categories SET is_active = false WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) throw new Error('Category not found');
    return { message: 'Category deleted successfully' };
  }
}
