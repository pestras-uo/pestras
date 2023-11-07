export class Serial {

  static readonly separator = '_';

  static readonly partLength = 4;

  static readonly regex = new RegExp(`^([0-9]{13})([A-Z]{3})([A-Z0-9]{${this.partLength}})((_([0-9]{13})([A-Z]{3})([A-Z0-9]{${this.partLength}}))*)$`);

  static isValid(serial: string) {
    return typeof serial === 'string' && (serial === "*" || this.regex.test(serial));
  }

  static isRoot(serial: string) {
    return this.countLevels(serial) === 1;
  }

  static countLevels(serial: string | null) {
    return serial ? serial.split(this.separator).length : 0;
  }

  static getRoot(serial: string) {
    const parts = serial.split(this.separator);
    return parts[parts.length - 1];
  }

  static getParent(serial: string) {
    return serial.split(this.separator)[1];
  }

  static getLocal(serial: string) {
    return serial.split(this.separator)[0];
  }

  static isChild(parent: string, child: string, level = 1, exact_lavel = true) {
    return parent === "*"
      ? exact_lavel 
        ? (child !== "*") && this.countLevels(parent) === level
        : (child !== "*") && this.countLevels(parent) >= level
      : child.endsWith(parent) && (
      exact_lavel
        ? this.countLevels(child) - this.countLevels(parent) === level
        : this.countLevels(child) - this.countLevels(parent) >= level
    );
  }

  static toTree(serial: string) {
    const all: string[] = [];
    const blocks = serial.split(this.separator).reverse();

    for (let i = 0; i < blocks.length; i++)
      all.push([blocks[i]].concat(all).join(('_')));

    return all;
  }

  static areSiblings(left: string, right: string) {
    return this.getParent(left) === this.getParent(right);
  }

  static isBranch(branch: string, from: string, orSelf = false) {
    return from === "*"
      ? orSelf || branch !== '*'
      : orSelf ? branch.endsWith(from) : branch.endsWith(from) && from !== branch;
  }

  static getSharedParent(left: string, right: string) {
    if (left === "*" || right === "*")
      return "*";
    const looper = this.countLevels(left) > this.countLevels(right) ? right : left;
    const other = looper === left ? right : left;
    const tree = this.toTree(looper).reverse();

    for (const serial of tree)
      if (other.endsWith(serial))
        return serial;

    return null;
  }

  static dateOf(serial: string) {
    return serial === "*" ? new Date(0) : new Date(+this.getLocal(serial).slice(0, 13));
  }

  static abbr(serial: string) {
    return serial === "*" ? "ROT" : serial.slice(13, 16);
  }

  static gen(abbr = "RCD", parentSerial = '') {
    const chars = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'Y', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];

    const ts = Date.now();

    const parts: string[] = [];

    for (let i = 0; i < this.partLength; i++)
      parts.push(chars[Math.round(Math.random() * 35)]);

    const newSerial = `${ts}${abbr.toUpperCase().slice(0, 3)}${parts.join("")}`;

    return parentSerial ? `${newSerial}${this.separator}${parentSerial}` : newSerial;
  }
}