declare module 'docxtemplater' {
  import PizZip from 'pizzip';

  interface DocxtemplaterOptions {
    paragraphLoop?: boolean;
    linebreaks?: boolean;
    nullGetter?: (part: any) => string;
  }

  class Docxtemplater {
    constructor(zip: PizZip, options?: DocxtemplaterOptions);
    setData(data: Record<string, any>): void;
    render(): void;
    getZip(): PizZip;
  }

  export = Docxtemplater;
}
