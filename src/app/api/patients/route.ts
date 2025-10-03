import { NextRequest, NextResponse } from 'next/server';
import { db } from './../../../../lib/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await db.collection('patients').orderBy('createdAt', 'desc').get();
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(patients);
  } catch (err: unknown) {
    console.error(err);
    let message = 'Server error';
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, middleName, lastName, dob, status, address, phone } = body;

    if (!firstName || !lastName || !dob || !address || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await db.collection('patients').add({
      firstName,
      middleName: middleName || null,
      lastName,
      dob,
      phone,
      status,
      address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    let message = 'Server error';
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}