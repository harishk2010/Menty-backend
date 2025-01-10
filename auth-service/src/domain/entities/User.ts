export class User {
    id?: string;
    // name: string;
    email: string;
    password: string;
  
    constructor( email: string, password: string, id?: string) {
      // this.name = name;
      this.email = email;
      this.password = password;
      if (id) this.id = id;
    }
  }
  