declare class TemplatingManager{
  constructor(options: TemplatingConstrutorOptions);

  compile(srcFile: String, variables: Object): String;
};

interface TemplatingConstrutorOptions {
  variables?: TemplatingConstrutorVariables
}
interface TemplatingConstrutorVariables {
  prefix: String,
  suffix: String
}