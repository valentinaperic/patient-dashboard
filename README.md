# Patient Dashboard

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).  
It is a **React + TypeScript** application for managing patient information with forms, validations, and dynamic status selection.  
The UI is built with [Material UI (MUI)](https://mui.com/) and it uses **Firebase** as the backend database.

<img width="1860" height="603" alt="Patient list view" src="https://github.com/user-attachments/assets/0697701e-972b-4a80-a393-fa31c4356342" />
<img width="1860" height="785" alt="Patient form view" src="https://github.com/user-attachments/assets/976f7eb4-a58d-4e14-aeb4-10d5f182ceb3" />

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/patient-dashboard.git
cd patient-dashboard
npm install
```

## Firebase Setup

This project uses **Firebase** for the database (Cloud Firestore) and optional authentication.

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Cloud Firestore** for storing patient data.
3. (Optional) Enable **Authentication** if you want to secure access.
4. Copy your Firebase config and create a file at `src/firebase/config.ts`:

```ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
```

> **Tip:** You can also place these values in a `.env.local` file and import them via `process.env` if you prefer not to commit secrets.


## Development

Run the local development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing

This project uses **Jest** and **React Testing Library**.

```bash
npm run test
```

## Database Schema

Firestore collection: **`patients`**

| Field       | Type      | Description                          |
|-------------|----------|--------------------------------------|
| `firstName` | string   | Patient’s first name                 |
| `middleName`| string   | Optional middle name                 |
| `lastName`  | string   | Patient’s last name                  |
| `dob`       | date     | Date of birth                        |
| `status`    | string   | e.g. `"Active"`, `"Inquiry"`, etc.    |
| `createdAt` | timestamp| Set when the patient is created       |

## Features

- Add, edit, and view patient information.
- Form validation for required fields.
- Dynamic status selection with MUI `Select`.
- Error handling for failed API requests.
- Responsive layout using MUI Grid.

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or your preferred hosting platform.  
When deploying, be sure to set your Firebase environment variables or include the `config.ts` file with the correct credentials.
