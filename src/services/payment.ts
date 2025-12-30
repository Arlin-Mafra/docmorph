
import { supabase } from '../lib/supabase';

export const PaymentService = {
    /**
     * Process a fake payment and upgrade user account.
     */
    async processFakePayment(userId: string, plan: 'monthly' | 'annual', amount: number) {
        // 1. Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Register Payment in DB
        const { error: payError } = await supabase
            .from('payments')
            .insert({
                user_id: userId,
                amount: amount,
                status: 'paid',
                description: `Premium ${plan} subscription`
            });

        if (payError) throw payError;

        // 3. Update User Profile to Premium
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_pro: true })
            .eq('id', userId);

        if (profileError) throw profileError;

        return { success: true };
    }
};
