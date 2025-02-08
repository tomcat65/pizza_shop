-- Reset database (if needed)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMs
CREATE TYPE user_role AS ENUM ('client', 'staff', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE item_size AS ENUM ('personal', 'regular', 'family', 'small', 'large');
CREATE TYPE topping_quantity AS ENUM ('light', 'normal', 'extra');

-- Create tables
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT,
  role user_role DEFAULT 'client',
  store_id UUID REFERENCES stores(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  preparation_time INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE item_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES items(id),
  size item_size NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, size)
);

CREATE TABLE toppings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_modifier DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE item_toppings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES items(id),
  topping_id UUID REFERENCES toppings(id),
  is_default BOOLEAN DEFAULT false,
  default_quantity topping_quantity DEFAULT 'normal',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, topping_id)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  store_id UUID REFERENCES stores(id),
  status order_status DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  discount_id UUID,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  item_id UUID REFERENCES items(id),
  size item_size NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_item_toppings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID REFERENCES order_items(id),
  topping_id UUID REFERENCES toppings(id),
  quantity topping_quantity DEFAULT 'normal',
  price_modifier DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial data
INSERT INTO stores (name, address, city, state, zip, phone, email) VALUES
('PhillyPizzaBueno', '1455 Franklin Mills Circle, RM 852A, Orange Entrance #5', 'Philadelphia', 'PA', '19154', '(215) 610-0873', 'info@phillypizzabueno.com');

INSERT INTO categories (name, description, sort_order) VALUES
('Pizzas', 'Our signature pizzas made with fresh ingredients', 1);

-- Insert base pizzas
INSERT INTO items (category_id, name, description, base_price) VALUES
((SELECT id FROM categories WHERE name = 'Pizzas'), 'Cheese Pizza', 'Classic pizza with our signature sauce and mozzarella cheese', 10.99),
((SELECT id FROM categories WHERE name = 'Pizzas'), '3-Cheese Pizza', 'A blend of mozzarella, provolone, and parmesan cheese', 12.99);

-- Insert pizza sizes with proper type casting
INSERT INTO item_sizes (item_id, size, price) 
SELECT id, 'personal'::item_size, 10.99 FROM items WHERE name = 'Cheese Pizza'
UNION ALL
SELECT id, 'regular'::item_size, 14.99 FROM items WHERE name = 'Cheese Pizza'
UNION ALL
SELECT id, 'family'::item_size, 18.99 FROM items WHERE name = 'Cheese Pizza'
UNION ALL
SELECT id, 'personal'::item_size, 12.99 FROM items WHERE name = '3-Cheese Pizza'
UNION ALL
SELECT id, 'regular'::item_size, 16.99 FROM items WHERE name = '3-Cheese Pizza'
UNION ALL
SELECT id, 'family'::item_size, 20.99 FROM items WHERE name = '3-Cheese Pizza';

-- Insert toppings
INSERT INTO toppings (name, category, price_modifier) VALUES
('Pepperoni', 'meat', 2.50),
('Italian Sausage', 'meat', 2.50),
('Mushrooms', 'veggie', 1.50),
('Green Peppers', 'veggie', 1.50),
('Onions', 'veggie', 1.50),
('Black Olives', 'veggie', 1.50),
('Extra Cheese', 'cheese', 2.00),
('Original Pizza Sauce', 'sauce', 0.00),
('BBQ Sauce', 'sauce', 0.50),
('Buffalo Sauce', 'sauce', 0.50);

-- Enable Row Level Security on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_toppings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Store policies
CREATE POLICY "Anyone can view store info"
  ON stores FOR SELECT
  USING (active = true);

-- User policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Staff can view all users"
  ON users FOR SELECT
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' IN ('staff', 'admin'));

-- Menu policies
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can view active menu items"
  ON items FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can view active item sizes"
  ON item_sizes FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can view active toppings"
  ON toppings FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can view active item toppings"
  ON item_toppings FOR SELECT
  USING (active = true);

-- Order policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all orders"
  ON orders FOR SELECT
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' IN ('staff', 'admin'));

CREATE POLICY "Staff can update any order"
  ON orders FOR UPDATE
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' IN ('staff', 'admin'));

-- Order items policies
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can create order items for their orders"
  ON order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_id
    AND orders.user_id = auth.uid()
    AND orders.status = 'pending'
  ));

CREATE POLICY "Staff can view all order items"
  ON order_items FOR SELECT
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' IN ('staff', 'admin'));

-- Order item toppings policies
CREATE POLICY "Users can view their own order item toppings"
  ON order_item_toppings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM order_items
    JOIN orders ON orders.id = order_items.order_id
    WHERE order_items.id = order_item_toppings.order_item_id
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can create toppings for their order items"
  ON order_item_toppings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM order_items
    JOIN orders ON orders.id = order_items.order_id
    WHERE order_items.id = order_item_id
    AND orders.user_id = auth.uid()
    AND orders.status = 'pending'
  ));

CREATE POLICY "Staff can view all order item toppings"
  ON order_item_toppings FOR SELECT
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' IN ('staff', 'admin')); 