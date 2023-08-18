/* eslint-disable @typescript-eslint/no-explicit-any */
import { Serial } from "./serial";

export type Hierarchical<T extends Record<string, any>> = T & {
  children: Hierarchical<T>[];
  value: number;
}

export function toHierarchy<T extends Record<string, any>>(list: T[]): Hierarchical<T>[] {
  const roots: Hierarchical<T>[] = list
    .filter(o => o['serial'] && Serial.countLevels(o['serial']) === 1)
    .map(o => ({ ...o, value: 1, children: [] }));

  function getChildren(org: Hierarchical<T>) {
    org.children = list
      .filter(o => Serial.isChild(org['serial'], o['serial'], 1, true))
      .map(o => ({ ...o, value: 1, children: [] }));

    org.value = org.children.length + 1;

    for (const o of org.children)
      getChildren(o);
  }

  for (const o of roots)
    getChildren(o);

  return roots;
}

export function findHierarchyOf<T extends Record<string, any>>(list: Hierarchical<T>[], serial: string): Hierarchical<T>[] {
  for (const elm of list) {
    if (elm['serial'] === serial)
      return elm.children;

    if (Serial.isBranch(serial, elm['serial']))
      return findHierarchyOf(elm.children, serial);
  }

  return [];
}