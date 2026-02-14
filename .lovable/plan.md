

## Fix: Orders Failing on Published Site

### Problem
When customers visit the published site (deshi-honey-flow.lovable.app), they cannot place orders. The database rejects inserts with "row-level security policy violation" errors for both the `orders` and `abandoned_carts` tables. This only happens on the published/live site -- the preview works fine.

### Root Cause
The RLS (Row-Level Security) policies that allow anonymous order creation exist in the test database but are not properly applied in the live database. The live environment is blocking all inserts from non-authenticated users.

### Solution
Create a new database migration that safely re-applies the correct INSERT policies for public-facing tables. This uses `DROP POLICY IF EXISTS` followed by `CREATE POLICY` to guarantee the policies exist regardless of current state. Once published, these will be applied to the live database.

### What Will Change

**New database migration** that re-applies these policies:
- `orders` table: Allow anyone to INSERT (public checkout)
- `abandoned_carts` table: Allow anyone to INSERT (cart tracking)
- `visitor_analytics` table: Allow anyone to INSERT (analytics tracking)
- `rate_limits` table: Allow anyone to INSERT (rate limit tracking)

**No code changes needed** -- the frontend code is correct. The issue is purely a database configuration mismatch between test and live environments.

### Technical Details

The migration SQL will be:

```text
-- Re-apply public INSERT policies to ensure they exist in live

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Anyone can insert abandoned carts" ON public.abandoned_carts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.visitor_analytics;
CREATE POLICY "Anyone can insert analytics" ON public.visitor_analytics FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Rate limits are publicly insertable" ON public.rate_limits;
CREATE POLICY "Rate limits are publicly insertable" ON public.rate_limits FOR INSERT WITH CHECK (true);
```

### After Implementation
After approving this plan, you will need to **publish** the project so the migration runs on the live database. Once published, orders will work on the published site for all users and devices.

