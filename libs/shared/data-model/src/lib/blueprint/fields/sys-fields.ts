import { Field, createField } from ".";

export function getSystemFields(blueprint: string): Array<Field> {
  return [
    createField({
      name: 'serial',
      display_name: 'serial',
      type: 'serial',
      group: '_sys',
      system: true,
      constant: true,
      required: true
    }),
    createField({
      name: 'owner',
      display_name: 'owner',
      type: 'serial',
      ref_type: 'user',
      group: '_sys',
      system: true,
      constant: true,
      required: true
    }),
    createField({
      name: 'create_date',
      display_name: "entry_date",
      type: 'datetime',
      system: true,
      constant: true,
      required: true,
      group: '_sys'
    }),
    createField({
      name: "last_modified",
      display_name: "last_modified",
      type: 'datetime',
      group: '_sys',
      system: true
    }),
    createField({
      name: 'topic',
      display_name: 'topic',
      type: 'serial',
      ref_type: 'topic',
      ref_to: blueprint,
      group: '_sys',
      system: true,
      constant: true,
      required: true
    })
  ];
}