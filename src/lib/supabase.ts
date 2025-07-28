import { createClient } from '@supabase/supabase-js';
import { User, SurveyResults } from '@/types/survey';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createUser(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        // User already exists, return existing user
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('email', email)
          .single();
        
        return existingUser;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function updateUserResults(userId: string, results: SurveyResults): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ results })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user results:', error);
    return false;
  }
}