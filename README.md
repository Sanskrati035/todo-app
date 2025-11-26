1. Project Initialization

First, we created the project using Vite and selected React with JavaScript.

# Create the project
npm create vite@latest my-todo-app -- --template react

# Navigate into the folder
cd my-todo-app

# Install default dependencies
npm install


2. Install Additional Dependencies

We installed the icon library and the specific Tailwind CSS v4 packages (including the compatibility adapter that fixed the installation error).

# Install icons
npm install lucide-react

# Install Tailwind CSS and the required PostCSS adapter
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss

3. Running the App

Finally, start the development server:

npm run dev

Open your browser to the local URL provided (usually http://localhost:5173) to view the app.