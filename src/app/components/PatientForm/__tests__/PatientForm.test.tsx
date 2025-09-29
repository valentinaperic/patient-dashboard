import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PatientForm from '../PatientForm';

describe('PatientForm', () => {
    const onAdded = jest.fn();
    const onClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
    });

    it('renders all form fields', () => {
        render(<PatientForm onAdded={onAdded} onClose={onClose} />);
        expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Middle name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date of birth/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/ZIP \/ Postal code/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Save Patient/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    it('shows error if required fields are missing', async () => {
        const { container } = render(<PatientForm onAdded={onAdded} onClose={onClose} />);
        fireEvent.submit(container.querySelector('form') as HTMLFormElement);
        expect(await screen.findByText(/First name, last name, and date of birth are required/i)).toBeInTheDocument();
    });

    it('shows error if address fields are missing', async () => {
        const { container } = render(<PatientForm onAdded={onAdded} onClose={onClose} />);
        fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/Date of birth/i), { target: { value: '2000-01-01' } });
        fireEvent.submit(container.querySelector('form') as HTMLFormElement);
        expect(await screen.findByText(/Please fill out the full address/i)).toBeInTheDocument();
    });

    it('submits form and calls onAdded and onClose on success', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        render(<PatientForm onAdded={onAdded} onClose={onClose} />);
        fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
        fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/Date of birth/i), { target: { value: '1990-05-05' } });
        fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: '123 Main St' } });
        fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Townsville' } });
        fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'CA' } });
        fireEvent.change(screen.getByLabelText(/ZIP \/ Postal code/i), { target: { value: '90210' } });
        fireEvent.click(screen.getByRole('button', { name: /Save Patient/i }));

        await waitFor(() => {
            expect(onAdded).toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('shows error if API returns error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'API error' }),
        });

        render(<PatientForm onAdded={onAdded} onClose={onClose} />);
        fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
        fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/Date of birth/i), { target: { value: '1990-05-05' } });
        fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: '123 Main St' } });
        fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Townsville' } });
        fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'CA' } });
        fireEvent.change(screen.getByLabelText(/ZIP \/ Postal code/i), { target: { value: '90210' } });
        fireEvent.click(screen.getByRole('button', { name: /Save Patient/i }));

        expect(await screen.findByText(/API error/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
        expect(onAdded).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('disables buttons and shows loading indicator when submitting', async () => {
        let resolveFetch: unknown;
        global.fetch.mockImplementationOnce(() =>
            new Promise(resolve => {
                resolveFetch = resolve;
            })
        );

        const { container } = render(<PatientForm onAdded={onAdded} onClose={onClose} />);
        fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
        fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/Date of birth/i), { target: { value: '1990-05-05' } });
        fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: '123 Main St' } });
        fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Townsville' } });
        fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'CA' } });
        fireEvent.change(screen.getByLabelText(/ZIP \/ Postal code/i), { target: { value: '90210' } });

        // submit programmatically so native validation doesn't block
        fireEvent.submit(container.querySelector('form') as HTMLFormElement);

        expect(screen.getByRole('button', { name: /Saving/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
        // MUI CircularProgress renders with role='progressbar'
        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        // Resolve fetch to finish the test
        resolveFetch({ ok: true, json: async () => ({}) });
        // wait for component to finish its async state updates
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
            expect(onAdded).toHaveBeenCalled();
        });
    });

    it('calls onClose when Cancel is clicked', () => {
        render(<PatientForm onAdded={onAdded} onClose={onClose} />);
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('allows changing status', async () => {
        render(<PatientForm onAdded={onAdded} onClose={onClose} />);
        const statusSelect = screen.getByLabelText(/Status/i);
        // open the MUI Select (it renders a button-like element) then click the option
        fireEvent.mouseDown(statusSelect);
        const activeOption = await screen.findByText('Active');
        fireEvent.click(activeOption);
        // the displayed selected value is the textContent of the select element
        expect(statusSelect.textContent).toBe('Active');
    });
});