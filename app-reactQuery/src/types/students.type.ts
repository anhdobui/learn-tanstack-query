export interface Student {
	id: string
	first_name: string
	last_name: string
	email: string
	gender: string
	country: string
	avatar: string
	btc_address: string
}

export type Students = Pick<Student, 'id' | 'avatar' | 'last_name' | 'email'>[]
