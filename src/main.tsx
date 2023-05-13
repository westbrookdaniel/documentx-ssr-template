import './style.css'
import { render } from 'documentx'
import { ref, createRouter, fileRouter } from 'documentx/util'

export const router = createRouter(
  fileRouter(import.meta.glob('./pages/**/*.tsx'), './pages')
)

export default async function App() {
  const el = ref()

  const route = await router.bind(el, {
    error: (err) => <h1>Error: {err}</h1>,
  })

  return (
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/todos">Todos</a>
      </nav>
      <div ref={el}>{route}</div>
    </div>
  )
}

if (typeof document !== 'undefined') {
  render(<App />).then((children) => {
    document.querySelector('#app')!.replaceChildren(...children)
  })
}
