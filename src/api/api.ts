import { ApiResponse, User } from './interfaces';

export const fetchUsers = async (currentPage: number): Promise<User[]> => {
  try {
    const response = await fetch(
      `https://frontend-test-middle.vercel.app/api/users?page=${currentPage}&limit=50`
    );
    const data: ApiResponse = await response.json();
    return data.data; // Возвращаем список пользователей
  } catch (error) {
    console.error('Ошибка загрузки данных: ', error);
    return [];
  }
};
