'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Patient, Address, STATUS_OPTIONS, Status } from '../../types/patient';

type PatientFormProps = {
    onAdded: () => void;
    onClose: () => void;
};

//only deal with Patient data for form, no need for extra fluff
type PatientFormState = Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>;

export default function PatientForm({ onAdded, onClose }: PatientFormProps) {
    const [form, setForm] = useState<PatientFormState>({
        firstName: '',
        middleName: '',
        lastName: '',
        dob: '',
        status: 'Inquiry',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zip: ''
        } as Address
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * update form state for all fields
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            //remove non-digit characters
            const digits = value.replace(/\D/g, '');

            //format as XXX-XXX-XXXX
            let formatted = digits; 
            if (digits.length > 3 && digits.length <= 6) {
                formatted = `${digits.slice(0,3)}-${digits.slice(3)}`;
            } else if (digits.length > 6) {
                formatted = `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6,10)}`;
            }

            setForm(f => ({ ...f, phone: formatted }));
            return;
        }

        if (['street', 'city', 'state', 'zip'].includes(name)) {
            setForm(f => ({
                ...f,
                address: { ...f.address, [name]: value } as Address, 
            }));
        } else if (name === 'status') {
            setForm(f => ({ ...f, status: value as Status }))
        } else {
            setForm(f => ({ ...f, [name]: value }))
        }
    };



    /**
     * validates the form, sends a POST request to create a patient
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { street, city, state, zip } = form.address;

        if (!form.firstName || !form.lastName || !form.dob) {
            setError('First name, last name, and date of birth are required.');
            return;
        }

        if (!street || !city || !state || !zip) {
            setError('Please fill out the full address.');
            return;
        }

        if (!form.phone) {
            setError('Phone number is required');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...form,
                middleName: form.middleName || undefined,
            };

            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json?.error ?? 'Failed to add patient');

            onAdded();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to add patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField name="firstName" label="First name" value={form.firstName} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField name="middleName" label="Middle name" value={form.middleName} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField name="lastName" label="Last name" value={form.lastName} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        name="dob"
                        label="Date of birth"
                        type="date"
                        value={form.dob}
                        onChange={handleChange}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        name="phone" 
                        label="Phone Number" 
                        value={form.phone} 
                        onChange={handleChange} 
                        fullWidth 
                        required 
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField name="street" label="Street" value={form.address.street} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField name="city" label="City" value={form.address.city} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField name="state" label="State" value={form.address.state} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField name="zip" label="ZIP / Postal code" value={form.address.zip} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        name="status"
                        label="Status"
                        select
                        value={form.status}
                        onChange={handleChange}
                        fullWidth
                        required
                    >
                        {STATUS_OPTIONS.map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}     
                    </TextField>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : undefined}
                >
                    {loading ? 'Saving…' : 'Save Patient'}
                </Button>
            </Box>
        </Box>
    )
}