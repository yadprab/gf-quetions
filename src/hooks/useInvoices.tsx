import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi } from '../services/invoicesApi';
import type { Invoice, InvoiceStatus } from '../types/invoice';

export const useInvoices = () => {
	const queryClient = useQueryClient();

	const invoicesQuery = useQuery<Invoice[]>({
		queryKey: ['invoices'],
		queryFn: invoicesApi.fetch,
	});

	const updateStatus = useMutation({
		mutationFn: ({
			id,
			status,
			comment,
		}: {
			id: string;
			status: InvoiceStatus;
			comment?: string;
		}) => invoicesApi.updateStatus(id, status, comment),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['invoices'] });
		},
	});

	return { ...invoicesQuery, updateStatus };
};
