import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addStudent, getStudent, updateStudent } from 'apis/students.api'
import { useEffect, useMemo, useState } from 'react'
import { useMatch, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Student } from 'types/students.type'
import { isAxiosError } from 'utils/utils'
type FormDataType = Omit<Student, 'id'> | Student
const initialFormData: FormDataType = {
	avatar: '',
	btc_address: '',
	country: '',
	email: '',
	first_name: '',
	gender: 'Other',
	last_name: ''
}
type FromError =
	| {
			[key in keyof FormDataType]: string
	  }
	| null
export default function AddStudent() {
	const [formData, setFormData] = useState<FormDataType>(initialFormData)
	const addMatch = useMatch('/students/add')
	const queryClient = useQueryClient()
	const { id } = useParams()
	const studentQuery = useQuery({
		queryKey: ['student', id],
		queryFn: () => getStudent(id as string),
		staleTime: 5 * 1000,
		enabled: id !== undefined
	})
	useEffect(() => {
		if (studentQuery.data) {
			setFormData(studentQuery.data.data)
		}
	}, [studentQuery.data])
	const addStudentMutation = useMutation({
		mutationFn: (body: FormDataType) => addStudent(body)
	})
	const updateStudentMutation = useMutation({
		mutationFn: (_) => updateStudent(id as string, formData),
		onSuccess: (data) => {
			queryClient.setQueryData(['student', id], data)
		}
	})
	const errorForm: FromError = useMemo(() => {
		const error = Boolean(addMatch) ? addStudentMutation.error : updateStudentMutation.error
		if (isAxiosError<{ error: FromError }>(error) && error.response?.status === 422) {
			return error.response.data.error
		}
		return null
	}, [addStudentMutation.error, addMatch, updateStudentMutation.error])
	const handleChange = (name: keyof FormDataType) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, [name]: e.target.value }))
		if (addStudentMutation.error || addStudentMutation.data) {
			addStudentMutation.reset()
		}
		if (updateStudentMutation.error || updateStudentMutation.data) {
			updateStudentMutation.reset()
		}
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (Boolean(addMatch)) {
			addStudentMutation.mutate(formData, {
				onSuccess: (_) => {
					setFormData(initialFormData)
					toast.success('Thêm mới thành công')
				}
			})
		} else {
			updateStudentMutation.mutate(undefined, {
				onSuccess: () => {
					setFormData(initialFormData)
					toast.success('Cập nhật thành công')
				}
			})
		}
	}
	return (
		<div>
			<h1 className='text-lg'>{addMatch ? 'Add' : 'Edit'} Student</h1>
			<form className='mt-6' onSubmit={handleSubmit}>
				<div className='group relative z-0 mb-6 w-full'>
					<input
						type='text'
						name='email'
						id='email'
						className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
						placeholder=' '
						required
						value={formData.email}
						onChange={handleChange('email')}
					/>
					<label
						htmlFor='email'
						className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
					>
						Email address
					</label>
					{errorForm?.email && (
						<p className='mt-2 text-sm text-red-500'>
							<span className='font-medium'>Lỗi! </span>
							{errorForm.email}
						</p>
					)}
				</div>

				<div className='group relative z-0 mb-6 w-full'>
					<div>
						<div>
							<div className='mb-4 flex items-center'>
								<input
									id='gender-1'
									type='radio'
									name='gender'
									className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
									value='Male'
									checked={formData.gender === 'Male'}
									onChange={handleChange('gender')}
								/>
								<label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
									Male
								</label>
							</div>
							<div className='mb-4 flex items-center'>
								<input
									id='gender-2'
									type='radio'
									name='gender'
									className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
									value='Female'
									checked={formData.gender === 'Female'}
									onChange={handleChange('gender')}
								/>
								<label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
									Female
								</label>
							</div>
							<div className='flex items-center'>
								<input
									id='gender-3'
									type='radio'
									name='gender'
									className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
									value='Other'
									checked={formData.gender === 'Other'}
									onChange={handleChange('gender')}
								/>
								<label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
									Other
								</label>
							</div>
						</div>
					</div>
				</div>
				<div className='group relative z-0 mb-6 w-full'>
					<input
						type='text'
						name='country'
						id='country'
						className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
						placeholder=' '
						required
						value={formData.country}
						onChange={handleChange('country')}
					/>
					<label
						htmlFor='country'
						className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
					>
						Country
					</label>
				</div>
				<div className='grid md:grid-cols-2 md:gap-6'>
					<div className='group relative z-0 mb-6 w-full'>
						<input
							type='tel'
							name='first_name'
							id='first_name'
							className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
							placeholder=' '
							required
							value={formData.first_name}
							onChange={handleChange('first_name')}
						/>
						<label
							htmlFor='first_name'
							className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
						>
							First Name
						</label>
					</div>
					<div className='group relative z-0 mb-6 w-full'>
						<input
							type='text'
							name='last_name'
							id='last_name'
							className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
							placeholder=' '
							required
							value={formData.last_name}
							onChange={handleChange('last_name')}
						/>
						<label
							htmlFor='last_name'
							className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
						>
							Last Name
						</label>
					</div>
				</div>
				<div className='grid md:grid-cols-2 md:gap-6'>
					<div className='group relative z-0 mb-6 w-full'>
						<input
							type='text'
							name='avatar'
							id='avatar'
							className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
							placeholder=' '
							required
							value={formData.avatar}
							onChange={handleChange('avatar')}
						/>
						<label
							htmlFor='avatar'
							className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
						>
							Avatar Base64
						</label>
					</div>
					<div className='group relative z-0 mb-6 w-full'>
						<input
							type='text'
							name='btc_address'
							id='btc_address'
							className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
							placeholder=' '
							required
							value={formData.btc_address}
							onChange={handleChange('btc_address')}
						/>
						<label
							htmlFor='btc_address'
							className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
						>
							BTC Address
						</label>
					</div>
				</div>

				<button
					type='submit'
					className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
				>
					{addMatch ? 'Add' : 'Update'}
				</button>
			</form>
		</div>
	)
}
