import { createClient } from '@supabase/supabase-js';

// ...existing code...

const checkAuthStatus = async () => {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return { isAuthenticated: !!session };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { isAuthenticated: false };
  }
};

export { 
  handlePlanSelection,
  validateStripeConfig,
  checkAuthStatus
};