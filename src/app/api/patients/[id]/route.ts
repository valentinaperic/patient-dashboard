import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebaseAdmin';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Missing patient id' }, { status: 400 });

  try {
    const updates = await req.json();
    updates.updatedAt = new Date().toISOString();
    await db.collection('patients').doc(id).update(updates);
    const updatedDoc = await db.collection('patients').doc(id).get();
    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err: unknown) {
    console.error(err);
    let message = 'Server error';
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Missing patient id' }, { status: 400 });

  try {
    await db.collection('patients').doc(id).update({ isDeleted: true, updatedAt: new Date().toISOString() });
    return NextResponse.json({ id, deleted: true });
  } catch (err: unknown) {
    console.error(err);
    let message = 'Server error';
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
