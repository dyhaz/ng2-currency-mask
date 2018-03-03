# ng2-money

A very simple currency mask directive for Angular that allows using a number attribute with the ngModel (forked from github.com/cesarrew/ng2-currency-mask).

Part of Engin3 VDI

## Getting Started

### Installing and Importing

Install the package by command:

```sh
    npm install ng2-money --save
```

Import the module

```ts
import { CurrencyMaskModule } from "ng2-money";

@NgModule({
    imports: [
        ...
        CurrencyMaskModule
    ],
    declarations: [...],
    providers: [...]
})
export class AppModule {}
```

### Using 

```html
    <input currencyMask [(ngModel)]="value" />
```

 * `ngModel` An attribute of type number. If is displayed `'$ 25.63'`, the attribute will be `'25.63'`.

### Options 

You can set options...

```html
    <!-- example -->
    <input currencyMask [(ngModel)]="value"/>
```  

## Questions? Open a Issue!