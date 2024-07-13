interface toDo {
  id: number;
  name: string;
  status: "done" | "undone";
}

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

  //filtering tasks with a value and field
  filterTask<T extends field>(value: toDo[T], field: T) {
    return this.list.filter((task) => task[field] == value);
  }

  //filtering tasks with currying
  filterTaskCurry<T extends field>(field: T) {
    return (value: toDo[T]) => this.list.filter((task) => task[field] == value);
  }

  //filtering tasks with a function
  filterTaskFn(fn: (task: toDo) => boolean) {
    return this.list.filter(fn);
  }

  //filtering tasks using the partial utility
  filterTaskPartial(filterObj: Partial<toDo>) {
    return this.list.filter((task) => {
      return Object.keys(filterObj).reduce((acc, key) => {
        return acc && task[key] == filterObj[key];
      }, true);
    });
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

const myList = new toDoList({ id: 1, name: "first", status: "undone" });
myList.addTask({ id: 2, name: "second", status: "done" });
myList.addTask({ id: 8, name: "eight", status: "undone" });

console.log(myList.filterTask(2, "id"));
console.log(myList.filterTaskCurry("id")(1));
console.log(myList.filterTaskFn((task) => task["id"] < 5));
console.log(myList.filterTaskPartial({ name: "first", status: "undone" }));
