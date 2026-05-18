# Goal Portal Backend

This is the Express.js backend for the Goal Portal application. It provides a RESTful API for managing users and goals.

## Tech Stack
- **Node.js** & **Express**
- **CORS** (Cross-Origin Resource Sharing)
- **Vercel Serverless Functions** (for deployment)

## Getting Started Locally

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

## API Endpoints

- `GET /` - Health check. Returns "Goal Portal Backend is running!"
- `GET /api/users` - Fetch the list of mock users.
- `GET /api/goals` - Fetch all goals.
- `POST /api/goals` - Create a new goal.
- `PUT /api/goals/:id` - Update an existing goal.
- `DELETE /api/goals/:id` - Delete a goal.

## Deployment on Vercel

1. Push this folder to your GitHub repository.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **Add New... > Project**.
3. Import your repository.
4. **Crucial Step**: In the project configuration, edit the **Root Directory** and select the `backend` folder.
5. Click **Deploy**. Vercel will automatically use the `vercel.json` file to deploy your Express app.

---

## How to Connect the Frontend to this Backend

Right now, your Next.js frontend (`goal-portal`) is using mocked data and `localStorage`. To connect it to this actual backend, follow these steps:

### Step 1: Set up Environment Variables
In your frontend folder (`goal-portal`), create a `.env.local` file (do not commit this to GitHub) and add your backend URL. 

If running locally:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
If deployed to Vercel, use your Vercel backend URL (without a trailing slash):
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

### Step 2: Update Data Fetching in the Frontend
You will need to update your data fetching logic to use the API instead of `localStorage`. If you are using React Context (e.g., `src/lib/AppContext.tsx`), you would update it like this:

**Fetching Data:**
```javascript
// Fetch goals from the backend
useEffect(() => {
  const fetchGoals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals`);
      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  };
  
  fetchGoals();
}, []);
```

**Creating Data:**
```javascript
const addGoal = async (goal) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal)
    });
    const newGoal = await res.json();
    setGoals((prev) => [...prev, newGoal]);
  } catch (error) {
    console.error("Failed to add goal:", error);
  }
};
```

**Updating Data:**
```javascript
const updateGoal = async (id, updates) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    const updatedGoal = await res.json();
    setGoals((prev) => prev.map((g) => (g.id === id ? updatedGoal : g)));
  } catch (error) {
    console.error("Failed to update goal:", error);
  }
};
```

**Deleting Data:**
```javascript
const deleteGoal = async (id) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/${id}`, {
      method: "DELETE"
    });
    setGoals((prev) => prev.filter((g) => g.id !== id));
  } catch (error) {
    console.error("Failed to delete goal:", error);
  }
};
```

### Step 3: Remove `localStorage` logic
Once the `fetch` calls are implemented, you can safely remove the `useEffect` blocks that read and write from `localStorage` in your `AppContext.tsx`.
