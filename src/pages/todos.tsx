import { render } from 'documentx'
import { Store, ref } from 'documentx/util'

type Todo = {
  id: number
  completed: boolean
  title: string
}

let id = 4

const getInitialTodos = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  const todos = (await res.json()) as Todo[]
  return todos.slice(0, 3)
}

export default async function Todos() {
  const el = ref()

  const initialTodos = await getInitialTodos()
  const todos = new Store(initialTodos)

  todos.sub(async (_newState) => {
    const children = await render(<TodoItems todos={todos} />)
    el.target.replaceChildren(...children)
  })

  function onSubmit(e: any) {
    e.preventDefault()
    const data = new FormData(e.target)
    const title = data.get('todo') as string
    todos.set((s) => {
      s.unshift({ id: id++, title, completed: false as boolean })
      return s
    })
    e.target.reset()
  }

  return (
    <>
      <h1>Todos</h1>
      <form onSubmit={onSubmit}>
        <input type="text" name="todo" style="margin-right: 8px;" />
        <button type="submit">Add</button>
      </form>
      <main ref={el}>
        <TodoItems todos={todos} />
      </main>
    </>
  )
}

const TodoItems = ({ todos }: { todos: Store<Todo[]> }) => {
  return (
    <ul>
      {todos.state.map((todo) => {
        return (
          <li>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => (todo.completed = !todo.completed)}
            />
            <span>{todo.title}</span>
            <button
              style={{
                marginLeft: '8px',
                padding: '4px 8px',
              }}
              onClick={() => {
                return todos.set((s) => {
                  s.splice(s.indexOf(todo), 1)
                  return s
                })
              }}
            >
              ✕
            </button>
          </li>
        )
      })}
    </ul>
  )
}
