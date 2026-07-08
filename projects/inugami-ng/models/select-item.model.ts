export interface InuSelectItem<T> {
  title: string;
  value: T;
  id: string;
  tooltips?: string;
  styleClass?: string;
  disabled?: boolean;
  selected?: boolean;
}

export type InuSelectItemInitializer<T> = (value: T) => InuSelectItem<T>;
export type InuSelectItemMatcher = (selectItem: InuSelectItem<any>, value: any) => InuSelectItem<any> | undefined;
export type InuSelectItemExtractor = (selectItem: InuSelectItem<any>) => any | undefined;
