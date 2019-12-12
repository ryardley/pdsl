type PredicateFn<T> = (input: any) => input is T;

type PdslOptions = {
  schemaMode?: boolean;
  abortEarly?: boolean;
  captureErrors?: boolean;
  throwErrors?: boolean;
};

type PdslError = {
  path: string;
  message: string;
};

type PdslSchema = {
  validateSync(a: any): Array<PdslError>;
  validate(a: any): Promise<Array<PdslError>>;
};

declare function predicateCreator<T>(
  strings: TemplateStringsArray,
  ...expressions: any[]
): PredicateFn<T>;

declare namespace predicateCreator {
  var schema: (options?: PdslOptions) => PdslSchema;
  var predicate: <T>(options?: PdslOptions) => PredicateFn<T>;
}

export default predicateCreator;
