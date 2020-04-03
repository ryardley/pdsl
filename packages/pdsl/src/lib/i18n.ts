const dict = {
  btw: "Number $1 is not between $2 and $3",
  btwe: "Number $1 is not in range [$2..$3]",
  lt: "Number $1 is not less than $2",
  lte: "Number $1 is not less than or equal to $2",
  gt: "Number $1 is not greater than $2",
  gte: "Number $1 is not greater than or equal to $2",
  arrArgMatch: "Array $1 does not match given predicate pattern",
  arrTypeMatch: "Array $1 does not match given type",
  arrIncl: "Array $1 does not include specified types",
  or: "Value $1 does not satisfy 'or' predicate",
  and: "Value $1 does not satisfy 'and' predicate",
  not: "Value $1 does not satisfy 'not' predicate",
  extant: "Value $1 is either null or undefined",
  truthy: "Value $1 is not truthy",
  falsey: "Value $1 is not falsey",
  obj: "Value $1 did not match object predicates",
  val: "Value $1 did not match value $2",
  deep: "Value $1 did not match value $2",
  regx: "Value $1 did not match regexp $2",
  prim: "Value $1 is not of type $2",
  strLen: "Length of string $1 does not match",
  arrLen: "Length of array $1 does not match"
};

export function lookup(key: string) {
  return dict[key as keyof typeof dict];
}
