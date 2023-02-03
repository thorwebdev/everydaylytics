import { JSX } from "preact";

export function Link(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      class="px-2 py-1 border(gray-100 2) hover:bg-gray-200"
    >
      {props.children}
    </a>
  );
}
