# shopping_cart_context.md

## Shopping Cart Recommendation for PhillyPizzaBueno

**Context**:  
- We have a unique menu (pizza halves/thirds, cheesesteaks with grilled vs. fresh veggies, wings with multiple sauce/dip constraints).  
- We need role-based discounts (veterans, first responders, teachers, mall employees, etc.), applied at staff discretion or set percentages.  
- We’re already using **Supabase** for our database and **Stripe** for payments.  
- We want full control over how items, customizations, and orders are managed.

---

## Why a Custom Shopping Cart is Best

### 1. Flexible Item Customization

- **Half/third pizza logic** is not common in generic shopping carts.  
- Cheesesteaks with multi-step customization (bun, grilled veggies, fresh veggies, meats, sauces) also needs a more specialized approach.  
- Storing all this data in **Supabase** (including JSON for customizations) lets us easily expand or adjust.

### 2. Role-Based Discounts

- Staff can apply **veterans / first-responders / teacher / mall employee** discounts.  
- The discount percentage can vary; a staff user might have a direct input field or a selection.  
- Keeping this logic **in-house** avoids fighting with e-commerce libraries that assume fixed discount codes or coupon logic.

### 3. Seamless Database Integration (Supabase)

- We already rely on **Supabase** for user/auth data and dynamic menu info.  
- A custom cart schema (e.g., `cart_items`, `order_items_in_progress`) ties directly into existing tables.  
- We can track which user is staff or admin in the same DB, making role-based logic straightforward.

### 4. Stripe Integration

- **Stripe Checkout** is easy to integrate once we have a clear total and item breakdown in our own code.  
- A single API route (Next.js Route Handler or API route) can:
  1. Validate the user’s cart.  
  2. Calculate the discount, tax, and final total.  
  3. Create a **Stripe Checkout Session**.  
  4. Redirect the user to the Stripe payment page.  
- After payment success, we mark the order as “complete” in Supabase (via a webhook or the success URL).

---

## Potential Implementation Outline

1. **Cart/Orders Data Model**  
   - A `carts` or `orders_in_progress` table referencing each user (or session ID if not logged in).  
   - A `cart_items` or `order_items_in_progress` table with references to menu items, topping JSON, quantity, etc.

2. **Client-Side Management**  
   - Maintain a cart state in a React Context or local store.  
   - Whenever items are added/updated, sync them to Supabase for persistent carts across devices.

3. **Discounts**  
   - A table of discount types (veterans, etc.) or let staff input a custom discount.  
   - If the user is staff, show a discount field to adjust the order total.

4. **Checkout Flow**  
   - On “Checkout,” call a Next.js backend route that compiles the total cost (with discounts).  
   - Create a **Stripe Checkout Session**.  
   - Redirect the user to Stripe.  
   - On Stripe confirmation, set the order to “paid” in Supabase.

5. **Admin/Staff Dashboard**  
   - An interface to view in-progress and completed orders, apply or adjust discounts, manage user roles, etc.

6. **Shopping cart state management**
   - Zustand
   - Local storage

**Bottom Line**: A **fully custom shopping cart** in Next.js, storing data in **Supabase** and using **Stripe** for payments, is the most flexible and robust approach for the specialized PhillyPizzaBueno ordering flow.


---