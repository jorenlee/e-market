export class User {
    // ?? are optional parameter
    constructor(
        public email: string,
        public phone: number,
        public name?: string,
        public password?: string,
        public uid?: string,
        public type?: string,
        public status?: string,
    ){}
}