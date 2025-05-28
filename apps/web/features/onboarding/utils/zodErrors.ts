import { z } from "zod";

const setupZodErrors = () => {
  z.setErrorMap((issue, ctx) => {
    switch (issue.code) {
      case "too_small":
        if (issue.minimum === 1) {
          const message = `Il campo ${issue.path[0]} deve avere almeno ${issue.minimum} caratter${
            issue.minimum === 1 ? "e" : "i"
          }`;
          return { message };
        } else if (issue.exact) {
          const message = `Il campo ${issue.path[0]} deve avere esattamente ${issue.minimum} caratteri`;
          return { message };
        }
        break;

      case "too_big":
        if (issue.maximum) {
          const message = `Il campo ${issue.path[0]} deve avere al massimo ${issue.maximum} caratter${
            issue.maximum === 1 ? "e" : "i"
          }`;
          return { message };
        }
        break;
    }
    return { message: ctx.defaultError };
  });
};

export { setupZodErrors };
