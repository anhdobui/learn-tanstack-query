import axios, { AxiosError } from 'axios'
import { useSearchParams } from 'react-router-dom'

export const useQueryString = () => {
	const [searchParams] = useSearchParams()
	const param = Object.fromEntries([...searchParams])
	return param
}
export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
	return axios.isAxiosError(error)
}
