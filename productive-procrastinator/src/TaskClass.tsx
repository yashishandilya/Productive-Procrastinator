export class TaskClass {
  taskName: string;
  importance: string;
  urgency: string;
  mode: string;
  insertedOrder: number;
  matrixOrder?: number;

  constructor(
    taskName: string,
    importance: string,
    urgency: string,
    mode: string,
    insertedOrder: number
  ) {
    this.taskName = taskName;
    this.importance = importance;
    this.urgency = urgency;
    this.mode = mode;
    this.insertedOrder = insertedOrder;
  }

  setMatrixOrder(matrixOrder: number) {
    this.matrixOrder = matrixOrder;
  }
}
