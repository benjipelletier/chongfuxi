import { Model } from "./models/base.js"

export class Test extends Model {
    get defaults() {
        return {
            firstName: "",
            lastName: "",
            position: "testPos",
            number: 3
        }
    }
    changeNumber(num) {
        this.number = num
    }
}
