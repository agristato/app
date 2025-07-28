import { User, SurveyResults } from '@/types/survey';

export const api = {
  async createUser(email: string): Promise<User | null> {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar usuário');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUserResults(userId: string, results: SurveyResults): Promise<User | null> {
    try {
      const response = await fetch(`/api/users/${userId}/survey`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar resultados');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user results:', error);
      throw error;
    }
  },

  async getUserCount(): Promise<number> {
    try {
      const response = await fetch('/api/users/count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar contagem');
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error getting user count:', error);
      throw error;
    }
  },
};