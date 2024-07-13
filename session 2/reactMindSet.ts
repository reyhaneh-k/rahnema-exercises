// Import stylesheets
import "./style.css";

interface TodoItem {
  id: number;
  title: string;
  status: boolean;
}

type Filter = "done" | "Todo" | "All";

interface State {
  lastIndex: number;
  ToDoItems: ReadonlyArray<TodoItem>;
  selectedFilter: Filter;
}

const useState = (state: State) => {
  let internalState = state;
  const setState = (fn: (state: State) => State) => {
    internalState = fn(internalState);
    draw(internalState);
  };
  draw(internalState);
  return [internalState, setState] as const;
};

const [state, setState] = useState({
  lastIndex: 3,
  ToDoItems: [
    { id: 1, title: "Get Lunch", status: false },
    { id: 2, title: "Complete Your Exercises", status: false },
    { id: 3, title: "Get Milk", status: true },
  ],
  selectedFilter: "All",
});

const toggleToDo = (id: TodoItem["id"]) => {
  setState((state) => ({
    ...state,
    ToDoItems: state.ToDoItems.map((task) =>
      task.id == id ? { ...task, status: !task.status } : task
    ),
  }));
};

const addToDo = (title: TodoItem["title"]) => {
  setState((state) => ({
    ...state,
    ToDoItems: [
      ...state.ToDoItems,
      { id: state.lastIndex + 1, title: title, status: false },
    ],
    lastIndex: state.lastIndex + 1,
  }));
};

const changeFilter = (filter: Filter) => {
  setState((state) => ({
    ...state,
    selectedFilter: filter,
  }));
};

function draw(state: State) {
  const app = document.getElementById("app");

  // app.replaceChildren()
  [...app.children].forEach((child) => app.removeChild(child));

  const form = document.createElement("form");
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.id = "inp";
  input.placeholder = "Enter Task Title";
  label.textContent = "title:";
  label.htmlFor = "inp";
  form.append(label);
  form.append(input);
  input.addEventListener("keypress", (e) => {
    if (e.key == "Enter" && input.value !== "") {
      addToDo(input.value);
    }
  });
  app.append(form);

  const todoList = document.createElement("ul");
  state.ToDoItems.filter((task) => {
    switch (state.selectedFilter) {
      case "done":
        return task.status;
      case "Todo":
        return !task.status;
      case "All":
        return true;
    }
  }).map((task) => {
    const listItem = document.createElement("li");
    listItem.textContent = task.title;
    task.status
      ? (listItem.style.textDecoration = "line-through")
      : (listItem.style.textDecoration = "none");
    listItem.addEventListener("click", () => toggleToDo(task.id));
    listItem.style.cursor = "pointer";
    todoList.appendChild(listItem);
  });

  app.appendChild(todoList);

  const createBtn = (title: Filter) => {
    const btn = document.createElement("button");
    btn.textContent = title;
    btn.addEventListener("click", () => {
      changeFilter(title);
    });
    return btn;
  };

  const allBtn = createBtn("All");
  const todoBtn = createBtn("Todo");
  const doneBtn = createBtn("done");

  const setSelectedBtn = () => {
    switch (state.selectedFilter) {
      case "done":
        doneBtn.style.color = "red";
        todoBtn.style.color = "black";
        allBtn.style.color = "black";
        break;

      case "Todo":
        doneBtn.style.color = "black";
        todoBtn.style.color = "red";
        allBtn.style.color = "black";
        break;
      case "All":
        doneBtn.style.color = "black";
        todoBtn.style.color = "black";
        allBtn.style.color = "red";
        break;
    }
  };
  setSelectedBtn();
  app.append(allBtn, todoBtn, doneBtn);
}
