export class TokenClass {
    public title: string;
    public price: number;
    public amount: number;
  
    constructor(title: string) {
      this.title = title;
      this.price = 0;
      this.amount = 0;
    }
  
    public generateRandomValues() {
      this.price = Math.floor(100 * Math.random());
      this.amount = Math.floor(100 * Math.random());
    }
  }