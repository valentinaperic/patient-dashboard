import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import PatientList from '../PatientList';

const mockPatients = [
  {
    id: '1',
    firstName: 'Jane',
    middleName: '',
    lastName: 'Doe',
    dob: '1990-01-01',
    status: 'Active',
    address: { street: '1 Main', city: 'Town', state: 'NY', zip: '12345' },
  },
  {
    id: '2',
    firstName: 'John',
    middleName: 'X',
    lastName: 'Smith',
    dob: '1985-05-05',
    status: 'Inquiry',
    address: { street: '2 Oak', city: 'City', state: 'CA', zip: '67890' },
  },
];

describe('PatientList', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPatients),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await act(async () => {
      await Promise.resolve();
    });
  });

  it('renders loading spinner first', async () => {
    render(<PatientList />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  });

  it('displays fetched patients in table', async () => {
    render(<PatientList />);
    expect(await screen.findByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
  });

  it('filters patients by search', async () => {
    render(<PatientList />);
    await screen.findByText('Jane');

    fireEvent.change(screen.getByLabelText(/Search by name/i), {
      target: { value: 'Smith' },
    });

    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });

  it('filters patients by status', async () => {
    render(<PatientList />);
    
    await screen.findByText('Jane');

    const statusSelect = screen.getByLabelText(/Filter by status/i);
    userEvent.click(statusSelect);

    const activeOption = await screen.findByRole('option', { name: 'Active' });
    userEvent.click(activeOption);
    
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('sorts by first name when header clicked', async () => {
    render(<PatientList />);
    await screen.findByText('Jane');

    fireEvent.click(screen.getByText(/First Name/i));
    const firstCells = screen.getAllByRole('cell', { name: /Jane|John/ });
    expect(firstCells[0]).toHaveTextContent('Jane');

    fireEvent.click(screen.getByText(/First Name/i));
    const newFirstCells = screen.getAllByRole('cell', { name: /Jane|John/ });
    expect(newFirstCells[0]).toHaveTextContent('John');
  });
});
