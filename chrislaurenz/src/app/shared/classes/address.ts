export class Address {
  id?: number;
  country?: string;
  state?: string;
  city?: string;
  post_code?: string;
  street_name?: string;
  type?: string;

  constructor(type?: string, country?: string, state?: string, city?: string, post_code?: string, street_name?: string, id?: number,){
    this.type = type;
    this.country = country;
    this.state = state;
    this.city = city;
    this.post_code = post_code;
    this.street_name = street_name;
    this.id = id;
  }
}