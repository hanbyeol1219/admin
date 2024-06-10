import { InlineConfig, UserConfig, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globalse: true,
    environment: 'jsdom', // or happy-dom
    setupFiles: './src/test/setup.ts',
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  }
} as VitestConfigExport);
