import react, { reactCompilerPreset } from '@vitejs/plugin-react'

import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  // server: {
  //   host: "0.0.0.0",
  //   proxy: {
  //     "/checkShop": "http://localhost:5000",
  //     "/auth": "http://localhost:5000",
  //     "/owner/auth": "http://localhost:5000",
  //     "/user/auth": "http://localhost:5000",
  //     "/user/file": "http://localhost:5000",
  //     "/get-my-jobs": "http://localhost:5000",
  //     "/api": "http://localhost:5000",
  //   },
  // },
})
