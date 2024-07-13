/**
 * @type {import('postcss').ProcessOptions}
 */
module.exports = {
    plugins: [
        require('tailwindcss')({ config: './src/tailwind.config.js' }),
        require('autoprefixer'),
    ],
}