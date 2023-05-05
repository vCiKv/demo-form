const createClass = (classNameA: string, ...ClassNameN: string[]) => {
  return ClassNameN.concat(classNameA).join(" ");
};
export default createClass