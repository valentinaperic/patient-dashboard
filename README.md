# Patient Dashboard

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It is a React + TypeScript application for managing patient information with forms, validations, and dynamic status selection. The UI is built using [Material UI (MUI)](https://mui.com/) components.

---

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/patient-dashboard.git
cd patient-dashboard
npm install
``` 

Firebase Setup

This project uses Firebase for database and authentication. To set up Firebase:

Create a Firebase project at Firebase Console
.

Enable Firestore for storing patient data.

Optionally, enable Authentication if you want to secure access.

Copy your Firebase configuration and add it to src/firebase/config.ts:

```javascript

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 in your browser to view the application.

## Testing

```bash
npm run test
```

## Features
- Add, edit, and view patient information.
- Form validation for required fields.
- Dynamic status selection with MUI Select.
- Error handling for failed API requests.
- Responsive UI with Material UI Grid system.