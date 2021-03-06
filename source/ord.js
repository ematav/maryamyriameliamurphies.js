/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * ord.js
 *
 * @file Ord type class.
 * @license ISC
 */

/** @module ord */

import {partial} from './base';

import {isEq} from './eq';

import {
  defines,
  dataType,
  typeCheck
} from './type';

import {error} from './error';

/**
 * The `Ord` type class is used for totally ordered datatypes. Instances of `Ord` must define a
 * `compare` method and must also be instances of `Eq`.
 * @param {*} - Any object
 * @returns {boolean} `true` if an object is an instance of `Ord` and `false` otherwise
 * @kind function
 */
export const Ord = defines(`isEq`, `compare`);

/**
 * A data constructor for orderings of objects that can be compared, implemented as a class because
 * Ordering in Haskell is a monoid. There is no reason to ever create any other new objects from
 * this class.
 * @kind class
 * @alias module:ord.Ordering
 * @private
 */
class Ordering {
  /**
   * Create a new ordering, a relationship that represents a comparison between two objects.
   * @param {string} ord - A string representing the type of ordering
   */
  constructor(ord) { this.ord = () => ord; }
   static mempty() { return EQ; }
   static mappend(a, b) {
     if (a === EQ) { return b; }
     return a === LT ? LT : GT;
   }
   valueOf() { return this.ord(); }
}

/**
 * The "equals" `Ordering`. Equivalent to ===.
 * @const {Ordering} EQ
 */
export const EQ = new Ordering(`EQ`);

/**
 * The "less than" `Ordering`. Equivalent to <.
 * @const {Ordering} LT
 */
export const LT = new Ordering(`LT`);

/**
 * The "greater than" `Ordering`. Equivalent to >.
 * @const {Ordering} GT
 */
export const GT = new Ordering(`GT`);

/**
 * Compare two objects and return an `Ordering`. Both values must be instances of the `Ord` type
 * class (i.e. they both define a `compare` method) and must also be the same data type (or
 * primitive type). Note that only a single comparison is required to determine the precise ordering
 * of two objects.
 * <br>`Haskell> compare :: a -> a -> Ordering`
 * @param {*} a - Any object
 * @param {*} b - Any object
 * @returns {Ordering} The `Ordering` value (`EQ`, `LT`, or `GT`)
 * @kind function
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * compare(lst1, lst2);      // => LT
 * compare(lst2, lst1);      // => GT
 * const tup1 = tuple(1,2);
 * const tup2 = tuple(2,1);
 * const tup3 = swap(tup2);
 * compare(tup1, tup2);      // => LT
 * compare(tup2, tup3);      // => GT
 * compare(tup3, tup1);      // => EQ
 */
export const compare = (a, b) => {
  const compare_ = (a, b) => {
    if (a === Infinity) { return GT; }
    if (b === Infinity) { return LT; }
    if (typeCheck(a, b)) {
      if (Ord(a)) { return dataType(a).compare(a, b); }
      if (isEq(a, b)) { return EQ; }
      return a < b ? LT : GT;
    }
    return error.typeMismatch(a, b, compare);
  }
  return partial(compare_, a, b);
}

/**
 * Determine whether one value is less than another.
 * <br>`Haskell> (<) :: a -> a -> Bool`
 * @param {*} a - Any object
 * @param {*} b - Any object
 * @returns {boolean} a < b
 * @kind function
 */
export const lessThan = (a, b) => {
  const lessThan_ = (a, b) => compare(a, b) === LT;
  return partial(lessThan_, a, b);
}

/**
 * Determine whether one value is less than or equal to another.
 * <br>`Haskell> (<=) :: a -> a -> Bool`
 * @param {*} a - Any object
 * @param {*} b - Any object
 * @returns {boolean} a <= b
 * @kind function
 */
export const lessThanOrEqual = (a, b) => {
  const lessThanOrEqual_ = (a, b) => compare(a, b) !== GT;
  return partial(lessThanOrEqual_, a, b);
}

/**
 * Determine whether one value is greater than another.
 * <br>`Haskell> (>) :: a -> a -> Bool`
 * @param {*} a - Any object
 * @param {*} b - Any object
 * @returns {boolean} a > b
 * @kind function
 */
export const greaterThan = (a, b) => {
  const greaterThan_ = (a, b) => compare(a, b) === GT;
  return partial(greaterThan_, a, b);
}

/**
 * Determine whether one value is greater than or equal to another.
 * <br>`Haskell> (>=) :: a -> a -> Bool`
 * @param {*} a - Any object
 * @param {*} b - Any object
 * @returns {boolean} a >= b
 * @kind function
 */
export const greaterThanOrEqual = (a, b) => {
  const greaterThanOrEqual_ = (a, b) => compare(a, b) !== LT;
  return partial(greaterThanOrEqual_, a, b);
}

/**
 * Return the higher in value of two objects.
 * <br>`Haskell> max :: a -> a -> a`
 * @param {*} a - Any object
 * @param {*} b - Any object
 * @returns {*} `a` or `b`, whichever is greater
 * @kind function
 * @example
 * const tup1 = tuple(1,2);
 * const tup2 = tuple(2,1);
 * const tup3 = swap(tup2);
 * max(tup1, tup2);         // => (2,1)
 * max(tup2, tup1);         // => (2,1)
 * max(tup3, tup1);         // => (1,2)
 */
export const max = (a, b) => {
  const max_ = (a, b) => lessThanOrEqual(a, b) ? b : a;
  return partial(max_, a, b);
}

/**
 * Return the lower in value of two objects.
 * <br>`Haskell> min :: a -> a -> a`
 * @param {*} a - Any object
 * @param {*} b - Any object
 * @returns {*} `a` or `b`, whichever is lesser
 * @kind function
 * @example
 * const tup1 = tuple(1,2);
 * const tup2 = tuple(2,1);
 * const tup3 = swap(tup2);
 * min(tup1, tup2);         // => (1,2)
 * min(tup2, tup1);         // => (1,2)
 * min(tup3, tup1);         // => (1,2)
 */
export const min = (a, b) => {
  const min_ = (a, b) => lessThanOrEqual(a, b) ? a : b;
  return partial(min_, a, b);
}
