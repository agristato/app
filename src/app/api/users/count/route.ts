import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting user count:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar contagem de usuários' },
        { status: 500 }
      );
    }

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/users/count:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}