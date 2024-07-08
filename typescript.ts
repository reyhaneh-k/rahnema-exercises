interface toDo {
  id: number;
  name: string;
  status: "done" | "undone";
}
// type Test = {
//   id: number;
//   name: string;
//   status: "done" | "undone";
// };
// type b = keyof Test
// const s:b = ''

type List = Array<toDo>;
type field = keyof toDo;
class toDoList {
  list: List;
  constructor(task: toDo) {
    this.list = [task];
  }

  viewTasks() {
    this.list.forEach((task) =>
      console.log(
        `{\n"id": ${task.id}\n"name": ${task.name}\n"status": ${task.status}}`
      )
    );
  }
  addTask(task: toDo) {
    this.list.push(task);
  }
  filterTask<T extends field>(value: toDo[T], field: T) {
    return this.list.filter((task) => task[field] == value);
  }
  removeTask(task: toDo) {
    const index = this.list.findIndex(
      (t) => t.id == task.id && t.name == task.name && t.status == task.status
    );
    if (index > 0) {
      this.list.splice(index, 1);
    }
  }
  toggleTask(task: toDo) {
    const t = this.list.find(
      (t) => t.id == task.id && t.name == task.name && t.status == task.status
    );
    if (t !== undefined) {
      t.status = t?.status == "done" ? "undone" : "done";
    }
  }
  searchTasks(name: toDo["name"]): Array<toDo> {
    return this.list.filter((task) => task["name"] == name);
  }
}
