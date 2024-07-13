/**
 * @type {import('postcss').ProcessOptions}
 */
module.exports = {
    plugins: [
        require('tailwindcss')({ config: './tailwind.config.js' }),
        require('autoprefixer'),
    ],
}