export default function predicateCreator<T>(
  strings: TemplateStringsArray,
  ...expressions: any[]
): (input: any) => input is T;
