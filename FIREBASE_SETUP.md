# Firebase Setup Guide 🚀

## Prerequisites
- Firebase project created at https://console.firebase.google.com
- Project ID: `task-manager-app-28084`
- Firestore database initialized
- Web app registered in Firebase

## Step 1: Enable Authentication

### 1.1 Enable Email/Password Authentication
1. Go to Firebase Console > Authentication
2. Click "Sign-in method"
3. Enable "Email/Password" authentication
4. Save

### 1.2 Enable Other Providers (Optional)
- Google Sign-in
- GitHub
- Facebook
- etc.

## Step 2: Configure Firestore Database

### 2.1 Create Firestore Database
1. Go to Firebase Console > Firestore Database
2. Click "Create database"
3. Choose region (closest to users)
4. Start in "Production mode" or "Test mode"

### 2.2 Create Collections and Indexes
The database structure is automatically created when users sign in.
No manual collection creation needed!

## Step 3: Security Rules

### 3.1 Set Up Security Rules
1. Go to Firestore > Rules
2. Replace default rules with:

```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access their own data
    match /users/{userId}/** {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

3. Publish rules

### 3.2 Test Rules
- ✅ Can read/write own data when authenticated
- ❌ Cannot access other users' data
- ❌ Cannot read/write when not authenticated

## Step 4: Update Credentials (If Needed)

If you change your Firebase project, update:
**File: src/firebase/firebaseconfig.js**

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

Find these values in Firebase Console:
1. Project Settings > Your apps > Web
2. Copy the config object
3. Replace in firebaseconfig.js

## Step 5: Test the Setup

### 5.1 Create Test User
1. Firebase Console > Authentication > Users
2. Click "Add user"
3. Email: `test@example.com`
4. Password: `password123`

### 5.2 Test in App
1. Start the development server: `npm run dev`
2. Sign in with test user email and password
3. Create a task
4. Verify it appears in Firestore Console

### 5.3 Verify Firestore Data
1. Go to Firebase Console > Firestore Database
2. You should see:
   ```
   users
   └── {testUserUID}
       ├── profile
       ├── settings
       └── data
           ├── tasks
           ├── streak
           └── calculations
   ```

## Step 6: Enable Offline Persistence (Optional)

To work offline with auto-sync when online:

**File: src/firebase/firebaseconfig.js**

Add after initialization:
```javascript
import { enableIndexedDbPersistence } from "firebase/firestore";

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.log('Multiple tabs open, persistence disabled');
    } else if (err.code == 'unimplemented') {
      console.log('Browser doesn\'t support persistence');
    }
  });
```

## Step 7: Monitor and Troubleshoot

### 7.1 Check Firestore Usage
1. Firebase Console > Firestore Database > Stats
2. Monitor:
   - Document reads
   - Document writes
   - Document deletes
   - Storage used

### 7.2 Monitor Authentication
1. Firebase Console > Authentication > Analytics
2. Check:
   - Sign-ups
   - Sign-ins
   - User growth

### 7.3 Review Logs
1. Firebase Console > Logs
2. Filter by:
   - Service: Cloud Firestore
   - Severity: Error

## Environment Setup

### Development
```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build for production
npm run build
```

### Firebase Emulator (For Local Development)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Start emulator
firebase emulators:start

# Update firebaseconfig.js to use emulator URL
const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);
```

## Common Passwords & Best Practices

### During Development
- Use test users for development
- Keep test credentials in notes
- Don't use production data for testing

### For Production
- Use strong passwords
- Enable two-factor authentication
- Use environment variables for sensitive data
- Never commit credentials to git

## Deployment Checklist

Before deploying to production:

- [ ] Test all CRUD operations locally
- [ ] Verify Firestore rules are correct
- [ ] Test authentication flow
- [ ] Check error handling
- [ ] Test real-time sync in multiple browsers
- [ ] Monitor usage and costs
- [ ] Set up Firebase monitoring alerts
- [ ] Enable backup (if needed)

## Cost Considerations

### Firestore Pricing (As of 2024)
- **Reads**: $0.06 per 100,000 reads
- **Writes**: $0.18 per 100,000 writes
- **Deletes**: $0.02 per 100,000 deletes
- **Storage**: $0.18 per GB/month

### Optimization Tips
1. Limit real-time listeners to essential data
2. Use queries with proper indexes
3. Batch writes when possible
4. Delete old data periodically
5. Monitor usage regularly

### Free Tier
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

## Troubleshooting

### Issue: "Missing or insufficient permissions"
**Cause**: Security rules don't match your authentication
**Fix**: 
1. Check Firestore Rules
2. Verify user is authenticated
3. Review rules in Firebase Console

### Issue: "app-offline-error"
**Cause**: Network connection lost
**Fix**:
1. Enable offline persistence
2. Check internet connection
3. Check Firebase status

### Issue: "auth/user-not-found"
**Cause**: User doesn't exist in Firebase
**Fix**:
1. Create user in Firebase Console
2. Or allow sign-up in authentication settings

### Issue: "auth/wrong-password"
**Cause**: Incorrect password
**Fix**:
1. Use correct password
2. Or reset password in Firebase Console

## Support Resources

- Firebase Documentation: https://firebase.google.com/docs
- Firestore Docs: https://firebase.google.com/docs/firestore
- Authentication Docs: https://firebase.google.com/docs/auth
- Firebase Console: https://console.firebase.google.com
- Firebase Status: https://status.firebase.google.com

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Enable authentication
3. ✅ Configure Firestore
4. ✅ Set security rules
5. 🔄 Test the application
6. 🚀 Deploy to production

---

**Last Updated**: March 11, 2026
**Firebase SDK Version**: Latest (auto-managed by npm)
**Project**: Dashboard with Task Manager & Calculator

