

## Problem

The order submission fails on the published site with the error "অর্ডার জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" (Order submission failed. Try again.)

## Root Cause

The `submit-order` backend function was **never deployed**. The backend logs show zero calls ever made to this function. When a customer clicks "অর্ডার কনফার্ম করুন" (Confirm Order), the app tries to call the `submit-order` function, but since it doesn't exist in production, it fails and shows the error alert.

## Solution

1. **Deploy the `submit-order` edge function** - This is the primary fix. The function code already exists and works correctly (tested and confirmed). It just needs to be deployed.

2. **Improve error handling** - Replace the generic `alert()` with a more user-friendly toast notification that shows the actual error message from the server (when available), helping debug future issues.

## Technical Details

- The function code at `supabase/functions/submit-order/index.ts` is fully functional (verified by direct testing - it successfully created order NH-2026-000012).
- The fix requires deploying the function and optionally improving the error UX in `src/components/landing/OrderForm.tsx` (line 211) to replace `alert()` with a toast notification.

