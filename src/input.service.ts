import { InputManager } from "./input.manager";

export class InputService {

    private inputManager: InputManager;

    constructor(private htmlInputElement: any, private options: any) {
        this.inputManager = new InputManager(htmlInputElement);
    }

    addNumber(keyCode: number): void {
        if (!this.rawValue) {
            this.rawValue = this.applyMask(false, "0");
        }

        let keyChar = String.fromCharCode(keyCode);
        let selectionStart = this.inputSelection.selectionStart;
        let selectionEnd = this.inputSelection.selectionEnd;
        this.rawValue = this.rawValue.substring(0, selectionStart) + keyChar + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart + 1);
    }

    applyMask(isNumber: boolean, rawValue: string): string {
        let { allowNegative, decimal, precision, prefix, suffix, thousands } = this.options;
        let defaultPrecision = 3;
        rawValue = isNumber ? new Number(rawValue).toFixed(/*precision*/ defaultPrecision) : rawValue;
        let onlyNumbers = rawValue.replace(/[^0-9.]/g, "");

        let moreThanOneDecimalPoint = (onlyNumbers.indexOf(decimal) != onlyNumbers.lastIndexOf(decimal));

        if (!onlyNumbers || moreThanOneDecimalPoint) {
            return "";
        }

        if (onlyNumbers.split('.').length > 1) {
            if (onlyNumbers.split('.')[1].length > defaultPrecision) {
                onlyNumbers = onlyNumbers.substring(0, onlyNumbers.length - 1);
            } else {
                if (this.inputManager.rawValue === '') { //first change
                    onlyNumbers = parseFloat(onlyNumbers).toString(); //remove trailing zeros
                }
            }
        }

        let integerPart = onlyNumbers.slice(0, onlyNumbers.length - precision).replace(/^0*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, thousands);

        if (integerPart == "") {
            integerPart = "0";
        }

        let newRawValue = integerPart;
        let decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);

        // if (precision > 0) {
        //     newRawValue += decimal + decimalPart;
        // }

        let isZero = parseInt(integerPart) == 0 && (parseInt(decimalPart) == 0 || decimalPart == "");
        let operator = (rawValue.indexOf("-") > -1 && allowNegative && !isZero) ? "-" : "";
        return operator + prefix + newRawValue + suffix;
    }

    clearMask(rawValue: string): number {
        if (rawValue == null) {
            return null;
        }

        let value = rawValue.replace(this.options.prefix, "").replace(this.options.suffix, "");

        if (this.options.thousands) {
            value = value.replace(new RegExp("\\" + this.options.thousands, "g"), "");
        }

        if (this.options.decimal) {
            value = value.replace(this.options.decimal, ".");
        }

        return parseFloat(value);
    }

    changeToNegative(): void {
        if (this.options.allowNegative && this.rawValue != "" && this.rawValue.charAt(0) != "-" && this.value != 0) {
            this.rawValue = "-" + this.rawValue;
        }
    }

    changeToPositive(): void {
        this.rawValue = this.rawValue.replace("-", "");
    }

    removeNumber(keyCode: number): void {
        let selectionEnd = this.inputSelection.selectionEnd;
        let selectionStart = this.inputSelection.selectionStart;

        if (selectionStart > this.rawValue.length - this.options.suffix.length) {
            selectionEnd = this.rawValue.length - this.options.suffix.length;
            selectionStart = this.rawValue.length - this.options.suffix.length;
        }

        selectionEnd = keyCode == 46 || keyCode == 63272 ? selectionEnd + 1 : selectionEnd;
        selectionStart = keyCode == 8 ? selectionStart - 1 : selectionStart;
        this.rawValue = this.rawValue.substring(0, selectionStart) + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart);
    }

    updateFieldValue(selectionStart?: number): void {
        let newRawValue = this.applyMask(false, this.rawValue || "");
        selectionStart = selectionStart == undefined ? this.rawValue.length : selectionStart;
        this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart);
    }

    updateOptions(options: any): void {
        let value: number = this.value;
        this.options = options;
        this.value = value;
    }

    get canInputMoreNumbers(): boolean {
        return this.inputManager.canInputMoreNumbers;
    }

    get inputSelection(): any {
        return this.inputManager.inputSelection;
    }

    get rawValue(): string {
        return this.inputManager.rawValue;
    }

    set rawValue(value: string) {
        this.inputManager.rawValue = value;
    }

    get storedRawValue(): string {
        return this.inputManager.storedRawValue;
    }

    get value(): number {
        return this.clearMask(this.rawValue);
    }

    set value(value: number) {
        this.rawValue = this.applyMask(true, "" + value);
    }
}
