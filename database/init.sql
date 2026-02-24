-- ============================================
-- POS Restaurant - Database Schema
-- Multi-branch ready, scalable structure
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- BRANCHES (Sucursales)
-- ============================================
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    tax_id VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'MXN',
    timezone VARCHAR(50) DEFAULT 'America/Mexico_City',
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USERS & ROLES
-- ============================================
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'cashier', 'waiter');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    role user_role NOT NULL DEFAULT 'waiter',
    avatar_url VARCHAR(500),
    pin VARCHAR(6),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_branch ON categories(branch_id);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    sku VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 16.00,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    preparation_time INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_branch ON products(branch_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);

-- ============================================
-- PRODUCT VARIANTS
-- ============================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'size', 'extra', 'option'
    price_modifier DECIMAL(10,2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ============================================
-- TABLES (Mesas)
-- ============================================
CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved', 'maintenance');

CREATE TABLE restaurant_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    name VARCHAR(50),
    capacity INTEGER DEFAULT 4,
    status table_status DEFAULT 'available',
    zone VARCHAR(50),
    position_x DECIMAL(5,2) DEFAULT 0,
    position_y DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(branch_id, number)
);

CREATE INDEX idx_tables_branch ON restaurant_tables(branch_id);
CREATE INDEX idx_tables_status ON restaurant_tables(status);

-- ============================================
-- ORDERS
-- ============================================
CREATE TYPE order_status AS ENUM ('open', 'in_progress', 'ready', 'delivered', 'paid', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'mixed', 'other');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    table_id UUID REFERENCES restaurant_tables(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    cashier_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_number SERIAL,
    status order_status DEFAULT 'open',
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tip_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    payment_method payment_method,
    payment_reference VARCHAR(100),
    cash_received DECIMAL(10,2),
    change_amount DECIMAL(10,2),
    notes TEXT,
    customer_name VARCHAR(100),
    customer_count INTEGER DEFAULT 1,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_branch ON orders(branch_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 16.00,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- ORDER ITEM VARIANTS (selected variants)
-- ============================================
CREATE TABLE order_item_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    variant_name VARCHAR(100) NOT NULL,
    price_modifier DECIMAL(10,2) DEFAULT 0
);

-- ============================================
-- INVENTORY
-- ============================================
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 5,
    max_stock DECIMAL(10,2) DEFAULT 100,
    unit VARCHAR(20) DEFAULT 'units',
    last_restock_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(branch_id, product_id)
);

CREATE INDEX idx_inventory_branch ON inventory(branch_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);

-- ============================================
-- INVENTORY MOVEMENTS
-- ============================================
CREATE TYPE movement_type AS ENUM ('sale', 'restock', 'adjustment', 'waste', 'transfer');

CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type movement_type NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    previous_stock DECIMAL(10,2),
    new_stock DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_movements_inventory ON inventory_movements(inventory_id);
CREATE INDEX idx_movements_type ON inventory_movements(type);

-- ============================================
-- DAILY CASH REGISTER
-- ============================================
CREATE TABLE cash_registers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    opening_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    closing_amount DECIMAL(10,2),
    expected_amount DECIMAL(10,2),
    difference DECIMAL(10,2),
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_cash DECIMAL(10,2) DEFAULT 0,
    total_card DECIMAL(10,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'open'
);

-- ============================================
-- SEED DATA
-- ============================================

-- Default branch
INSERT INTO branches (id, name, address, phone, email, tax_id) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sucursal Principal', 'Av. Reforma 123, CDMX', '+52 55 1234 5678', 'principal@restaurant.com', 'RFC123456789');

-- Default admin user (password: admin123)
INSERT INTO users (id, branch_id, email, password_hash, first_name, last_name, role, pin) VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@restaurant.com', '$2b$10$YourHashHere', 'Admin', 'Sistema', 'admin', '0000');

-- Sample categories
INSERT INTO categories (branch_id, name, description, icon, color, sort_order) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Entradas', 'Appetizers and starters', 'utensils', '#F59E0B', 1),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Platos Fuertes', 'Main dishes', 'beef', '#EF4444', 2),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Bebidas', 'Drinks and beverages', 'coffee', '#3B82F6', 3),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Postres', 'Desserts', 'cake', '#EC4899', 4),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ensaladas', 'Fresh salads', 'leaf', '#10B981', 5),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sopas', 'Soups', 'soup', '#8B5CF6', 6);

-- Sample tables
INSERT INTO restaurant_tables (branch_id, number, name, capacity, zone, position_x, position_y) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'Mesa 1', 4, 'Interior', 1, 1),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'Mesa 2', 4, 'Interior', 2, 1),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3, 'Mesa 3', 2, 'Interior', 3, 1),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4, 'Mesa 4', 6, 'Interior', 1, 2),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, 'Mesa 5', 4, 'Terraza', 2, 2),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 6, 'Mesa 6', 8, 'Terraza', 3, 2),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 7, 'Mesa 7', 2, 'Barra', 1, 3),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 8, 'Mesa 8', 2, 'Barra', 2, 3),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 9, 'VIP 1', 10, 'VIP', 3, 3),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 10, 'VIP 2', 12, 'VIP', 1, 4);

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tables_updated_at BEFORE UPDATE ON restaurant_tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
