'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import PatientForm from './../PatientForm/PatientForm';
import { Patient } from './../../types/patient';
import { ArrowDropUp, ArrowDropDown, UnfoldMore } from '@mui/icons-material';
import styles from './PatientList.module.css';
import Image from 'next/image';

const PatientList: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Patient; direction: 'asc' | 'desc' } | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        setLoading(true);

        try {
            const res = await fetch('/api/patients');
            const data = await res.json();

            setPatients(data);
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    //apply search and status filters whenever patients/search/filter change
    useEffect(() => {
        //make a copy of the patients array to safely apply filters without mutating state
        let filtered = [...patients];

        //filter by name match (case-insensitive)
        //TO-DO: filter by all different fields 
        if (search) {
            filtered = filtered.filter(p =>
                `${p.firstName} ${p.middleName ?? ''} ${p.lastName}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        //filter by status if a specific status is selected
        if (statusFilter) {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        setFilteredPatients(filtered);
    }, [patients, search, statusFilter]);

    //sort filtered patients when sortConfig changes
    const sortedPatients = useMemo(() => {
        if (!sortConfig) return filteredPatients;

        return [...filteredPatients].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }

            return 0;
        });
    }, [filteredPatients, sortConfig])

    //toggle sort direction or set a new sort key 
    const handleSort = (key: keyof Patient) => {
        setSortConfig(prev =>
            prev && prev.key === key
                ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                : { key, direction: 'asc' }
        );
    };

    //render the appropriate arrow icon for each sortable column
    const getSortIndicator = (key: keyof Patient) => {
        if (!sortConfig || sortConfig.key !== key)
            return <UnfoldMore fontSize="small" className={styles.sortIcon} />;

        return sortConfig.direction === 'asc'
            ? <ArrowDropUp fontSize="medium" className={styles.sortIcon} />
            : <ArrowDropDown fontSize="medium" className={styles.sortIcon} />;
    };

    return (
        <Box p={3}>
            <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h4">Patient Dashboard</Typography>
                <Image
                    src="/flowers.png"
                    alt="flowers"
                    width={42}
                    height={42}
                    className={styles.flowers}
                />
            </Box>
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    label="Search by name"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    variant="outlined"
                    size="small"
                    className={styles.whiteInput}
                />
                <TextField
                    select
                    label="Filter by status"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Inquiry">Inquiry</MenuItem>
                    <MenuItem value="Onboarding">Onboarding</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Churned">Churned</MenuItem>
                </TextField>
                <Button variant="contained" className={styles.purpleButton} onClick={() => setOpenAdd(true)}>
                    Add Patient
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" my={6}>
                    <CircularProgress />
                </Box>
            ) : (
                <div className={styles.tableWrapper}>
                    <Image src="/fox-leaning.png" alt="fox" className={styles.fox} width={64} height={64} />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell onClick={() => handleSort('firstName')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                        First Name {getSortIndicator('firstName')}
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('lastName')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                        Last Name {getSortIndicator('lastName')}
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('dob')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                        DOB {getSortIndicator('dob')}
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('status')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                        Status {getSortIndicator('status')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedPatients.map(p => (
                                    <TableRow key={p.id}>
                                    <TableCell>{p.firstName}</TableCell>
                                    <TableCell>{p.lastName}</TableCell>
                                    <TableCell>{p.dob}</TableCell>
                                    <TableCell>{p.status}</TableCell>
                                    <TableCell>
                                        {p.address.street}, {p.address.city}, {p.address.state} {p.address.zip}
                                    </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
                <DialogTitle>Add Patient</DialogTitle>
                <DialogContent>
                    <PatientForm
                        onAdded={() => {
                        fetchPatients();
                        setOpenAdd(false);
                        }}
                        onClose={() => setOpenAdd(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default PatientList;