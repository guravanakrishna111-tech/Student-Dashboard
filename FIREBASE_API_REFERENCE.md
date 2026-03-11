# Firebase Service API Reference 📚

## Overview
Complete API documentation for `firebaseService.js` - all database operations used in the dashboard.

## Table of Contents
1. [Authentication Functions](#authentication-functions)
2. [Task Operations](#task-operations)
3. [Calculation History](#calculation-history)
4. [Profile Management](#profile-management)
5. [Settings Management](#settings-management)
6. [Streak Tracking](#streak-tracking)

---

## Authentication Functions

### `getCurrentUserId()`
Returns the current authenticated user's ID.

**Returns**: `string | null` - User ID or null if not authenticated

**Example**:
```javascript
import { getCurrentUserId } from './firebase/firebaseService';

const userId = getCurrentUserId();
if (userId) {
  console.log('User ID:', userId);
} else {
  console.log('User not authenticated');
}
```

---

### `onAuthChange(callback)`
Listen to authentication state changes (login/logout).

**Parameters**:
- `callback`: Function called when auth state changes
  - Called with user object or null

**Returns**: Unsubscribe function

**Example**:
```javascript
import { onAuthChange } from './firebase/firebaseService';

useEffect(() => {
  const unsubscribe = onAuthChange((user) => {
    if (user) {
      console.log('User logged in:', user.email);
    } else {
      console.log('User logged out');
    }
  });
  
  return unsubscribe; // Cleanup
}, []);
```

---

## Task Operations

### `saveTasks(userId, tasks)`
Save or update tasks for a user.

**Parameters**:
- `userId`: string - User ID
- `tasks`: Array - Task array to save

**Returns**: Promise<boolean>

**Example**:
```javascript
import { saveTasks } from './firebase/firebaseService';

const tasks = [
  { text: 'Buy groceries', completed: false },
  { text: 'Write report', completed: true }
];

await saveTasks(userId, tasks);
```

**Throws**: Firebase error if write fails

---

### `getTasks(userId)`
Retrieve all tasks for a user (one-time fetch).

**Parameters**:
- `userId`: string - User ID

**Returns**: Promise<Array> - Array of tasks

**Example**:
```javascript
import { getTasks } from './firebase/firebaseService';

const tasks = await getTasks(userId);
console.log('Tasks loaded:', tasks);
```

**Returns empty array if**:
- User has no tasks document
- User is not authenticated

---

### `onTasksChange(userId, callback)`
Listen to real-time task updates.

**Parameters**:
- `userId`: string - User ID
- `callback`: Function called when tasks change
  - Called with updated tasks array

**Returns**: Unsubscribe function

**Example**:
```javascript
import { onTasksChange } from './firebase/firebaseService';

useEffect(() => {
  if (user?.uid) {
    const unsubscribe = onTasksChange(user.uid, (tasks) => {
      setTasks(tasks);
    });
    
    return unsubscribe; // Clean up listener
  }
}, [user?.uid]);
```

**Notes**:
- Real-time listener (called whenever data changes)
- Always unsubscribe in cleanup
- Returns empty array if no document exists

---

## Calculation History

### `saveCalculation(userId, calculation)`
Save a single calculation to history.

**Parameters**:
- `userId`: string - User ID
- `calculation`: Object
  - `expression`: string - Math expression
  - `result`: number - Calculation result
  - `timestamp`: string - ISO timestamp

**Returns**: Promise<boolean>

**Example**:
```javascript
import { saveCalculation } from './firebase/firebaseService';

const calculation = {
  expression: '2h × 8focus + 3×5',
  result: 31,
  timestamp: new Date().toLocaleString()
};

await saveCalculation(userId, calculation);
```

---

### `getCalculationHistory(userId)`
Retrieve all calculations for a user.

**Parameters**:
- `userId`: string - User ID

**Returns**: Promise<Array> - Array of calculations

**Example**:
```javascript
import { getCalculationHistory } from './firebase/firebaseService';

const history = await getCalculationHistory(userId);
console.log('Total calculations:', history.length);
```

---

### `deleteCalculation(userId, calculation)`
Remove a specific calculation from history.

**Parameters**:
- `userId`: string - User ID
- `calculation`: Object - Calculation to delete (must match exactly)

**Returns**: Promise<boolean>

**Example**:
```javascript
import { deleteCalculation } from './firebase/firebaseService';

const calcToDelete = calculationHistory[0];
await deleteCalculation(userId, calcToDelete);
```

---

### `clearCalculationHistory(userId)`
Delete all calculations for a user.

**Parameters**:
- `userId`: string - User ID

**Returns**: Promise<boolean>

**Example**:
```javascript
import { clearCalculationHistory } from './firebase/firebaseService';

if (confirm('Clear all history?')) {
  await clearCalculationHistory(userId);
}
```

---

### `onCalculationsChange(userId, callback)`
Listen to real-time calculation changes.

**Parameters**:
- `userId`: string - User ID
- `callback`: Function called when calculations change
  - Called with updated history array

**Returns**: Unsubscribe function

**Example**:
```javascript
useEffect(() => {
  if (user?.uid) {
    const unsubscribe = onCalculationsChange(user.uid, (history) => {
      setCalculationHistory(history);
    });
    
    return unsubscribe;
  }
}, [user?.uid]);
```

---

## Profile Management

### `saveProfile(userId, profile)`
Save user profile information.

**Parameters**:
- `userId`: string - User ID
- `profile`: Object
  - `name`: string - Full name
  - `mail`: string - Email address
  - `number`: string - Phone number
  - `location`: string - Location

**Returns**: Promise<boolean>

**Example**:
```javascript
import { saveProfile } from './firebase/firebaseService';

const profile = {
  name: 'John Doe',
  mail: 'john@example.com',
  number: '+1234567890',
  location: 'New York'
};

await saveProfile(userId, profile);
```

---

### `getProfile(userId)`
Retrieve user profile.

**Parameters**:
- `userId`: string - User ID

**Returns**: Promise<Object> - Profile object

**Example**:
```javascript
import { getProfile } from './firebase/firebaseService';

const profile = await getProfile(userId);
console.log('Profile:', profile.name);
```

---

### `onProfileChange(userId, callback)`
Listen to profile updates in real-time.

**Parameters**:
- `userId`: string - User ID
- `callback`: Function called when profile changes
  - Called with updated profile object

**Returns**: Unsubscribe function

**Example**:
```javascript
useEffect(() => {
  if (user?.uid) {
    const unsubscribe = onProfileChange(user.uid, (profile) => {
      setProfile(profile);
    });
    
    return unsubscribe;
  }
}, [user?.uid]);
```

---

## Settings Management

### `saveSettings(userId, settings)`
Save application settings.

**Parameters**:
- `userId`: string - User ID
- `settings`: Object
  - `darkMode`: boolean - Dark theme enabled
  - `username`: string - Display username
  - `notifications`: boolean - In-app notifications
  - `emailNotifications`: boolean - Email notifications

**Returns**: Promise<boolean>

**Example**:
```javascript
import { saveSettings } from './firebase/firebaseService';

const settings = {
  darkMode: true,
  username: 'john_doe',
  notifications: true,
  emailNotifications: false
};

await saveSettings(userId, settings);
```

---

### `getSettings(userId)`
Retrieve application settings.

**Parameters**:
- `userId`: string - User ID

**Returns**: Promise<Object> - Settings object

**Example**:
```javascript
const settings = await getSettings(userId);
if (settings.darkMode) {
  document.body.classList.add('dark-theme');
}
```

---

### `onSettingsChange(userId, callback)`
Listen to settings updates in real-time.

**Parameters**:
- `userId`: string - User ID
- `callback`: Function called when settings change
  - Called with updated settings object

**Returns**: Unsubscribe function

**Example**:
```javascript
useEffect(() => {
  if (user?.uid) {
    const unsubscribe = onSettingsChange(user.uid, (settings) => {
      setSettings(settings);
    });
    
    return unsubscribe;
  }
}, [user?.uid]);
```

---

## Streak Tracking

### `saveStreak(userId, streak, lastDate)`
Save user's task completion streak.

**Parameters**:
- `userId`: string - User ID
- `streak`: number - Current streak count
- `lastDate`: string - Last completion date (YYYY-MM-DD format)

**Returns**: Promise<boolean>

**Example**:
```javascript
import { saveStreak } from './firebase/firebaseService';

const today = new Date().toDateString();
await saveStreak(userId, 5, today);
```

---

### `getStreak(userId)`
Retrieve streak data.

**Parameters**:
- `userId`: string - User ID

**Returns**: Promise<Object>
- `streak`: number - Current streak count
- `lastDate`: string - Last completion date

**Example**:
```javascript
const streakData = await getStreak(userId);
console.log(`Current streak: ${streakData.streak} days`);
```

**Default Return**:
```javascript
{ streak: 0, lastDate: null }
```

---

### `onStreakChange(userId, callback)`
Listen to streak updates in real-time.

**Parameters**:
- `userId`: string - User ID
- `callback`: Function called when streak changes
  - Called with updated streak object

**Returns**: Unsubscribe function

**Example**:
```javascript
useEffect(() => {
  if (user?.uid) {
    const unsubscribe = onStreakChange(user.uid, (streakData) => {
      setStreak(streakData.streak);
      setLastDate(streakData.lastDate);
    });
    
    return unsubscribe;
  }
}, [user?.uid]);
```

---

## Error Handling Best Practices

### Try-Catch Pattern
```javascript
try {
  await saveTasks(userId, tasks);
  console.log('Tasks saved successfully');
} catch (error) {
  console.error('Error saving tasks:', error);
  setError('Failed to save tasks. Please try again.');
}
```

### With Loading State
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSave = async () => {
  try {
    setLoading(true);
    setError('');
    await saveTasks(userId, tasks);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Real-Time Listener Error Handling
```javascript
useEffect(() => {
  if (!user?.uid) return;
  
  try {
    const unsubscribe = onTasksChange(user.uid, (tasks) => {
      setTasks(tasks);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up listener:', error);
    setError('Failed to sync data');
  }
}, [user?.uid]);
```

---

## Common Patterns

### Complete Form Save
```javascript
const handleSaveProfile = async () => {
  try {
    setLoading(true);
    if (!user?.uid) {
      setError('Please sign in');
      return;
    }
    
    await saveProfile(user.uid, profile);
    setSuccess('Profile saved!');
    setTimeout(() => setSuccess(''), 2000);
  } catch (err) {
    setError('Failed to save profile');
  } finally {
    setLoading(false);
  }
};
```

### Real-Time Data Sync
```javascript
useEffect(() => {
  if (user?.uid) {
    const unsubscribe = onTasksChange(user.uid, (newTasks) => {
      setTasks(newTasks);
    });
    
    return () => {
      console.log('Cleaning up listener');
      unsubscribe();
    };
  }
}, [user?.uid]);
```

### Auto-Save with Debounce
```javascript
const [saveTimer, setSaveTimer] = useState(null);

useEffect(() => {
  clearTimeout(saveTimer);
  
  const timer = setTimeout(() => {
    if (user?.uid && tasks.length > 0) {
      saveTasks(user.uid, tasks)
        .catch(err => console.error('Auto-save failed:', err));
    }
  }, 1000); // Wait 1 second after last change
  
  setSaveTimer(timer);
}, [tasks, user?.uid]);
```

---

## Migration Reference (localStorage → Firebase)

| Operation | localStorage | Firebase |
|-----------|--------------|----------|
| **Save data** | `localStorage.setItem(key, JSON.stringify(data))` | `await saveTasks(userId, data)` |
| **Load data** | `JSON.parse(localStorage.getItem(key))` | `await getTasks(userId)` |
| **Listen for changes** | `window.addEventListener('storage', ...)` | `onTasksChange(userId, callback)` |
| **Delete data** | `localStorage.removeItem(key)` | `await clearCalculationHistory(userId)` |

---

## Performance Tips

1. **Limit Real-Time Listeners**: Only use where needed
2. **Batch Operations**: Group writes together
3. **Use One-Time Fetch**: When you don't need real-time updates
4. **Clean Up**: Always unsubscribe from listeners
5. **Debounce Saves**: Don't save on every keystroke

---

## Testing

Example test with mock data:
```javascript
describe('firebaseService', () => {
  it('should save and retrieve tasks', async () => {
    const userId = 'test-user';
    const tasks = [
      { text: 'Test task', completed: false }
    ];
    
    await saveTasks(userId, tasks);
    const retrieved = await getTasks(userId);
    
    expect(retrieved).toEqual(tasks);
  });
});
```

---

**Last Updated**: March 11, 2026
**Version**: 1.0
**Status**: Production Ready

