// /** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./popup/**/*.{js,ts,jsx,tsx}",
      "./background/**/*.{js,ts,jsx,tsx}",
      "./contents/**/*.{js,ts,jsx,tsx}"
    ], 
    plugins: [],
    purge: {
      enabled: false, // enable this when you are ready to deploy
      content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./popup/**/*.{js,ts,jsx,tsx}",
        "./background/**/*.{js,ts,jsx,tsx}",
        "./contents/**/*.{js,ts,jsx,tsx}"
      ]
    },
  }