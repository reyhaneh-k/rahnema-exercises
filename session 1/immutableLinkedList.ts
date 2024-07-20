class immutableNode {
  value: any;
  next: null | immutableNode;
  constructor(value: any, next: null | immutableNode = null) {
    this.value = value;
    this.next = next;
  }
  prepend(value: any) {
    const node = new Node(value);
    node.next = this;
    return node;
  }

  at(n: number) {
    let node: immutableNode = this;
    for (let i = 0; i < n - 1; i++) {
      node = node.next!;
    }
    return node;
  }
  append(value: any) {
    let node: immutableNode;
    Object.assign(node, this);
    let sourceNode = this;

    while (node.next instanceof Node) {
      Object.assign(node.next, sourceNode.next);
      sourceNode = sourceNode.next;
      node = node.next;
    }
    node.next = new Node(value);
  }
}
