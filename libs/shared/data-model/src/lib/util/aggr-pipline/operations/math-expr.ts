/* eslint-disable @typescript-eslint/no-explicit-any */

import { AggrOperation, AggrOperationType } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";

export interface MathExprOperationOptions {
  expr: string;
  unit: string;
  variables: string[];
}

export class MathExprOperation extends AggrOperation<MathExprOperationOptions> {

  constructor(options: MathExprOperationOptions) {
    super(AggrOperationType.MATH_EXPR);

    this.validateVariables(options);

    this.options = options;
  }

  protected aggMathExp() {
    return MathExp.ToAggr(this.options.expr, this.options.variables);
  }
  
  validateVariables(options: MathExprOperationOptions) {
    return MathExp.Validate(options.expr, options.variables);
  }
  
  static GetVariablesFromMathExpr(expr: string) {
    const reg = /\$[a-zA-Z][a-zA-Z_0-9]+/g;
    const list = expr.match(reg)
  
    return list && list.length
    ? Array.from(new Set(list.map(m => m.slice(1))))
    : [];
  }

  static override OutputType(options: MathExprOperationOptions): TypedEntity {
    return createTypedEntity({ type: 'double', unit: options.unit });
  }

  compile() {
    return this.aggMathExp();
  }
}



export class EqError extends Error { }
export class EqRefError extends Error { }
export class EqUnknownOperatorError extends Error { }

const operators: string[] = ['+', '-', '*', '/'];
const constants: string[] = ['PI', 'E', 'LN10', 'LN2', 'LOG10E', 'LOG2E', 'SQRT1_2', 'SQRT12']
const funcs: string[] = [
  'abs', 'ceil', 'exp', 'floor', 'ln', 'log', 'mod', 'pow', 'round', 'sqrt', 'trunc',
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'asinh', 'acosh', 'atanh', 'sinh', 'cosh', 'tanh',
  'degreesToRadians', 'radiansToDegrees'
];


class MathExp {
  private _parts: string[] = [];

  private constructor(public readonly exp: string, public readonly vars: string[] = []) {
    this.exp = this._validate(exp);
  }


  private static ArrangeGroups(exp: string) {
    // remove space and split each charactar
    const parts = exp.replace(/\s/g, '').split("");
    // open braces count
    let open = 0;
    // close braces count
    let close = 0;
    // distinguish between func open braces and other use of braces
    const funcBraces: [isFunc: boolean, i: number][] = [];

    for (let i = 0; i < parts.length; i++) {
      // increment open braces
      if (parts[i] === '(') {
        open++;

        // add to open braces list
        funcBraces.unshift([!!parts[i - 1] && /[a-z]/.test(parts[i - 1]), i]);

      }
      // increment close braces
      else if (parts[i] === ')') {
        close++;

        // if close brace belongs to a func open brace
        // then double the braces
        if (funcBraces[0][0]) {
          parts[i] = '))';
          parts[funcBraces[0][1]] = '((';
        }

        funcBraces.shift();
      }

      if (close > open)
        throw new EqError(`extra close braces found at column: ${i}`);
    }

    if (close !== open)
      throw new EqError(`open and close braces do not match`);


    return parts.join("").replace(/,/g, "),(");
  }




  static Clean(exp: string) {
    exp = MathExp.ArrangeGroups(exp);

    // remove spaces
    exp = exp.replace(/\s/g, '');

    // merge signs + and -
    while (/([-+])([-+])/.test(exp))
      exp = exp.replace(/([-+])([-+])/g, (_, $1, $2) => $1 === $2 ? '+' : '-');

    // add space around signs
    exp = exp.replace(/([^_])([+\-*/])/g, (_, $1, $2) => `${$1} ${$2} `)
    // merge frequent spaces
    exp = exp.replace(/\s{2,}/g, " ");
    // add multiply sign between concatenated numbers and variables
    exp = exp.replace(/(^|\s)(\d+)\s?(\$|\(|[a-zA-Z])/g, (_, $1, $2, $3) => `${1}${$2} * ${$3}`);

    return exp;
  }




  private _validateValue(value: string): void {
    const indexOf$ = value.indexOf('$');

    // if value starts with '$'
    if (indexOf$ === 0) {
      // if inludes ',' split and validate each item
      if (value.indexOf(',') > -1) {
        const pair = value.split(',')
        for (const v of pair)
          this._validateValue(v);
      }
      // if it is a part reference then continue
      else if (!isNaN(+value.slice(1)))
        return;

      // last case is a variable, then validate when variables are constrainted
      else if (this.vars.length && this.vars.indexOf(value.slice(1)) === -1)
        throw new EqRefError(`unkown reference '${value}'`);

      return;
    }
    // if it is a function call
    else if (indexOf$ > 0) {
      const [fname, arg] = value.split('$');

      // validate function name
      if (funcs.indexOf(fname) === -1)
        throw new EqRefError(`unkown function '${fname}'`);

      return this._validateValue(arg);

      // last cases are:
      // value should be a number
      // or a constant
      // or an operator
    } else if (isNaN(+value) &&
      value.indexOf('$') === -1 &&
      constants.indexOf(value) === -1 &&
      operators.indexOf(value) === -1)
      throw new EqRefError(`unkown reference '${value}'`);

    return;
  }




  private _validate(exp: string) {
    exp = MathExp.Clean(exp);
    exp = this._breakExp(exp);

    for (const part of this._parts) {
      const blocks = part.split(' ');

      for (const block of blocks)
        this._validateValue(block);
    }

    return exp;
  }




  static Validate(exp: string, variables: string[] = []) {
    try {
      new MathExp(exp, variables);
      return null;
    } catch (error: any) {
      return error.message;
    }
  }



  // convert expression to mongo aggregation operators
  static ToAggr(exp: string, variables: string[] = []) {
    return new MathExp(exp, variables)._export();
  }




  private *_breakPart(blocks: string[]) {
    // return first block 
    yield [blocks[0], blocks[1], blocks[2]].join(' ');

    // for each additional operator with a value
    // return the last part reference with with th e addition two items
    for (let i = 3; i < blocks.length; i += 2)
      yield [`$${this._parts.length - 1}`, blocks[i], blocks[i + 1]].join(' ');
  }

  private _breakExp(exp: string) {
    let match: string | null;
    exp = `(${exp})`;

    this._parts = [];

    // match open close braces and convert each expression to an indivdual part and reference
    while ((match = /\([^(]+?\)/.exec(exp)?.[0] as string)) {
      const blocks = match.slice(1, -1).split(' ');

      if (blocks.length <= 3)
        this._parts.push(match.slice(1, -1));
      else
        for (const part of this._breakPart(blocks))
          this._parts.push(part);

      exp = exp.replace(match, `$${this._parts.length - 1}`);
    }

    return exp;
  }




  private _getValue(str: string): any {
    // if number return value
    if (!isNaN(+str))
      return +str;

    // if it is a constant return the constant value
    if (constants.indexOf(str) > -1)
      return Math[str as 'E'];


    if (str.startsWith('$')) {
      // if it is a variable return variable
      if (isNaN(+str.slice(1)))
        return str;

      // if it is a part reference then return that part
      if (this._parts[+str.slice(1)])
        return this._exportPart(this._parts[+str.slice(1)]);
    }

    // if it is a funtion with args
    if (str.indexOf('$') > 0) {
      const [fname, args] = str.split('$');
      return { [`$${fname}`]: this._getValue('$' + args) };
    }

    // revalute expression
    return this._exportPart(str);
  }




  // evalute basic operators
  private _basicOperators(op: string, left: string, right: string) {
    if (op === '+')
      return { $add: [this._getValue(left), this._getValue(right)] }

    if (op === '-')
      return { $subtract: [this._getValue(left), this._getValue(right)] }

    if (op === '*')
      return { $multiply: [this._getValue(left), this._getValue(right)] }

    // in case of division, check for none 0 denominator
    if (op === '/') {
      // when explicitly 0, then return 0
      if (this._getValue(right) === 0)
        return 0;

      // other wise add a conditional case for the denominator value
      return {
        $cond: [
          { $eq: [this._getValue(right), 0] },
          0,
          { $divide: [this._getValue(left), this._getValue(right)] }
        ]
      }
    }

    throw new EqUnknownOperatorError(`unknwon operator: ${op}`);
  }



  private _exportPart(part: string): any {
    // if it is referenence
    if (part.indexOf(' ') === -1) {
      // return  number
      if (!isNaN(+part))
        return +part;

      // split function args to array and get value for each 
      if (part.indexOf(',') > -1)
        return part.split(',').map(s => this._getValue(s));

      // get value for any othe case
      if (part.indexOf('$') > -1)
        return this._getValue(part);

      throw new EqRefError(`unkown reference '${part}'`);
    }

    // evalute baic operator by priority
    const parts = part.split(' ');
    let index = parts.findIndex(char => char === '*' || char === '/');;

    if (index > -1) {
      const tri = [parts[index - 1], parts[index], parts[index + 1]];
      return this._basicOperators(tri[1], tri[0], tri[2]);
    }

    index = parts.findIndex(char => char === '+' || char === '-');;

    if (index > -1) {
      const tri = [parts[index - 1], parts[index], parts[index + 1]];
      return this._basicOperators(tri[1], tri[0], tri[2]);
    }
  }



  private _export() {
    return this._exportPart(this._parts[this._parts.length - 1]);
  }
}