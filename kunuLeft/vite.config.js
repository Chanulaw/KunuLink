import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    esbuild: {
        // build වෙද්දී unused console log සහ warnings ignor කරන්න
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
})