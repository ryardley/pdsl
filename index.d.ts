export default function predicateCreator<T extends object>(
  strings: TemplateStringsArray,
  ...expressions: any[]
): (input: any) => input is T;
