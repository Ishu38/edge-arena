export interface AIModel {
  id: string;
  name: string;
  provider: string;
  parameters: string;
  contextLength: number;
  quantization: string;
  license: "MIT" | "Apache 2.0" | "Commercial";
  bestFor: string;
  ollamaCommand: string;
  benchmarks: {
    mmlu: number;
    hellaswag: number;
    arc: number;
  };
  tags: string[];
  description: string;
}
