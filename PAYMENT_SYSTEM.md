# 📝 Manual Payment Management System

## Overview

Payments are managed **manually** by admins and super admins. There is no automatic payment gateway integration. Admins record payments directly in the system and update student payment status.

---

## Payment Flow

### 1. Student Enrollment

- Student registers for a course
- Initial payment status: `unpaid`
- Student can view course details but cannot access exams until payment is confirmed

### 2. Payment Collection (Offline/Local)

Admin collects payment via:

- Cash
- Bank Transfer
- Card (POS)
- Other methods

### 3. Payment Recording (By Admin)

Admin logs into system and:

1. Goes to student management
2. Finds the student
3. Records payment details:
   - Amount paid
   - Payment method
   - Reference number (optional)
   - Notes (optional)
4. Updates student payment status to `paid`

### 4. Payment Confirmation

- Student can now access exams
- Payment record is stored in database
- Admin who recorded payment is tracked

---

## Database Schema

### Payments Table Structure

```sql
payments (
  id                UUID (Primary Key)
  student_id        UUID (Foreign Key → students)
  amount            DECIMAL(10, 2)
  payment_method    TEXT ('cash', 'bank_transfer', 'card', 'other')
  reference         TEXT (Optional - manual reference)
  notes             TEXT (Admin notes)
  recorded_by       UUID (Foreign Key → admins)
  paid_at           TIMESTAMP
  created_at        TIMESTAMP
)
```

### Students Table

```sql
students (
  ...
  payment_status    TEXT ('paid', 'unpaid', 'partial')
  ...
)
```

---

## Admin Functions

### Record a Payment

```typescript
import { createClient } from "@/lib/supabase/client";

async function recordPayment({
  studentId,
  amount,
  paymentMethod,
  reference,
  notes,
  adminId,
}) {
  const supabase = createClient();

  // 1. Create payment record
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      student_id: studentId,
      amount: amount,
      payment_method: paymentMethod,
      reference: reference || null,
      notes: notes || null,
      recorded_by: adminId,
      paid_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (paymentError) throw paymentError;

  // 2. Update student payment status
  const { error: updateError } = await supabase
    .from("students")
    .update({ payment_status: "paid" })
    .eq("id", studentId);

  if (updateError) throw updateError;

  return payment;
}
```

### Update Student Payment Status

```typescript
async function updatePaymentStatus(
  studentId: string,
  status: "paid" | "unpaid" | "partial"
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("students")
    .update({ payment_status: status })
    .eq("id", studentId);

  if (error) throw error;
}
```

### View Student Payments

```typescript
async function getStudentPayments(studentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      admin:admins!recorded_by(name, email)
    `
    )
    .eq("student_id", studentId)
    .order("paid_at", { ascending: false });

  return { data, error };
}
```

---

## Permission Levels

### Student

- ✅ Can view own payment records
- ❌ Cannot create/edit payment records
- ✅ Can see payment status

### Admin

- ✅ Can view all payment records
- ✅ Can create new payment records
- ✅ Can update payment records
- ✅ Can update student payment status
- ❌ Cannot delete payment records

### Super Admin

- ✅ All admin permissions
- ✅ Can delete payment records
- ✅ Can edit any payment information

---

## UI Components Needed

### Admin Dashboard - Payment Recording Form

```typescript
interface PaymentFormData {
  studentId: string;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "card" | "other";
  reference?: string;
  notes?: string;
}
```

### Student Dashboard - Payment History

Shows:

- Payment date
- Amount paid
- Payment method
- Reference number
- Current payment status

---

## Benefits of Manual System

✅ **No Payment Gateway Fees**: Save on transaction costs  
✅ **Flexible Payment Methods**: Accept any payment type  
✅ **Local Control**: Full control over payment process  
✅ **Simple Integration**: No complex API integrations  
✅ **Audit Trail**: Track who recorded each payment

---

## Security Considerations

1. **RLS Policies**: Enforced at database level
2. **Admin Authentication**: Only authenticated admins can record payments
3. **Audit Trail**: Every payment records which admin created it
4. **No Direct Student Updates**: Students cannot modify payment status
5. **Super Admin Oversight**: Only super admins can delete payments

---

## Example Payment Methods

| Method            | Use Case                      |
| ----------------- | ----------------------------- |
| **Cash**          | Direct cash payment at office |
| **Bank Transfer** | Online/offline bank transfer  |
| **Card**          | POS machine payment           |
| **Other**         | Mobile money, checks, etc.    |

---

## Future Enhancements (Optional)

- Payment receipts generation (PDF)
- SMS/Email notifications on payment confirmation
- Partial payment tracking
- Payment installment plans
- Payment reminders

---

**Implementation Status**: ✅ Complete  
**Last Updated**: October 21, 2025
