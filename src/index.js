import { createRoot } from 'react-dom/client'
// הפונטים מותקנים עם הפרויקט (בלי תלות באינטרנט): קרנטינה לכותרות, אסיסטנט לכל השאר
import '@fontsource/karantina/400.css'
import '@fontsource/karantina/700.css'
import '@fontsource/assistant/400.css'
import '@fontsource/assistant/500.css'
import '@fontsource/assistant/600.css'
import '@fontsource/assistant/700.css'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)
