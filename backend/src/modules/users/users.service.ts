import { query } from '../../config/database';

export class UsersService {
  async getAll(branchId: string) {
    const result = await query(
      `SELECT id, email, first_name, last_name, role, avatar_url, is_active, last_login, created_at
       FROM users WHERE branch_id = $1 ORDER BY created_at DESC`,
      [branchId]
    );
    return result.rows.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      role: u.role,
      avatarUrl: u.avatar_url,
      isActive: u.is_active,
      lastLogin: u.last_login,
      createdAt: u.created_at,
    }));
  }

  async getById(id: string) {
    const result = await query(
      `SELECT id, email, first_name, last_name, role, avatar_url, is_active, last_login, created_at, branch_id
       FROM users WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) throw new Error('User not found');
    const u = result.rows[0];
    return {
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      role: u.role,
      avatarUrl: u.avatar_url,
      isActive: u.is_active,
      lastLogin: u.last_login,
      createdAt: u.created_at,
      branchId: u.branch_id,
    };
  }

  async update(id: string, data: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.firstName) { fields.push(`first_name = $${idx++}`); values.push(data.firstName); }
    if (data.lastName) { fields.push(`last_name = $${idx++}`); values.push(data.lastName); }
    if (data.email) { fields.push(`email = $${idx++}`); values.push(data.email); }
    if (data.role) { fields.push(`role = $${idx++}`); values.push(data.role); }
    if (data.isActive !== undefined) { fields.push(`is_active = $${idx++}`); values.push(data.isActive); }
    if (data.pin) { fields.push(`pin = $${idx++}`); values.push(data.pin); }

    if (fields.length === 0) throw new Error('No fields to update');

    values.push(id);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, email, first_name, last_name, role, is_active`,
      values
    );

    if (result.rows.length === 0) throw new Error('User not found');
    const u = result.rows[0];
    return {
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      role: u.role,
      isActive: u.is_active,
    };
  }

  async delete(id: string) {
    const result = await query('UPDATE users SET is_active = false WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) throw new Error('User not found');
    return { message: 'User deactivated successfully' };
  }
}
