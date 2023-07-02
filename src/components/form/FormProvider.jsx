import { FormProvider as RHFormProvider } from "react-hook-form";

/**
 * @description A wrapper component for react-hook-form
 * @param {object} methods
 * @param {function} onSubmit
 * @param {*} children
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function FormProvider({ children, onSubmit, methods }) {
  return (
    <RHFormProvider {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </RHFormProvider>
  );
}

export default FormProvider;
