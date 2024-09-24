import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
	statusCode = 400;
	reason = 'Bad request';
	constructor(public message: string) {
		super(message);
		//extending  builtin class
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}
	serializeErrors() {
		return [{ message: this.message }];
	}
}
