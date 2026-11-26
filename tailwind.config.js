/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        inegi: {
          azul: '#005A8B',
          oscuro: '#003057',
          claro: '#E6F0F7',
          turquesa: '#0099B8',
          texto: '#1A2A3A',
          secundario: '#5A6B7C',
          exito: '#2E7D32',
          alerta: '#C62828',
          aviso: '#F9A825',
          fondo: '#F4F7FA',
          borde: '#DCE7F0'
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        tarjeta: '0 2px 14px rgba(0, 48, 87, 0.08)',
        flotante: '0 12px 32px rgba(0, 48, 87, 0.18)'
      }
    }
  },
  plugins: []
}
