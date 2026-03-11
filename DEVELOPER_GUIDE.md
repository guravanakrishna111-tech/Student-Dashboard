# 🔧 Dashboard Application - Developer Documentation

## 📐 Architecture Overview

```
App.jsx (Root)
├── Navbar.jsx
├── Routes
│   ├── Dashboard.jsx (/)
│   ├── TaskManagerPage.jsx (/tasks)
│   ├── Analytics.jsx (/analytics)
│   ├── History.jsx (/history)
│   ├── Profile.jsx (/profile)
│   ├── Settings.jsx (/settings)
│   └── Calculator.jsx (/calculator)
├── State Management (localStorage)
└── Styling (CSS)
```

## 🔌 Component Props

### App.jsx
```javascript
Props Used:
- Tasks: Array<Task>
- setTasks: Function
- completedTasks: number
- score: number
```

### Dashboard.jsx
```javascript
Props Received:
- Tasks: Array<Task>
- setTasks: Function
- completedTasks: number
- score: number

State:
- localTasks: Array<Task>
- streak: number
- lastDate: string
```

### TaskManagerPage.jsx
```javascript
Props Received:
- Tasks: Array<Task>
- setTasks: Function

Task Object Structure:
{
  id: number (timestamp),
  text: string,
  category: 'Study' | 'Work' | 'Personal' | 'Health',
  priority: 'High' | 'Medium' | 'Low',
  deadline: string (date format),
  status: 'Pending' | 'Completed',
  completed: boolean,
  createdAt: ISO string
}
```

### Analytics.jsx
```javascript
Props Received:
- Tasks: Array<Task>

Output Charts:
- Bar Chart: Weekly task completion
- Pie Chart: Category distribution
- Progress Bars: Priority distribution
- List: Category breakdown
```

### History.jsx
```javascript
Props Received:
- Tasks: Array<Task>
- completedTasks: number

Tabs:
- All Activities (combined view)
- Calculations (search & delete)
- Completed Tasks (detailed list)
```

### Profile.jsx
```javascript
Props Received:
- score: number
- Tasks: Array<Task>

Profile Object (localStorage):
{
  name: string,
  mail: string,
  number: string,
  location: string
}
```

### Settings.jsx
```javascript
Props Received:
- Tasks: Array<Task>
- setTasks: Function

AppSettings Object (localStorage):
{
  darkMode: boolean,
  username: string,
  notifications: boolean,
  emailNotifications: boolean
}
```

## 💾 localStorage Keys

```javascript
// Main Data
localStorage['Tasks'] → Array<Task>

// User Info
localStorage['profile'] → Object { name, mail, number, location }

// Settings
localStorage['appSettings'] → Object { darkMode, username, notifications, emailNotifications }

// Calculator History
localStorage['calculationHistory'] → Array<Calculation>

// Streak
localStorage['streak'] → number
localStorage['streakDate'] → string (date)
```

## 📊 Data Flow

### Task Completion Flow
```
User clicks checkbox
→ toggleComplete() fired
→ Task.completed = true
→ localStorage updated
→ State re-renders
→ Stats recalculated
→ Streak counter incremented
```

### New Task Creation Flow
```
User fills form
→ Click "Add Task"
→ Validation checks
→ Task object created with timestamp ID
→ Added to Tasks array
→ localStorage updated
→ Form cleared
→ Stats updated
```

### Analytics Data Flow
```
Tasks array
→ Filter by completion status
→ Calculate statistics
→ Generate chart data
→ Render visualizations
```

## 🎨 CSS Structure

### Color Palette
```css
/* Primary */
--primary: #667eea
--secondary: #764ba2

/* Status */
--success: #10B981
--warning: #F59E0B
--danger: #EF4444

/* Neutral */
--bg-light: #f9fafb
--bg-dark: #2a2a2a
--text-dark: #1f2937
--text-light: #666
```

### Responsive Breakpoints
```css
/* Desktop: 1200px+ (default) */

/* Tablet: 768px - 1200px */
@media (max-width: 768px) {
  /* Adjust grid columns */
  /* Stack layouts */
}

/* Mobile: 480px - 768px */
@media (max-width: 480px) {
  /* Single column */
  /* Full width */
  /* Reduced padding */
}
```

## 🔄 State Management Flows

### Dashboard State
```javascript
// Initialize from localStorage
const [localTasks, setLocalTasks] = useState(() => {
  const saved = localStorage.getItem("Tasks");
  return saved ? JSON.parse(saved) : [];
});

// Update localStorage on change
useEffect(() => {
  localStorage.setItem("Tasks", JSON.stringify(localTasks));
}, [localTasks]);
```

### Settings Dark Mode
```javascript
// Toggle
setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))

// Apply to document
useEffect(() => {
  if (settings.darkMode) {
    document.body.style.backgroundColor = '#1a1a1a'
  } else {
    document.body.style.backgroundColor = '#fff'
  }
}, [settings])
```

## 🧮 Calculation Functions

### Productivity Score
```javascript
const score = Tasks.length > 0 
  ? Math.round((completedTasks / Tasks.length) * 100) 
  : 0
```

### Streak Logic
```javascript
const today = new Date().toDateString();
if (taskCompleted && lastDate !== today) {
  setStreak(prev => prev + 1);
  localStorage.setItem("streak", streak + 1);
  localStorage.setItem("streakDate", today);
}
```

### Completion Rate
```javascript
const completionRate = totalTasks 
  ? Math.round((completedTasks / totalTasks) * 100) 
  : 0
```

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "recharts": "^2.x.x" (newly added)
}
```

## 🚀 Performance Optimizations

### Memoization
```javascript
// Prevent unnecessary recalculations
const stats = useMemo(() => {
  // Complex calculations
  return { ... }
}, [dependencies])
```

### Conditional Loading
```javascript
// Charts only show when data exists
{analyticsData.categoryData.length > 0 ? (
  <PieChart data={analyticsData.categoryData} />
) : (
  <div>No data</div>
)}
```

## 🔐 Data Validation

### Task Validation
```javascript
// Trim and check
if(input.trim() === "") return;

// Date validation in deadline picker (HTML5 native)
<input type="date" />
```

### Profile Validation
```javascript
// Disabled until filled
disabled={!profile.name || !profile.mail}
```

## 🎯 Feature Flags

Currently all features are enabled. To disable features:

```javascript
// In Settings.jsx
const FEATURES = {
  darkMode: true,
  exportData: true,
  resetTasks: true,
  notifications: true
}

// Conditionally render
{FEATURES.darkMode && <DarkModeToggle />}
```

## 🐛 Error Handling

### localStorage Errors
```javascript
try {
  return JSON.parse(localStorage.getItem('Tasks'))
} catch {
  return []
}
```

### Delete Confirmations
```javascript
if (window.confirm('Are you sure?')) {
  // Perform deletion
}
```

## 📈 Analytics Data Structure

### Weekly Data (simulated)
```javascript
const weeklyData = [
  { day: 'Mon', completed: 3, pending: 4 },
  { day: 'Tue', completed: 4, pending: 3 },
  // ... rest of week
]
```

### Category Distribution
```javascript
const categoryData = [
  { name: 'Study', value: 5, emoji: '📚' },
  { name: 'Work', value: 3, emoji: '💼' },
  // ...
]
```

## 🔄 Route Parameters

Currently no URL parameters are used. Future enhancement could include:

```javascript
// Example enhancement
<Route path="/tasks/:id" element={<TaskDetail />} />
<Route path="/analytics/:period" element={<Analytics />} />
```

## 📱 Mobile Considerations

- Touch-friendly button sizes (40px minimum)
- Readable font sizes (16px minimum on inputs)
- Adequate padding for touch targets
- Scrollable content areas
- No hover-dependent interactions

## 🎨 Animation Classes

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide In */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide Up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## 🔄 Event Listeners

### Storage Listener
```javascript
window.addEventListener('storage', (e) => {
  if (e.key === 'Tasks') {
    // Update state
  }
})
```

### Keyboard Shortcuts
```javascript
const handleKeyPress = (e) => {
  if(e.key === 'Enter') {
    addTask()
  }
}
```

## 🧪 Testing Suggestions

### Unit Tests
- Task CRUD operations
- Score calculation
- Streak logic
- Category filtering

### Integration Tests
- Page navigation
- Data persistence
- Props passing
- Form submissions

### E2E Tests
- Complete user workflow
- Cross-page navigation
- Data consistency

## 📚 Future Enhancements

1. **Backend Integration**
   - API endpoints for data persistence
   - User authentication
   - Cloud sync

2. **Advanced Features**
   - Recurring tasks
   - Task dependencies
   - Collaborative features
   - Notifications via service workers

3. **Performance**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

4. **Analytics**
   - Trends over time
   - Predictions
   - Custom reports
   - Export options (PDF, CSV)

5. **UI/UX**
   - Dark mode enhancements
   - Custom themes
   - Accessibility improvements
   - Keyboard navigation

---

**Documentation Version:** 1.0
**Last Updated:** March 10, 2026
**Maintainer:** Development Team
