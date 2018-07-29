class StatusError extends Error {
  constructor(status, ...args) {
    super(...args);
    Object.assign(this, { status });
  }
  
  match({ notFound, unknown, invalidArguments }) {
    return (this.status === StatusError.NotFound
      ? notFound
      : this.status === StatusError.InvalidArguments
        ? invalidArguments
        : unknown
    )(this);
  }
  
  static Unknown = Symbol("Unknown");
  static NotFound = Symbol("Not Found");
  static InvalidArguments = Symbol("Invalid Arguments");
}

export function mapToStatusError(err, status = StatusError.Unknown) {
  if (err instanceof StatusError) return err;
  
  return new StatusError(status, err.message);
}

export function notFound(message) {
  return new StatusError(StatusError.NotFound, message);
}

export function invalidArguments(message) {
  return new StatusError(StatusError.InvalidArguments, message);
}

export function unknown(message) {
  return new StatusError(StatusError.Unknown, message);
}
