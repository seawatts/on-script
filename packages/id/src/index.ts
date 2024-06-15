import { init } from "@paralleldrive/cuid2";
import { ulid } from "ulid";

export function createId(props?: {
  prefix?: string;
  prefixSeparator?: string;
  length?: number;
  ulid?: boolean;
}) {
  let id: string;

  if (props?.ulid) {
    id = ulid();
  } else {
    const createIdFromInit = init({
      length: props?.length,
    });

    id = createIdFromInit();
  }

  if (props?.prefix) {
    const prefixSeparator = props.prefixSeparator ?? "_";
    id = `${props.prefix}${prefixSeparator}${id}`;
  }

  return id;
}
