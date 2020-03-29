import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Address } from 'src/app/shared/classes/address';
import { TranslateService } from '@ngx-translate/core';
import { AddressService } from 'src/app/shared/services/address.service';
declare var $: any;

@Component({
  selector: 'app-address-mangement',
  templateUrl: './address-mangement.component.html',
  styleUrls: ['./address-mangement.component.css']
})
export class AddressMangementComponent implements OnInit, OnDestroy  {

  @Input() customerId: number;
  @Input() addresses: Address[];
  form: any = {};
  country:string = '';
  state:string = '';
  city:string = '';
  postCode:string = '';
  street:string = '';
  noData: string = '';
  actionsTitle: string = '';
  actionEdit: string = '';
  actionSave: string = '';
  actionCancel: string = '';
  addressType: string = '';
  isNewAddressSaved = false;
  errorMessage = '';
  public settings: any = {};

  private billingAddress = '';
  private shippingAddress = '';

  constructor(translate: TranslateService, private addressService: AddressService) { 
    translate.get('country').subscribe((res: string) => { this.country = res; });
    translate.get('state').subscribe((res: string) => { this.state = res; });
    translate.get('city').subscribe((res: string) => { this.city = res; });
    translate.get('post-code').subscribe((res: string) => { this.postCode = res; });
    translate.get('street').subscribe((res: string) => { this.street = res; });
    translate.get('no-data').subscribe((res: string) => { this.noData = res; });
    translate.get('actions').subscribe((res: string) => { this.actionsTitle = res; });
    translate.get('edit').subscribe((res: string) => { this.actionEdit = res; });
    translate.get('save-change').subscribe((res: string) => { this.actionSave = res; });
    translate.get('cancel').subscribe((res: string) => { this.actionCancel = res; });
    translate.get('address-type').subscribe((res: string) => { this.addressType = res; });
    translate.get('address-billing').subscribe((res: string) => { this.billingAddress = res; });
    translate.get('address-shipping').subscribe((res: string) => { this.shippingAddress = res; });
    this.settings = {
      attr: {
        class: 'table cart-table table-responsive-xs'
      },
      hideSubHeader: true,
      noDataMessage: this.noData,
      actions: {
        columnTitle: this.actionsTitle,
        delete: false,
        position: 'right'
      },
      edit : {
        editButtonContent: this.actionEdit,
        saveButtonContent: this.actionSave,
        cancelButtonContent: this.actionCancel,
        confirmSave: true
      },
      columns: {
        type: {
          title: this.addressType,
          valuePrepareFunction: (value) => {
            if (value === 'address-billing')
              return this.billingAddress;
            else if (value === 'address-shipping')
              return this.shippingAddress;
          },
          editor: {
            type: 'list',
            config: {
              list: [{ value: 'address-billing', title: this.billingAddress }, { value: 'address-shipping', title: this.shippingAddress }]
            }
          }
        },
        street_name: {
          title: this.street
        },
        post_code: {
          title: this.postCode
        },
        city: {
          title: this.city
        },
        state: {
          title: this.state
        },
        country: {
          title: this.country
        }
      },
      
    };
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    $('.addAddressModal').modal('hide');
  }

  onSaveClicked(event) {
    this.addressService.updateUser(event.newData).subscribe(
      data => {
        console.log("Respoonse: ");
        console.log(data);
        event.confirm.resolve(event.newData);
      },
      error => {
        console.log("Error: ");
        console.log(error);
        this.errorMessage = error.error;
      }
    );
  }

  onSubmit() {
    let newAddres = new Address(this.form.type, this.form.country, this.form.state, this.form.city, this.form.postCode, `${this.form.streetName} ${this.form.streetNumber}`);
    this.addressService.postAddress(newAddres, this.customerId).subscribe(
      data => {
        console.log("Respoonse: ");
        console.log(data);
        this.reloadPage();
      },
      error => {
        console.log("Error:");
        console.log(error);
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }
}
