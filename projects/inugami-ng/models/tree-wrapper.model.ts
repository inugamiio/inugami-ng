export interface TreeNode<T> {
  uid: string;
  children: TreeNode<T>[];
  level:number;
  value?: T;
}
