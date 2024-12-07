import { useQuery } from '@tanstack/react-query';

const useFetch = (key, fetchFunction, options = {}) => {
	const { data, error, isLoading, isError, refetch } = useQuery({
		queryKey: key,
		queryFn: fetchFunction,
		...options,
	});

	return { data, error, isLoading, isError, refetch }; // Asegúrate de devolver refetch aquí
};

export default useFetch;
