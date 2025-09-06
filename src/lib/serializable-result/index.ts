// `neverthrow` の Result はクラスベースなので、Server Actions の返り値などで
// シリアライズできない問題がある。
// シリアライズ可能な簡易 Result を定義する。

export type SerializableResult<S, E> = SerializableOk<S> | SerializableErr<E>;

export type SerializableOk<S> = { success: true; value: S };
export type SerializableErr<E> = { success: false; error: E };

export function ok<S, E = never>(value: S): SerializableResult<S, E> {
  return { success: true, value };
}

export function err<E, S = never>(error: E): SerializableResult<S, E> {
  return { success: false, error };
}

export function isOk<S, E>(
  result: SerializableResult<S, E>,
): result is SerializableOk<S> {
  return result.success === true;
}

export function isErr<S, E>(
  result: SerializableResult<S, E>,
): result is SerializableErr<E> {
  return result.success === false;
}

export function _unsafeUnwrap<S, E>(result: SerializableResult<S, E>): S {
  if (isOk(result)) return result.value;
  throw new Error(`Called _unsafeUnwrap on an Err value: ${result.error}`);
}

export function _unsafeUnwrapErr<S, E>(result: SerializableResult<S, E>): E {
  if (isErr(result)) return result.error;
  throw new Error(`Called _unsafeUnwrapErr on an Ok value: ${result.value}`);
}
