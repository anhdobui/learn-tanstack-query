import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudent, getStudents } from 'apis/students.api'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQueryString } from 'utils/utils'
import { toast } from 'react-toastify'
const LIMIT = 10
export default function Students() {
	const param = useQueryString()
	const page = Number(param?.page) || 1
	const queryClient = useQueryClient()
	const studentsPage = useQuery({
		queryKey: ['student', page],
		queryFn: ({ signal }) => {
			const controller = new AbortController()
			setTimeout(() => {
				controller.abort()
			}, 5000)
			return getStudents(page, LIMIT, controller.signal)
		},
		keepPreviousData: true,
		retry: 0
	})
	const deleteStudentMutation = useMutation({
		mutationFn: (id: string | number) => deleteStudent(id),
		onSuccess: (_, id) => {
			toast.success(`Xóa thành công id=${id}`)
			queryClient.invalidateQueries({
				queryKey: ['student', page],
				exact: true
			})
		}
	})
	const totalPage = useMemo(() => {
		return Math.ceil(studentsPage.data?.headers['x-total-count'] / LIMIT) || 0
	}, [studentsPage])
	const handleDelete = (id: string | number) => {
		deleteStudentMutation.mutate(id)
	}
	const handleMouseEnter = (id: string | number) => {
		queryClient.prefetchQuery({
			queryKey: ['student', String(id)],
			queryFn: ({ signal }) => getStudent(id as string, signal),
			staleTime: 10 * 1000
		})
	}
	const handleCancel = () => {
		queryClient.cancelQueries({
			queryKey: ['student', page]
		})
	}
	return (
		<div>
			<h1 className='text-lg'>Students</h1>
			<button
				type='button'
				className='mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
				onClick={(e) => handleCancel()}
			>
				Cancel get api
			</button>
			<div className='mt-4'>
				<Link
					to='/students/add'
					className='mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
				>
					Add
				</Link>
			</div>
			{studentsPage.isLoading && (
				<div role='status' className='mt-6 animate-pulse'>
					<div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
					<span className='sr-only'>Loading...</span>
				</div>
			)}
			{!studentsPage.isLoading && (
				<div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
					<table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
						<thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
							<tr>
								<th scope='col' className='py-3 px-6'>
									#
								</th>
								<th scope='col' className='py-3 px-6'>
									Avatar
								</th>
								<th scope='col' className='py-3 px-6'>
									Name
								</th>
								<th scope='col' className='py-3 px-6'>
									Email
								</th>
								<th scope='col' className='py-3 px-6'>
									<span className='sr-only'>Action</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{studentsPage.data &&
								studentsPage.data.data.map((student) => (
									<tr
										onMouseEnter={(e) => handleMouseEnter(student.id)}
										key={student.id}
										className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
									>
										<td className='py-4 px-6'>{student.id}</td>
										<td className='py-4 px-6'>
											<img src={student.avatar} alt='student' className='h-5 w-5' />
										</td>
										<th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 '>
											{student.last_name}
										</th>
										<td className='py-4 px-6'>{student.email}</td>
										<td className='py-4 px-6 text-right'>
											<Link
												to={`/students/${student.id}`}
												className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
											>
												Edit
											</Link>
											<button
												className='font-medium text-red-600 dark:text-red-500'
												onClick={(e) => handleDelete(student.id)}
											>
												Delete
											</button>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}

			<div className='mt-6 flex justify-center'>
				<nav aria-label='Page navigation example'>
					<ul className='inline-flex -space-x-px'>
						<li>
							{page > 1 ? (
								<Link
									to={`/students?page=${page - 1}`}
									className=' rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
								>
									Previous
								</Link>
							) : (
								<span className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
									Previous
								</span>
							)}
						</li>
						<li>
							{Array(totalPage)
								.fill(0)
								.map((_, index) => {
									const pageIndex = index + 1
									const isActive = Boolean(pageIndex === page)
									return (
										<Link
											key={pageIndex}
											className={classNames(
												'border border-gray-300  py-2 px-3 leading-tight text-gray-500   hover:bg-gray-100 hover:text-gray-700',
												{
													'bg-gray-100 text-gray-700': isActive,
													'bg-white ': !isActive
												}
											)}
											to={`/students?page=${pageIndex}`}
										>
											{pageIndex}
										</Link>
									)
								})}
						</li>
						<li>
							{page < totalPage ? (
								<Link
									className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
									to={`/students?page=${page + 1}`}
								>
									Next
								</Link>
							) : (
								<span className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
									Next
								</span>
							)}
						</li>
					</ul>
				</nav>
			</div>
		</div>
	)
}
