import { Field, createField } from ".";

export function getSystemFields(blueprint: string): Array<Field> {
  return [
    createField({
      name: 'serial',
      display_name: 'serial',
      type: 'serial',
      group: '_id',
      system: true,
      constant: true,
      required: true
    }),
    createField({
      name: 'owner',
      display_name: 'owner',
      type: 'serial',
      ref_type: 'user',
      group: '_owner',
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
      group: '_meta'
    }),
    createField({
      name: "last_modified",
      display_name: "last_modified",
      type: 'datetime',
      group: '_meta',
      system: true
    }),
    createField({
      name: 'workflow',
      display_name: 'workflow',
      type: 'string',
      group: '_workflow',
      system: true,
      required: true
    }),
    createField({
      name: 'topic',
      display_name: 'topic',
      type: 'serial',
      ref_type: 'topic',
      ref_to: blueprint,
      group: '_topic',
      system: true,
      constant: true,
      required: true
    })
  ];
}