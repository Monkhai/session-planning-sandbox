export default () => {
  let sessionName: string = "";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const splitted = key?.split("-");
      if (
        splitted &&
        splitted[0] === "sb" &&
        splitted[splitted.length - 2] === "auth" &&
        splitted[splitted.length - 1] === "token"
      ) {
        sessionName = key;
        break;
      }
    }
  }

  const data = localStorage.getItem(sessionName);
  if (!data) {
    return null;
  }
  const jsonedData = JSON.parse(data);
  const user_id: string = jsonedData.user.id;
  return user_id;
};
