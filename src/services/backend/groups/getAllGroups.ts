import getAll from "../getAll";

export default async <T>() => {
  return getAll<T>("groups");
};
