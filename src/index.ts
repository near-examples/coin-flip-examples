import { NearBindgen, NearContract, call, view, near } from 'near-sdk-js';

// The @NearBindgen decorator allows this code to compile to WebAssembly.
@NearBindgen
class MyContract extends NearContract {
  myGreeting: string;

  constructor() {
    //execute the NEAR Contract's constructor
    super();
    this.myGreeting = 'Hello Web3 World!';
  }

  default() {
    return new MyContract()
  }

  // @call indicates that this is a 'change method' or a function
  // that changes state on the blockchain. Change methods cost gas.
  // For more info -> https://docs.near.org/docs/concepts/gas
  @call
  setGreeting({ message }: { message: string }) {   
    near.log(`Saving greeting ${message}`);
    this.myGreeting = message;
  }

  // @view indicates a 'view method' or a function that returns
  // the current values stored on the blockchain. View calls are free
  // and do not cost gas.
  @view
  viewGreeting(): string {
    near.log(`The current greeting is ${this.myGreeting}`);
    return this.myGreeting;
  }
}