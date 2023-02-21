import { Student, Students } from 'types/students.type'
import http from 'utils/http'

export const getStudents = (page: string | number, limit: string | number, signal?: AbortSignal) =>
	http.get<Students>('students', {
		params: {
			_page: page,
			_limit: limit
		},
		signal
	})
export const getStudent = (id: number | string, signal?: AbortSignal) =>
	http.get<Student>(`students/${id}`, {
		signal
	})
export const addStudent = (body: Omit<Student, 'id'>) => http.post<Student>('students', body)
export const updateStudent = (id: string | number, student: Omit<Student, 'id'>) =>
	http.put<Student>(`students/${id}`, student)
export const deleteStudent = (id: string | number) => http.delete<{}>(`students/${id}`)
